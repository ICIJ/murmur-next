<script lang="ts">
import * as d3 from 'd3'
import type { GeoPermissibleObjects } from 'd3'
import { geoRobinson } from 'd3-geo-projection'
import { feature } from 'topojson'
import {
  debounce,
  find,
  get,
  groupBy,
  isFunction,
  kebabCase,
  keys,
  pickBy,
  set,
  uniq,
  uniqueId
} from 'lodash'

import config from '../config'
import OrdinalLegend from '../components/OrdinalLegend.vue'
import {
  chartEmits,
  chartProps,
  getChartProps,
  useChart
} from '@/composables/useChart'
import {
  ComponentPublicInstance,
  computed,
  defineComponent,
  PropType,
  ref,
  watch
} from 'vue'
import type { GeometryCollection } from 'topojson-specification'
import { PopoverPlacement } from 'bootstrap-vue-next'

export default defineComponent({
  name: 'SymbolMap',
  components: {
    OrdinalLegend
  },
  props: {
    categoryObjectsPath: {
      type: [String, Array],
      default: 'category'
    },
    clickable: {
      type: Boolean
    },
    hideLegend: {
      type: Boolean
    },
    hideTooltip: {
      type: Boolean
    },
    horizontalLegend: {
      type: Boolean
    },
    featureColor: {
      type: [String, Function],
      default: 'currentColor'
    },
    fitToMarkers: {
      type: Boolean
    },
    labelObjectsPath: {
      type: [String, Array],
      default: 'label'
    },
    mapPadding: {
      type: Number,
      default: 15
    },
    markerObjectsPath: {
      type: [String, Array] as PropType<string | string[]>,
      default: 'id'
    },
    markerPath: {
      type: [String, Function],
      default:
        'M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256z'
    },
    markerColor: {
      type: String,
      default: null
    },
    markerWidth: {
      type: [Number, Function],
      default: 10
    },
    noMarkersScale: {
      type: Boolean
    },
    tooltipCustomClass: {
      type: String,
      default: null
    },
    tooltipPlacement: {
      type: String as PropType<PopoverPlacement>,
      default: 'top'
    },
    tooltipFallbackPlacement: {
      type: [Array, String],
      default: 'flip'
    },
    topojsonObjects: {
      type: String,
      default: 'countries1'
    },
    topojsonObjectsPath: {
      type: [String, Array] as PropType<string | string[]>,
      default: 'id'
    },
    topojsonUrl: {
      type: String,
      default: () => config.get('map.topojson.world-countries-sans-antarctica')
    },
    transitionDuration: {
      type: Number,
      default: 750
    },
    zoomable: {
      type: Boolean
    },
    zoomMin: {
      type: Number,
      default: 1
    },
    zoomMax: {
      type: Number,
      default: 8
    },
    ...chartProps()
  },
  emits: ['click', 'reset', 'zoomed', ...chartEmits],
  setup(props, { emit }) {
    const el = ref<ComponentPublicInstance<HTMLElement> | null>(null)
    const topojson = ref<any>(null)
    const topojsonPromise = ref<Promise<void> | null>(null)
    const mapRect = ref<DOMRect>(new DOMRect(0, 0, 0, 0))
    const markerCursor = ref<Record<string, string> | null>(null)
    const categoryHighlight = ref<any | null>(null)
    const featureZoom = ref<string | null>(null)

    const isLoaded = ref<boolean>(false)
    const debouncedDraw = debounce(function () {
      draw()
    }, 10)

    const { loadedData } = useChart(
      el,
      getChartProps(props),
      { emit },
      isLoaded,
      debouncedDraw,
      afterLoaded
    )

    function afterLoaded() {
      return new Promise<void>((resolve) => {
        return loadTopojson().then(() => {
          draw()
          resolve()
          return
        })
      })
    }

    // computed
    const featurePath = computed(() => {
      return d3.geoPath().projection(mapProjection.value)
    })
    const hasCursor = computed(() => {
      return !!markerCursor.value
    })
    const hasHighlight = computed(() => {
      return !!categoryHighlight.value
    })
    const hasZoom = computed(() => {
      return !!featureZoom.value
    })
    const geojson = computed(() => {
      return props.fitToMarkers ? markersGeojson.value : featuresGeojson.value
    })
    const featuresGeojson = computed(() => {
      const object = get(
        topojson.value,
        ['objects', props.topojsonObjects],
        null
      )
      return feature(topojson.value, object as GeometryCollection)
    })
    const markersGeojson = computed(() => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates.value]
        }
      }
    })
    const coordinates = computed(() => {
      return (loadedData.value || []).map(({ longitude, latitude }) => {
        return [longitude, latitude]
      })
    })
    const mapId = computed(() => {
      return uniqueId('symbol-map-')
    })
    const mapClass = computed(() => {
      return {
        'symbol-map--has-cursor': hasCursor.value,
        'symbol-map--has-highlight': hasHighlight.value,
        'symbol-map--has-zoom': hasZoom.value,
        'symbol-map--has-markers-scale': !props.noMarkersScale
      }
    })
    const mapProjection = computed(() => {
      const { height, width } = mapRect.value
      const padding = props.mapPadding
      return geoRobinson().fitExtent(
        [
          [padding, padding],
          [width - padding, height - padding]
        ],
        geojson.value
      )
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
    const mapHeight = computed(() => {
      return mapRect.value.height
    })
    const mapWidth = computed(() => {
      return mapRect.value.width
    })
    const map = computed(() => {
      const selection = d3
        .select(el.value)
        .select<SVGElement>('.symbol-map__main')
      if (!selection) {
        throw new Error('Empty SVG selection')
      }
      return selection
    })
    const markerCursorValue = computed(() => {
      return find(loadedDataWithIds.value, (d) => {
        return get(d, props.markerObjectsPath) === markerCursor.value
      })
    })
    const loadedDataWithIds = computed(() => {
      return loadedData.value?.map((d) => {
        return {
          ...set({}, props.markerObjectsPath, uniqueId()),
          ...d
        }
      })
    })
    const categories = computed(() => {
      const categories = (loadedData.value || []).map((d) => {
        return get(d, props.categoryObjectsPath)
      })
      return uniq(categories).map(String)
    })
    const legendData = computed(() => {
      const categories = groupBy(loadedData.value || [], (d) => {
        return get(d, props.categoryObjectsPath)
      })
      return Object.entries(categories).map((entry) => {
        const [label, [{ color: firstColor }]] = entry
        const color = firstColor || categoryColor(label)
        return { label, color }
      })
    })
    const hasTooltip = computed(() => {
      return !props.hideTooltip && loadedData.value && markerCursor.value
    })
    const tooltipTarget = computed(() => {
      if (hasTooltip.value) {
        return markerId(markerCursor.value)
      }
      return null
    })

    // methods

    function prepare() {
      if (!map.value) {
        throw new Error('Map is null')
      }
      // Set the map sizes
      mapRect.value = map.value.node()?.getBoundingClientRect() as DOMRect
      // Remove any existing country
      map.value.selectAll('g').remove()
      // Return the map to allow chaining
      return map.value
    }

    function prepareZoom() {
      if (props.zoomable) {
        map.value?.call(mapZoom.value)
      }
    }

    function categoryColor(category: string) {
      if (el.value && loadedData.value) {
        const index = categories.value.indexOf(category)
        const style = window.getComputedStyle(el.value)
        return style.getPropertyValue(`--category-color-${index}n`) || '#000'
      }
      return null
    }

    function draw() {
      prepare()
      if (!map.value) {
        throw new Error('map is not defined')
      }
      update()
      // Bind a group for marker paths
      map.value
        ?.append('g')
        .attr('class', 'symbol-map__main__markers')
        .selectAll('.symbol-map__main__markers__item')
        .data(loadedDataWithIds.value)
        .enter()
        .append('g')
        .attr('id', markerId)
        .attr('class', markerClass)
        .attr('transform', markerTransform)
        .append('path')
        .on('mouseover', markerMouseOver)
        .on('mouseleave', markerMouseLeave)
        .attr('d', markerPathFunction)
        .attr('fill', markerColorFunction)
      prepareZoom()
    }

    function featureClass(d) {
      return keys(pickBy(featureClassObject(d), value => value)).join(' ')
    }

    function featureClassObject(d) {
      const pathClass = 'symbol-map__main__features__item'
      const id = get(d, props.topojsonObjectsPath, null)
      return {
        [pathClass]: true,
        [`${pathClass}--identifier-${kebabCase(id)}`]: id !== null,
        [`${pathClass}--zoomed`]: featureZoom.value === id
      }
    }

    async function loadTopojson() {
      if (!topojsonPromise.value) {
        if (!props.topojsonUrl?.length) {
          throw new Error('Empty topojsonUrl')
        }
        topojsonPromise.value = d3.json(props.topojsonUrl)
        topojson.value = await topojsonPromise.value
      }
      return topojsonPromise.value
    }

    function mapZoomed({ transform }) {
      markerCursor.value = null
      map.value
        ?.style('--map-scale', transform.k)
        .selectAll('.symbol-map__main__features, .symbol-map__main__markers')
        .attr('transform', transform)
    }

    function markerBoundingClientRect(d) {
      const marker = map.value?.append('path').attr('d', markerPathFunction(d))
      const rect = marker?.node()?.getBoundingClientRect()
      marker?.remove()
      return rect as DOMRect
    }

    function markerMouseLeave() {
      markerCursor.value = null
    }

    function markerMouseOver(_, d) {
      markerCursor.value = get(d, props.markerObjectsPath)
    }

    function markerClass(d) {
      return keys(pickBy(markerClassObject(d), value => value)).join(' ')
    }

    function markerId(d) {
      const id = get(d, props.markerObjectsPath)
      return `${mapId.value}-marker-${id}`
    }

    function markerClassObject(d) {
      const category = String(get(d, props.categoryObjectsPath))
      const categoryIndex = categories.value.indexOf(category)
      const id = get(d, props.markerObjectsPath)
      const pathClass = 'symbol-map__main__markers__item'
      return {
        [pathClass]: true,
        [`${pathClass}--category-${kebabCase(category)}`]: category !== null,
        [`${pathClass}--category-${categoryIndex}n`]: category !== null,
        [`${pathClass}--cursored`]: markerCursor.value === id,
        [`${pathClass}--identifier-${kebabCase(id)}`]: id !== null,
        [`${pathClass}--highlighted`]: categoryHighlight.value === category
      }
    }

    function markerPathFunction(d) {
      return isFunction(props.markerPath)
        ? props.markerPath(d)
        : props.markerPath
    }

    function markerColorFunction({ color, ...d }) {
      return (
        color
        || (isFunction(props.markerColor)
          ? props.markerColor(d)
          : props.markerColor)
      )
    }

    function markerWidthFunction(d) {
      return isFunction(props.markerWidth)
        ? props.markerWidth(d)
        : props.markerWidth
    }

    function markerLabel(d) {
      return get(d, props.labelObjectsPath)
    }

    function markerTransform(d) {
      const { latitude, longitude } = d
      const { height, width } = markerBoundingClientRect(d)
      const [x, y] = mapProjection.value([longitude, latitude])
      const scale = markerWidthFunction(d) / Math.max(1, width)
      const cx = x - (width / 2) * scale
      const cy = y - (height / 2) * scale
      return `translate(${cx}, ${cy}) scale(${scale})`
    }

    async function featureClicked(
      event: MouseEvent,
      d: d3.GeoPermissibleObjects
    ) {
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
      setFeatureZoom(d, d3.pointer(event, map.value?.node()))
      /**
       * A zoom on a feature ended
       * @event zoomed
       * @param Zoomed feature
       */
      emit('zoomed', d)
    }

    function resetZoom(_event: MouseEvent, _d: number) {
      map.value
        ?.style('--map-scale', 1)
        .transition()
        .duration(props.transitionDuration)
        .call(mapZoom.value.transform, d3.zoomIdentity)
      featureZoom.value = null

      /**
       * The zoom on the map was reset to its initial <slot ate></slot>
       * @event reset
       */
      emit('reset')
    }

    function setMarkersClasses() {
      map.value
        ?.selectAll('.symbol-map__main__markers__item')
        .attr('class', markerClass)
    }

    function setFeatureZoom(d: GeoPermissibleObjects, pointer = [0, 0]) {
      if (!loadedData.value) {
        return
      }
      featureZoom.value = get(d, props.topojsonObjectsPath)

      const { height, width } = mapRect.value
      const [[x0, y0], [x1, y1]] = featurePath.value.bounds(d)
      const scale = Math.min(
        8,
        0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)
      )
      const x = -(x0 + x1) / 2
      const y = -(y0 + y1) / 2
      const zoomIdentity = d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(scale)
        .translate(x, y)
      return map.value
        ?.style('--map-scale', scale)
        .transition()
        .duration(props.transitionDuration)
        .call(mapZoom.value?.transform, zoomIdentity, pointer)
        .end()
    }

    function update() {
      // Bind geojson features to path
      if (!map.value) {
        return
      }
      // Bind a group for geojson features to path
      map.value
        ?.append('g')
        .attr('class', 'symbol-map__main__features')
        .selectAll('.symbol-map__main__features__item')
        .data(featuresGeojson.value.features)
        // Add the path with the correct class
        .enter()
        .append('path')
        .attr('class', featureClass)
        .attr('d', featurePath.value)
        .on('click', featureClicked)
        .style('color', props.featureColor)
    }

    // watch
    watch(
      () => props.data,
      () => {
        // draw()
        update()
      }
    )
    watch(
      () => props.socialMode,
      () => {
        draw()
      }
    )
    watch(
      () => markerCursor.value,
      () => {
        setMarkersClasses()
      }
    )

    watch(
      () => categoryHighlight.value,
      () => {
        setMarkersClasses()
      }
    )

    return {
      el,
      categoryHighlight,
      legendData,
      mapClass,
      markerCursor,
      markerCursorValue,
      markerLabel,
      tooltipTarget,
      loadTopojson
    }
  }
})
</script>

<template>
  <div
    ref="el"
    :class="mapClass"
    class="symbol-map"
  >
    <slot
      name="legend"
      v-bind="{ legendData }"
    >
      <ordinal-legend
        v-if="!hideLegend && legendData"
        v-model:highlight="categoryHighlight"
        :data="legendData"
        :horizontal="horizontalLegend"
        :marker-path="markerPath"
        category-objects-path="label"
      >
        <template #marker="d">
          <slot
            name="legend-marker"
            v-bind="d"
          />
        </template>
        <template #label="d">
          <slot
            name="legend-label"
            v-bind="d"
          />
        </template>
      </ordinal-legend>
    </slot>
    <svg class="symbol-map__main" />
    <b-tooltip
      v-if="tooltipTarget"
      ref="marker-tooltip"
      :custom-class="tooltipCustomClass"
      :fallback-placement="tooltipFallbackPlacement"
      :placement="tooltipPlacement"
      :target="tooltipTarget"
    >
      <slot
        name="tooltip"
        v-bind="{ markerCursor, ...markerCursorValue }"
      >
        {{ markerLabel(markerCursorValue) }}
      </slot>
    </b-tooltip>
  </div>
</template>

<style lang="scss" scoped>

.symbol-map {
  $muted-item-opacity: 0.2;
  $muted-item-filter: grayscale(30%) brightness(10%);
  $muted-item-transition:
    opacity 0.2s,
    filter 0.2s;

  $colors: $primary, $info, $warning, $danger;
  $quantile: 2;

  @each $start-color in $colors {
    $i: index($colors, $start-color) - 1;
    $end-color: mix($start-color, text-contrast($start-color), 20%);

    @for $j from ($quantile * $i) through ($quantile * $i + $quantile - 1) {
      $amount: ($j % $quantile) * math.div(100%, $quantile);
      --category-color-#{$j}n: #{mix($end-color, $start-color, $amount)};
    }
  }

  &__main {
    color: #ebebeb;
    min-height: 300px;
    height: 100%;
    width: 100%;

    .chart--social-mode & {
      color: $dark;
    }

    &:deep(.symbol-map__main__features__item) {
      stroke: currentColor;
      stroke-width: calc(1px / var(--map-scale, 1));
      fill: currentColor;
      transition:
        opacity 750ms,
        filter 750ms;
    }

    &:deep(.symbol-map__main__markers) {
      shape-rendering: geometricPrecision;

      .symbol-map__main__markers__item {
        opacity: 1;
        filter: grayscale(0%) brightness(100%);
        transition: $muted-item-transition;

        .symbol-map--has-highlight & {
          opacity: $muted-item-opacity;
          filter: $muted-item-filter;
        }

        .symbol-map--has-highlight &--highlighted {
          opacity: 1;
          filter: grayscale(0%) brightness(100%);
        }

        @for $i from 0 through ($quantile * length($colors)) {
          &--category-#{$i}n path:not([fill]) {
            fill: var(--category-color-#{$i}n);
          }
        }

        .symbol-map--has-markers-scale & path {
          transform: scale(calc(1 / var(--map-scale)));
          transform-origin: center center;
        }
      }
    }
  }
}
</style>
