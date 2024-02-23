<script lang="ts">
import {clamp, debounce, get, kebabCase, keys, max, min, pickBy, values} from 'lodash'

import * as d3 from 'd3'
import {geoRobinson} from 'd3-geo-projection'
import type {GeoProjection} from 'd3-geo'
import {geoGraticule} from 'd3-geo'
import {feature} from 'topojson'
import {GeometryCollection} from "topojson-specification";

import {ComponentPublicInstance, computed, defineComponent, PropType, provide, ref, watch} from 'vue'

import {ParentKey} from "@/keys";
import {MapTransform, ParentMap} from "@/types";
import config from '../config'
import {chartEmits, chartProps, getChartProps, useChart} from '@/composables/chart'
import ScaleLegend from '@/components/ScaleLegend.vue'

export default defineComponent({
  name: 'ChoroplethMap',
  components: {
    ScaleLegend
  },
  props: {
    /**
     * Covers the empty values with a hatched pattern.
     */
    hatchEmpty: {
      type: Boolean
    },
    /**
     * Hide the legend of the map.
     */
    hideLegend: {
      type: Boolean
    },
    /**
     * Change the scale function used to get calculate a feature color.
     */
    featureColorScale: {
      type: Function,
      default: null
    },
    /**
     * Change the color of the outline.
     */
    outlineColor: {
      type: String,
      default: 'currentColor'
    },
    /**
     * Change the color of the graticule.
     */
    graticuleColor: {
      type: String,
      default: 'currentColor'
    },
    /**
     * Maximum value to use in the color scale.
     */
    max: {
      type: Number as PropType<number | null>,
      default: null
    },
    /**
     * Minimum value to use in the color scale.
     */
    min: {
      type: Number as PropType<number | null>,
      default: null
    },
    /**
     * If true the map should be clickable (and zoom on a given feature).
     */
    clickable: {
      type: Boolean
    },
    /**
     * Field in the topojson containing all the feature objects.
     */
    topojsonObjects: {
      type: String,
      default: 'countries1'
    },
    /**
     * Field in the topojson objects containing the id of a feature. This field supports dot notation for nested values.
     */
    topojsonObjectsPath: {
      type: [String, Array] as PropType<string | string[]>,
      default: 'id'
    },
    /**
     * URL of the topojson.
     */
    topojsonUrl: {
      type: String,
      default: () => {
        return config.get('map.topojson.world-countries-sans-antarctica')
      }
    },
    /**
     * Duration of the transitions.
     */
    transitionDuration: {
      type: Number,
      default: 750
    },
    /**
     * If true the user will be able to navigate in the map with drag and mouse wheel.
     */
    zoomable: {
      type: Boolean
    },
    /**
     * Set to true if your projection is spherical.
     */
    spherical: {
      type: Boolean
    },
    /**
     * Minium zoom value.
     */
    zoomMin: {
      type: Number,
      default: 1
    },
    /**
     * Maximum zoom value.
     */
    zoomMax: {
      type: Number,
      default: 8
    },
    /**
     * Initial zoom value.
     */
    zoom: {
      type: Number,
      default: null
    },
    /**
     * Initial center of the map.
     */
    center: {
      type: Array as PropType<number[]>,
      default: null
    },
    /**
     * Projection object from d3 to draw the features.
     * @see https://d3js.org/d3-geo/projection
     */
    projection: {
      type: Function,
      default: geoRobinson
    },
    /**
     * If true the map will display an sphere outline arround the world.
     */
    outline: {
      type: Boolean
    },
    /**
     * If true the map will display a graticule grid (representing parallels and meridians).
     */
    graticule: {
      type: Boolean
    },
    /**
     * Maximum height used by the map.
     */
    height: {
      type: String,
      default: '300px'
    },
    /**
     * Neutral color of the map's features.
     */
    color: {
      type: String,
      default: '#fff'
    },
    /**
     * Neutral color of the map s features in social mode.
     */
    socialColor: {
      type: String,
      default: '#000'
    },
    ...chartProps()
  },
  emits: ["click", 'reset', 'zoomed', ...chartEmits],
  setup(props, {emit}) {

    const resizable = ref<ComponentPublicInstance<HTMLElement> | null>(null)
    const topojson = ref<any>(null)
    const topojsonPromise = ref<any | null>(null)
    const mapRect = ref<DOMRect>(new DOMRect(0, 0, 0, 0))
    const featureCursor = ref<{ [cursor: string]: string } | null>(null)
    const featureZoom = ref<string | null>(null)
    const isLoaded = ref<boolean>(false)
    const mapTransform = ref<MapTransform>({k: 1, x: 0, y: 0, rotateX: 0, rotateY: 0})

    const debouncedDraw = debounce(function () {
      draw()
    }, 10)

    const {loadedData} = useChart(resizable, getChartProps(props), {emit}, isLoaded, debouncedDraw, afterLoaded)

    async function afterLoaded() {
      return new Promise<void>(async (resolve) => {
        await loadTopojson()
        draw()
        resolve()
      })
    }

    const sphericalCenter = computed((): [number, number] => {
      const [lng = 0, lat = 0] = props.center ?? [0, 0]
      return [-lng, -lat]
    })

    const planarCenter = computed((): [number, number] => {
      const [lng = 0, lat = 0] = props.center ?? [0, 0]
      return [lng, lat]
    })
    const featureColorScaleEnd = computed(() => {
      const defaultColor = '#852308';
      const node = map.value?.node();
      if (isLoaded.value && node) {
        const computedStyle = window.getComputedStyle(node)
        return computedStyle.getPropertyValue('--primary') || defaultColor
      }
      return defaultColor
    })
    const featureColorScaleStart = computed(() => {
      // `socialMode` is always different from null but accessing it will make
      // this computed property reactive.
      const defaultColor = '#fff';
      const node = map.value?.node();
      if (isLoaded.value && props.socialMode !== null && node) {
        const computedStyle = window.getComputedStyle(node)
        return computedStyle.getPropertyValue('color') || defaultColor
      }
      return defaultColor
    })
    const featureColor = computed(() => {
      return (d: number) => {
        const id = get(d, props.topojsonObjectsPath)
        const hasIdProp = loadedData.value && id in loadedData.value;
        return hasIdProp ? featureColorScaleFunction.value(loadedData.value[id]) : undefined
      }
    })
    const featureColorScaleFunction = computed(() => {
      if (props.featureColorScale !== null) {
        return props.featureColorScale
      }
      return defaultFeatureColorScale.value
    })

    const graticuleLines = computed(() => {
      return geoGraticule().step([20, 20])()
    })

    const defaultFeatureColorScale = computed(() => {
      return d3
          .scaleSequential()
          .domain([Math.max(1, minValue.value), maxValue.value])
          .range([featureColorScaleStart.value, featureColorScaleEnd.value])
    })
    const initialFeaturePath = computed(() => {
      return featurePath.value.projection(initialMapProjection.value)
    })
    const initialGraticulePath = computed(() => {
      return initialFeaturePath.value(graticuleLines.value)
    })

    const initialMapProjection = computed(() => {
      if (props.spherical) {
        return mapProjection.value.rotate(sphericalCenter.value)
            .fitHeight(mapHeight.value, geojson.value)
            .translate([mapWidth.value / 2, mapHeight.value / 2])
      }
      return mapProjection.value.center(planarCenter.value)
    })
    const featurePath = computed(() => {
      return d3.geoPath().projection(mapProjection.value)
    })
    const hasCursor = computed(() => {
      return !!featureCursor.value
    })
    const hasZoom = computed(() => {
      return !!featureZoom.value
    })


    const geojson = computed(() => {
      const object = get(topojson.value, ['objects', props.topojsonObjects], null)
      return feature(topojson.value, object as GeometryCollection)
    })

    const mapClass = computed(() => {
      return {
        'choropleth-map--has-cursor': hasCursor.value,
        'choropleth-map--has-zoom': hasZoom.value,
        'choropleth-map--hatch-empty': props.hatchEmpty
      }
    })
    const mapProjection = computed(() => {
      if (!props.projection) {
        throw new Error("props.projection is " + props.projection)
      }
      return props.projection().fitSize([mapWidth.value, mapHeight.value], geojson.value) as GeoProjection
    })
    const rotatingMapProjection = computed(() => {
      const {rotateX = null, rotateY = null} = mapTransform.value
      if (rotateX !== null && rotateY !== null) {
        return mapProjection.value.rotate([rotateX, rotateY]) ?? null
      }
      return mapProjection.value
    })

    const mapCenter = computed(() => {
      return mapProjection.value.center()
    })
    const mapZoom = computed(() => {
      return d3
          .zoom()
          .scaleExtent([props.zoomMin, props.zoomMax])
          .translateExtent([
            [0, 0],
            [mapWidth.value, mapHeight.value]
          ])
          .on('zoom', mapZoomed)
    })

    const mapSphericalZoom = computed(() => {
      return d3.zoom(map.value).scaleExtent([props.zoomMin, props.zoomMax]).on('zoom', mapSphericalZoomed)
    })
    const mapRotate = computed(() => {
      return d3.drag(map.value).on('drag', mapRotated)
    })
    const mapHeight = computed(() => {
      return mapRect.value.height
    })

    const mapWidth = computed(() => {
      return mapRect.value.width
    })

    const mapStyle = computed(() => {
      const {k = 0, x = 0, y = 0, rotateX = 0, rotateY = 0} = mapTransform.value
      return {
        '--map-height': props.height,
        '--map-color': props.color,
        '--map-social-color': props.socialColor,
        '--map-scale': k,
        '--map-translate-x': x,
        '--map-translate-y': y,
        '--map-rotate-x': rotateX,
        '--map-rotate-y': rotateY
      }
    })

    const map = computed((): d3.Selection<SVGElement, unknown, null, undefined> | null => {
      const selection = d3.select(resizable.value).select<SVGElement>('svg')
      if (!selection) {
        throw new Error("Empty SVG selection")
      }
      return selection
    })
    const maxValue = computed(() => {
      if (props.max !== null) {
        return props.max
      }
      return max<number>(values(loadedData.value)) || 0
    })
    const minValue = computed((): number => {
      if (props.min !== null) {
        return props.min
      }
      return min(values(loadedData.value)) || 0
    })
    const transformOrigin = computed(() => {
      return props.spherical ? '50% 50%' : '0 0'
    })

    function setMapNodeSize({width, height}) {
      const node = map.value?.node();
      if (node) {
        node["width"] = width
        node["height"] = height
      }
    }

    const cursorValue = computed(() => {
      return featureCursor.value?.data ?? null
    })
    const isReady = computed(() => {
      return loadedData.value && isLoaded.value && topojson.value
    })

    function prepare() {
      if (!map.value) {
        throw new Error("Map is null")
      }
      // Set the map sizes
      mapRect.value = map.value.node()?.getBoundingClientRect() as DOMRect
      // Remove any existing country
      map.value.selectAll('.choropleth-map__main__outline > *').remove()
      map.value.selectAll('.choropleth-map__main__graticule > *').remove()
      map.value.selectAll('.choropleth-map__main__features > *').remove()
      // Return the map to allow chaining
      return map.value
    }

    function prepareZoom() {
      if (props.zoomable) {
        map.value?.call(mapZoom.value)
      }

      // User can zoom on the map
      if (props.zoomable && props.spherical) {
        map.value?.call(mapRotate.value).call(mapSphericalZoom.value)
      } else if (props.zoomable) {
        map.value?.call(mapZoom.value)
      }
      // An initial zoom value is given
      if (props.zoom || props.spherical) {
        applyZoom(props.zoom ?? props.zoomMin, 0)
      }
    }

    function draw() {
      prepare()
      drawOutline()
      drawGraticule()
      drawFeatures()
      prepareZoom()
    }

    function drawOutline() {
      map.value?.select('.choropleth-map__main__outline')
          .append('path')
          .attr('d', initialFeaturePath.value({type: 'Sphere'}))
          .attr('stroke', props.outlineColor)
    }

    function drawGraticule() {
      map.value?.select('.choropleth-map__main__graticule')
          .append('path')
          .attr('d', initialGraticulePath.value)
          .attr('stroke', props.graticuleColor)
    }

    function drawFeatures() {
      const features = map.value?.select('.choropleth-map__main__features')
          .selectAll('.choropleth-map__main__features__item')
          .data(geojson.value.features)
          .enter()
          .append('path')
      if (!features) {
        throw new Error("features is undefined")
      }
      features
          .attr('class', featureClass)
          .attr('d', initialFeaturePath.value)
          .on('mouseover', featureMouseOver)
          .on('mouseleave', featureMouseLeave)
          .on('click', mapClicked)
          .style('color', featureColor.value)
    }

    // function draw() {
    //   // Bind geojson features to path
    //   prepare()
    //       .append('g')
    //       .attr('class', 'choropleth-map__main__features')
    //       .selectAll('.choropleth-map__main__features__item')
    //       .data(geojson.value.features)
    //       // Add the path with the correct class
    //       .enter()
    //       .append('path')
    //       .attr('class', featureClass)
    //       .attr('d', featurePath.value)
    //       .on('mouseover', featureMouseOver)
    //       .on('mouseleave', featureMouseLeave)
    //       .on('click', mapClicked)
    //       .style('color', featureColor.value)
    //   prepareZoom()
    // }

    function update() {
      // Bind geojson features to path
      if (!map.value) {
        return
      }
      map.value.selectAll('.choropleth-map__main__features__item')
          .data(geojson.value.features)
          .attr('class', featureClass)
          .style('color', featureColor.value)
    }

    function featureClass(d: string) {
      return keys(pickBy(featureClassObject(d), (value) => value)).join(' ')
    }

    function featureClassObject(d: string) {
      const pathClass = 'choropleth-map__main__features__item'
      const id = get(d, props.topojsonObjectsPath)
      return {
        [pathClass]: true,
        [`${pathClass}--identifier-${kebabCase(id)}`]: true,
        [`${pathClass}--empty`]: loadedData.value && !(id in loadedData.value),
        [`${pathClass}--zoomed`]: featureZoom.value === id,
        [`${pathClass}--cursored`]: featureCursor.value === id
      }
    }

    function featureMouseLeave() {
      featureCursor.value = null
    }

    function featureMouseOver(_: any, d: number) {
      const id = get(d, props.topojsonObjectsPath)
      const cursorId = loadedData.value && id in loadedData.value ? id : null
      updateFeatureCursor(cursorId)
    }

    function updateFeatureCursor(id: any | null) {
      featureCursor.value = id
    }

    async function loadTopojson() {
      if (!topojsonPromise.value) {
        if (!props.topojsonUrl?.length) {
          throw new Error("Empty topojsonUrl")
        }
        topojsonPromise.value = d3.json(props.topojsonUrl)
        topojson.value = await topojsonPromise.value
      }
      return topojsonPromise.value
    }


    async function mapClicked(event: MouseEvent, d: number) {
      /**
       * A click on a feature
       * @event click
       * @param Clicked feature
       */
      emit('click', d)
      // Don't zoom on the map feature
      if (!props.clickable) {
        return
      }
      if (featureZoom.value === get(d, props.topojsonObjectsPath)) {
        return resetZoom(event, d)
      }
      //TODO CD: it was a promise, should it be one?
      setFeatureZoom(d, d3.pointer(event, map.value?.node()))
      /**
       * A zoom on a feature ended
       * @event zoomed
       * @param Zoomed feature
       */
      emit('zoomed', d)
    }

    function mapSphericalZoomed({transform: {k}}: { transform: MapTransform }) {
      const transform = `scale(${k})`
      mapTransform.value = {...mapTransform.value, k}
      applyTransformToTrackedElements(transform)
    }

    function mapZoomed({transform}: { transform: MapTransform }) {
      mapTransform.value = transform
      applyTransformToTrackedElements(transform)
    }

    function mapRotated(event: Event) {
      const {yaw, pitch} = calculateRotation(event)
      applyRotation(yaw, pitch)
    }

    function calculateRotation(event: Event) {
      const sensitivity = 75
      const k = sensitivity / mapProjection.value.scale()
      const [rotateX, rotateY] = mapProjection.value.rotate()
      const yaw = rotateX + event.dx * k
      const pitch = rotateY - event.dy * k
      return {yaw, pitch}
    }

    function applyTransformToTrackedElements(transform) {
      map.value?.selectAll('.choropleth-map__main__tracked').attr('transform', transform)
    }

    function applyRotation(rotateX: number, rotateY: number) {
      mapTransform.value = {...mapTransform.value, rotateX, rotateY}
      const featuresPaths = initialFeaturePath.value.projection(rotatingMapProjection.value)
      const graticulePaths = featuresPaths(graticuleLines.value)
      map.value?.selectAll('g.choropleth-map__main__features path').attr('d', featuresPaths)
      map.value?.selectAll('g.choropleth-map__main__graticule path').attr('d', graticulePaths)
    }

    function applyZoomIdentity(zoomIdentity, pointer: number[] | null = null, transitionDuration = props.transitionDuration) {
      return map.value?.transition()
          .duration(transitionDuration)
          .call(mapZoom.value.transform, zoomIdentity, pointer)
          .end()
    }

    function reapplyZoom() {
      mapTransform.value = {k: 1, x: 0, y: 0, rotateX: 0, rotateY: 0}
      applyZoomIdentity(d3.zoomIdentity)
      featureZoom.value = null
      emitResetEvent()
    }

    function resetZoom(_event: MouseEvent, _d: number) {
      map.value?.style('--map-scale', 1)
          .transition()
          .duration(props.transitionDuration)
          .call(mapZoom.value?.transform, d3.zoomIdentity)
      featureZoom.value = null
      emitResetEvent()
    }

    function emitResetEvent() {
      /**
       * The zoom on the map was reset to its initial <slot ate></slot>
       * @event reset
       */
      emit('reset')

    }

    function setFeaturesClasses() {
      map.value?.selectAll('.choropleth-map__main__features__item').attr('class', featureClass)
    }

    function setFeatureZoom(d: any, pointer = [0, 0]) {

      featureZoom.value = get(d, props.topojsonObjectsPath)
      const [[x0, y0], [x1, y1]] = featurePath.value.bounds(d)
      const scale = Math.min(8, 0.9 / Math.max((x1 - x0) / mapWidth.value, (y1 - y0) / mapHeight.value))
      const zoomIdentity = d3.zoomIdentity
          .translate(mapWidth.value / 2, mapHeight.value / 2)
          .scale(scale)
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
      return map.value?.style('--map-scale', scale)
          .transition()
          .duration(props.transitionDuration)
          .call(mapZoom.value?.transform, zoomIdentity, pointer)
          .end()
    }

    function calculateFeatureZoomIdentity(d: any) {
      const [[x0, y0], [x1, y1]] = featurePath.value.bounds(d)
      const scale = Math.min(8, 0.9 / Math.max((x1 - x0) / mapWidth.value, (y1 - y0) / mapHeight.value))
      const translateX = -(x0 + x1) / 2
      const translateY = -(y0 + y1) / 2
      return d3.zoomIdentity
          .translate(mapWidth.value / 2, mapHeight.value / 2)
          .scale(scale)
          .translate(translateX, translateY)
    }

    function applyFeatureZoom(d: any, pointer = [0, 0]) {
      const zoomIdentity = calculateFeatureZoomIdentity(d)
      featureZoom.value = get(d, props.topojsonObjectsPath)
      mapTransform.value = {k: zoomIdentity.k, x: zoomIdentity.x, y: zoomIdentity.y, rotateX: 0, rotateY: 0}
      return applyZoomIdentity(zoomIdentity, pointer)
    }

    function applyZoom(zoom: number, transitionDuration = props.transitionDuration) {
      const zoomScale = clamp(zoom, props.zoomMin, props.zoomMax)
      if (props.spherical) {
        return setSphericalZoom(zoomScale, transitionDuration)
      } else {
        return setPlanarZoom(zoomScale, transitionDuration)
      }
    }

    function setSphericalZoom(zoomScale: number, transitionDuration: number) {
      const zoomIdentity = d3.zoomIdentity.scale(zoomScale)
      mapTransform.value = {...mapTransform.value, k: zoomScale}
      return applyZoomIdentity(zoomIdentity, null, transitionDuration)
    }

    function setPlanarZoom(zoomScale: number, transitionDuration: number) {

      const [x, y] = mapProjection.value(mapCenter.value)
      const [translateX, translateY] = [mapWidth.value / 2 - zoomScale * x, mapHeight.value / 2 - zoomScale * y]
      const zoomIdentity = d3.zoomIdentity.translate(translateX, translateY).scale(zoomScale)
      mapTransform.value = {k: zoomScale, x: translateX, y: translateY, rotateX: 0, rotateY: 0}
      return applyZoomIdentity(zoomIdentity, null, transitionDuration)
    }

    watch(() => props.socialMode, () => {
      draw()
    })
    watch(() => props.data, () => {
      update()
    })
    watch(() => featureZoom.value, () => {
      setFeaturesClasses()
    })
    watch(() => featureCursor.value, () => {
      setFeaturesClasses()
    })
    provide<ParentMap>(ParentKey, {
      mapRect, mapTransform, rotatingMapProjection
    })
    return {
      cursorValue,
      debouncedDraw,
      draw,
      featureColorScaleEnd,
      featureColorScaleFunction,
      featureColorScaleStart,
      featureCursor,
      isLoaded,
      isReady,
      loadTopojson,
      mapClass,
      mapRect,
      mapStyle,
      mapTransform,
      maxValue,
      minValue,
      resizable,
      rotatingMapProjection,
      setMapNodeSize,
      topojsonPromise,
      transformOrigin,
      updateFeatureCursor
    }
  }
})
</script>
<template>
  <div ref="resizable" :class="mapClass" :style="mapStyle" class="choropleth-map" @click="draw">
    <svg :viewbox="`0 0 ${mapRect.width} ${mapRect.height}`" class="choropleth-map__main">
      <pattern id="diagonalHatch" height="1" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse" width="1">
        <rect :fill="featureColorScaleEnd" height="1" width="1"/>
        <line :style="{ stroke: featureColorScaleStart, strokeWidth: 1 }" x1="0" x2="0" y1="0" y2="1"/>
      </pattern>
      <g :transform-origin="transformOrigin" class="choropleth-map__main__tracked">
        <g v-if="graticule" class="choropleth-map__main__graticule"></g>
        <g class="choropleth-map__main__features"></g>
        <g v-if="outline" class="choropleth-map__main__outline"></g>
        <slot v-if="isReady"/>
      </g>
    </svg>
    <scale-legend
        v-if="!hideLegend && isReady"
        :color-scale="featureColorScaleFunction"
        :color-scale-end="featureColorScaleEnd"
        :color-scale-start="featureColorScaleStart"
        :cursor-value="cursorValue"
        :max="maxValue"
        :min="minValue"
        class="choropleth-map__legend"
    >
      <template #cursor="{ value }">
        <slot name="legend-cursor" v-bind="{ value, identifier: featureCursor }"/>
      </template>
    </scale-legend>
  </div>
</template>

<style lang="scss" scoped>
@import '../styles/lib';

.choropleth-map {
  --map-scale: 1;
  --map-color: #fff;
  --map-social-color: #000;

  position: relative;

  &__main {
    min-height: var(--map-height, 300px);
    height: 100%;
    width: 100%;
    color: var(--map-color);

    .chart--social-mode & {
      color: var(--map-social-color);
    }

    &:deep(.choropleth-map__main__outline),
    &:deep(.choropleth-map__main__graticule) {
      fill: transparent;
      pointer-events: none;
      stroke-width: calc(1px / var(--map-scale, 1));
    }

    &:deep(.choropleth-map__main__features__item) {
      stroke: currentColor;
      stroke-width: calc(1px / var(--map-scale, 1));
      fill: currentColor;
      transition: opacity 750ms, filter 750ms, fill 750ms;

      .choropleth-map__main__features__item--empty {
        opacity: 0.8;

        .choropleth-map--hatch-empty & {
          opacity: 0.3;
          fill: url('#diagonalHatch');
        }
      }

      .choropleth-map--has-zoom &:not(.choropleth-map__main__features__item--zoomed) {
        filter: grayscale(90%);
      }
    }
  }

  &__legend {
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
</style>
