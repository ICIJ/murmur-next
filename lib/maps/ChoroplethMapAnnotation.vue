<script setup lang="ts">
import { geoDistance, GeoProjection } from 'd3-geo'
import { computed, inject } from 'vue'
import { ParentKey } from '@/keys'
import { ParentMap } from '@/types'
import { PLACEMENTS } from '@/enums'

defineOptions({
  name: 'ChoroplethMapAnnotation'
})

const props = withDefaults(defineProps<{
  /**
   * Latitude of the annotation.
   */
  latitude: number
  /**
   * Longitude of the annotation.
   */
  longitude: number
  /**
   * Maximum height of the annotation container.
   */
  height?: number
  /**
   * Maximum width of the annotation container.
   */
  width?: number
  /**
   * If true, the annotation will scale with the map zoom.
   */
  scale?: boolean
  /**
   * Text color of the annotation.
   */
  color?: string
  /**
   * Override the default drop-shadow filter applied to the annotation.
   */
  dropShadow?: string
  /**
   * Radian distance from the center of the Earth after which the annotation is hidden.
   * The Earth's circumference can be divided into 360 degrees, or 2π radians.
   * Therefore, 1.57 radians is approximately a quarter of π (since π≈3.14), which corresponds to
   * a quarter of the Earth's circumference.
   */
  geoDistanceThreshold?: number
  /**
   * Placement of the annotation. Can be: top, topleft, topright, right,<br />
   * righttop, rightbottom, bottom, bottomleft, bottomright, left, lefttop,
   * and leftbottom. If `null`, the annotation will be centered.
   */
  placement?: PLACEMENTS | null
}>(), {
  height: 150,
  width: 150,
  scale: false,
  color: undefined,
  dropShadow: undefined,
  geoDistanceThreshold: 1.57,
  placement: null
})

const parent = inject<ParentMap>(ParentKey)

const hasParent = computed(() => !!parent)

const mapRect = computed(() => parent?.mapRect?.value ?? { width: 0, height: 0 })
const rotatingMapProjection = computed(() => parent?.rotatingMapProjection?.value)
const mapTransform = computed(() => {
  return parent?.mapTransform?.value ?? { k: 1 }
})

const translateY = computed(() => {
  if (isTop.value) {
    return 0 - props.height
  }
  if (isBottom.value) {
    return 0
  }
  return 0 - props.height / 2
})

const isTop = computed(() => {
  return [
    PLACEMENTS.TOP,
    PLACEMENTS.TOPLEFT,
    PLACEMENTS.TOPRIGHT,
    PLACEMENTS.LEFTTOP,
    PLACEMENTS.RIGHTTOP
  ].includes(props.placement as PLACEMENTS)
})

const classList = computed(() => {
  return {
    'choropleth-map-annotation--center': isCenter.value,
    'choropleth-map-annotation--right': isRight.value,
    'choropleth-map-annotation--left': isLeft.value,
    'choropleth-map-annotation--top': isTop.value,
    'choropleth-map-annotation--bottom': isBottom.value
  }
})

const center = computed((): [number, number] => {
  return [props.longitude, props.latitude]
})

const projection = computed(() => {
  return rotatingMapProjection.value as GeoProjection | undefined
})

const position = computed(() => {
  // Access rotation values to ensure recomputation when globe rotates
  // (D3 projections are mutated in place, so Vue doesn't detect changes)
  const { rotateX: _rx, rotateY: _ry } = mapTransform.value
  const [x, y] = projection.value?.(center.value) || []
  return { x, y }
})

const mapK = computed((): number => {
  return mapTransform.value.k
})

const translateX = computed(() => {
  if (isRight.value) {
    return 0
  }
  if (isLeft.value) {
    return 0 - props.width
  }
  return 0 - props.width / 2
})

const transform = computed(() => {
  return `translate(${translateX.value}, ${translateY.value})`
})

const x = computed(() => {
  return position.value.x
})

const y = computed(() => {
  return position.value.y
})

const isRight = computed(() => {
  return [
    PLACEMENTS.RIGHT,
    PLACEMENTS.RIGHTBOTTOM,
    PLACEMENTS.RIGHTTOP,
    PLACEMENTS.BOTTOMRIGHT,
    PLACEMENTS.TOPRIGHT
  ].includes(props.placement as PLACEMENTS)
})

const isLeft = computed(() => {
  return [
    PLACEMENTS.LEFT,
    PLACEMENTS.LEFTBOTTOM,
    PLACEMENTS.LEFTTOP,
    PLACEMENTS.BOTTOMLEFT,
    PLACEMENTS.TOPLEFT
  ].includes(props.placement as PLACEMENTS)
})

const isBottom = computed(() => {
  return [
    PLACEMENTS.BOTTOM,
    PLACEMENTS.BOTTOMLEFT,
    PLACEMENTS.BOTTOMRIGHT,
    PLACEMENTS.LEFTBOTTOM,
    PLACEMENTS.RIGHTBOTTOM
  ].includes(props.placement as PLACEMENTS)
})

const isCenter = computed(() => {
  return !isLeft.value && !isRight.value && !isTop.value && !isBottom.value
})

const wrapperStyle = computed(() => {
  return {
    '--color': props.color,
    '--drop-shadow': props.dropShadow,
    '--scale': props.scale ? null : 1 / mapK.value,
    '--transform-origin': wrapperTransformOrigin.value
  }
})

const wrapperTransformOrigin = computed(() => {
  return `${wrapperTransformOriginX.value} ${wrapperTransformOriginY.value}`
})

const wrapperTransformOriginX = computed(() => {
  if (isRight.value) {
    return 'left'
  }
  else if (isLeft.value) {
    return 'right'
  }
  return 'center'
})

const wrapperTransformOriginY = computed(() => {
  if (isTop.value) {
    return 'bottom'
  }
  else if (isBottom.value) {
    return 'top'
  }
  return 'center'
})

const geoDistanceFromCenter = computed(() => {
  try {
    if (!projection.value?.invert) {
      return 0
    }
    const rect = mapRect.value
    const mapCenter: [number, number] = projection.value.invert([
      rect.width / 2,
      rect.height / 2
    ])!
    return geoDistance(center.value, mapCenter)
  }
  catch (_) {
    return 0
  }
})

const isVisible = computed(() => {
  return geoDistanceFromCenter.value <= props.geoDistanceThreshold
})
</script>

<template>
  <g
    v-if="hasParent"
    :class="classList"
    class="choropleth-map-annotation"
  >
    <foreignObject
      :height="height"
      :transform="transform"
      :width="width"
      :x="x"
      :y="y"
    >
      <div
        v-show="isVisible"
        :style="wrapperStyle"
        class="choropleth-map-annotation__wrapper"
      >
        <div class="choropleth-map-annotation__wrapper__content">
          <slot />
        </div>
      </div>
    </foreignObject>
  </g>
</template>

<style lang="scss" scoped>

.choropleth-map-annotation {
  --color: #{$body-color};
  --drop-shadow: 0 0 1px #fff;
  --scale: 1;
  --transform-origin: 'center center';

  pointer-events: none;
  font-size: 1rem;
  line-height: 1;

  &__wrapper {
    color: var(--color);
    height: 100%;
    width: 100%;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    transform: scale(var(--scale));
    transform-origin: var(--transform-origin);
    filter: drop-shadow(var(--drop-shadow));

    .choropleth-map-annotation--right & {
      justify-content: start;
      text-align: left;
    }

    .choropleth-map-annotation--left & {
      justify-content: end;
      text-align: right;
    }

    .choropleth-map-annotation--top & {
      align-items: end;
    }

    .choropleth-map-annotation--bottom & {
      align-items: start;
    }
  }
}
</style>
