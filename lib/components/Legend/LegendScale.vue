<script setup lang="ts">
import * as d3 from 'd3'
import {
  ref,
  computed,
  onMounted,
  watch,
  nextTick,
  toRef
} from 'vue'

import { useLegendScale } from '@/composables/useLegendScale'
import type { ColorScaleFn } from '@/composables/useLegendScale'

defineOptions({
  name: 'ScaleLegend'
})

export interface LegendScaleProps {
  width?: number
  height?: number
  cursorValue?: number | null
  max?: number
  min?: number
  colorScale?: ColorScaleFn | string
  colorScaleEnd?: string
  colorScaleStart?: string
}

const props = withDefaults(defineProps<LegendScaleProps>(), {
  width: 150,
  height: 16,
  cursorValue: null,
  max: 100,
  min: 0,
  colorScale: 'scaleLinear',
  colorScaleEnd: () => {
    const computedStyle = window.getComputedStyle(document.body)
    return computedStyle.getPropertyValue('--bs-primary') || '#000'
  },
  colorScaleStart: '#fff'
})

const {
  colorScaleFunction,
  widthScale,
  widthScaleColor,
  colorScaleWidthRange,
  hasCursor,
  cursorLeft
} = useLegendScale({
  width: toRef(() => props.width),
  min: toRef(() => props.min),
  max: toRef(() => props.max),
  cursorValue: toRef(() => props.cursorValue),
  colorScale: toRef(() => props.colorScale),
  colorScaleStart: toRef(() => props.colorScaleStart),
  colorScaleEnd: toRef(() => props.colorScaleEnd)
})

const cursorWrapperOffset = ref(0)
const mounted = ref(false)
const el = ref<Element | null>(null)

const classList = computed((): { 'scale-legend--has-cursor': boolean } => {
  return {
    'scale-legend--has-cursor': hasCursor.value
  }
})

const cursorValue = toRef(() => props.cursorValue)

onMounted(async () => {
  await nextTick()
  setCursorWrapperOffset()
  setColorScaleCanvas()
  mounted.value = true
})

const colorScaleBaseCanvas = computed((): HTMLCanvasElement | null => {
  return d3
    .create('canvas')
    .attr('width', props.width)
    .attr('height', props.height)
    .node()
})

const colorScaleContext = computed((): CanvasRenderingContext2D | null => {
  return colorScaleBaseCanvas.value?.getContext('2d') ?? null
})

const colorScaleBase64 = computed((): string | undefined => {
  if (mounted.value) {
    return colorScaleBaseCanvas.value?.toDataURL() ?? undefined
  }
  return undefined
})

const formatNumber = d3.format(',')

function setCursorWrapperOffset(): void {
  const cursor = el.value?.querySelector('.scale-legend__cursor')
  if (cursor && el.value) {
    const { x: cursorX, width: cursorWidth }
      = cursor.getBoundingClientRect()
    const { x: legendX, width: legendWidth }
      = el.value.getBoundingClientRect()
    const left = legendX - cursorX - 6
    const right = legendX + legendWidth - (cursorX + cursorWidth) + 6
    cursorWrapperOffset.value = Math.max(0, left) || Math.min(0, right)
  }
  else {
    cursorWrapperOffset.value = 0
  }
}

function setColorScaleCanvas(): void {
  if (!colorScaleContext.value) {
    return
  }
  for (const x of colorScaleWidthRange.value) {
    colorScaleContext.value.fillStyle = widthScaleColor.value(x)
    colorScaleContext.value.fillRect(x, 0, 1, props.height)
  }
}

watch(cursorValue, async () => {
  await nextTick()
  setCursorWrapperOffset()
})

defineExpose({
  widthScale,
  colorScaleFunction,
  widthScaleColor
})
</script>

<template>
  <div
    ref="el"
    :class="classList"
    class="scale-legend"
  >
    <div class="scale-legend__bound scale-legend__bound--min">
      <slot
        name="legend-cursor-min"
        v-bind="{ min }"
      >
        {{ formatNumber(min) }}
      </slot>
    </div>
    <img
      :height="height"
      :src="colorScaleBase64"
      :width="width"
      class="scale-legend__scale"
      alt="legend scale"
    >
    <div class="scale-legend__bound scale-legend__bound--max">
      <slot
        name="legend-cursor-max"
        v-bind="{ max }"
      >
        {{ formatNumber(max) }}
      </slot>
    </div>
    <div
      v-if="hasCursor"
      :style="{ left: cursorLeft }"
      class="scale-legend__cursor"
    >
      <div
        :style="{ transform: `translateX(${cursorWrapperOffset}px)` }"
        class="scale-legend__cursor__wrapper"
      >
        <slot
          name="cursor"
          v-bind="{ value: cursorValue }"
        >
          {{ formatNumber(cursorValue) }}
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.scale-legend {
  position: relative;
  display: inline-block;

  &__bound,
  &__cursor {
    position: absolute;
    bottom: 100%;
    font-size: 0.8rem;

    &--min {
      left: 0;
    }

    &--max {
      right: 0;
    }
  }

  .choropleth-map--has-cursor &__bound {
    color: $text-muted;
    opacity: 0.6;
  }

  &__cursor {
    font-weight: bold;
    transform: translateX(-50%);
    left: 50%;

    &:after {
      content: '';
      border: 5px solid transparent;
      border-top-color: var(--dark, currentColor);
      position: absolute;
      left: 50%;
      top: 100%;
      transform: translateX(-50%);
    }
  }
}
</style>
