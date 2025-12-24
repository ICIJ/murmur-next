<script setup lang="ts">
import * as d3 from 'd3'
import identity from 'lodash/identity'
import sortByFn from 'lodash/sortBy'
import { computed, ref, watch, ComponentPublicInstance } from 'vue'
import { getChartProps, useChart } from '@/composables/useChart'

defineOptions({
  name: 'BarChart'
})

interface Datum { value: number | number[], highlight?: boolean, label?: string }
type Bar = { width: number, height: number, x: number, y: number } & Datum

const props = withDefaults(defineProps<{
  barHeight?: number
  barGap?: number
  barColor?: string | null
  barHighlightColor?: string | null
  fixedLabelWidth?: number | null
  fixedValueWidth?: number | null
  labelGap?: number
  valueGap?: number
  sortBy?: string | string[] | null
  xAxisTickFormat?: ((v: any) => string) | string
  data?: string | object[] | null
  dataUrlType?: 'json' | 'csv' | 'tsv'
  chartHeightRatio?: number
  socialMode?: boolean
  socialModeRatio?: number
}>(), {
  barHeight: 30,
  barGap: 15,
  barColor: null,
  barHighlightColor: null,
  fixedLabelWidth: null,
  fixedValueWidth: null,
  labelGap: 10,
  valueGap: 5,
  sortBy: null,
  xAxisTickFormat: () => identity,
  data: null,
  dataUrlType: 'json',
  chartHeightRatio: undefined,
  socialMode: false,
  socialModeRatio: 5 / 4
})

const emit = defineEmits<{
  loaded: [data: any]
  resized: []
}>()

const el = ref<ComponentPublicInstance<HTMLElement> | null>(null)
const width = ref(0)
const isLoaded = ref(false)
const { loadedData, elementsMaxBBox, dataHasHighlights, d3Formatter }
  = useChart(el, getChartProps(props), { emit }, isLoaded, onResize)

const sortedData = computed((): [] => {
  if (!loadedData.value) {
    return []
  }
  return !props.sortBy
    ? loadedData.value
    : sortByFn(sortedData.value, props.sortBy)
})

const labelWidth = computed(() => {
  if (props.fixedLabelWidth) {
    return props.fixedLabelWidth
  }
  const selector = '.bar-chart__labels__item'
  const defaultWidth = 100
  return elementsMaxBBox({ selector, defaultWidth }).width
})

const valueWidth = computed(() => {
  if (props.fixedValueWidth) {
    return props.fixedValueWidth
  }
  const selector = '.bar-chart__bars__item__value'
  const defaultWidth = 0
  return elementsMaxBBox({ selector, defaultWidth }).width + props.valueGap
})

const margin = computed(() => {
  const left = labelWidth.value + props.labelGap
  const right = 0
  const top = 0
  const bottom = 0
  return { left, right, top, bottom }
})

const padded = computed(() => {
  const widthP = width.value - margin.value.left - margin.value.right
  const heightP = height.value - margin.value.top - margin.value.bottom
  return { width: widthP, height: heightP }
})

const scale = computed(() => {
  const x = d3
    .scaleLinear()
    // @ts-expect-error D3 api
    .domain([0, d3.max(sortedData.value, (d: Datum) => d.value)])
    .range([0, padded.value.width - valueWidth.value])
  return { x }
})

const bars = computed((): Bar[] => {
  return sortedData.value.map((d: Datum, i: number) => {
    return {
      width: Math.abs(scale.value.x(d.value)),
      height: Math.abs(props.barHeight),
      value: d.value,
      highlight: d.highlight,
      x: 0,
      y: (props.barHeight + props.barGap) * i
    }
  })
})

const labels = computed(() => {
  return sortedData.value.map((d: Datum, i: number) => {
    return {
      label: d.label,
      x: labelWidth.value,
      y: 4 + props.barHeight / 2 + (props.barHeight + props.barGap) * i
    }
  })
})

const height = computed(() => {
  return (props.barHeight + props.barGap) * sortedData.value.length
})

function formatXDatum(d: number | number[]) {
  return d3Formatter(d, props.xAxisTickFormat)
}

function onResize() {
  if (el.value) {
    width.value = el.value?.offsetWidth
  }
}

function initialize() {
  // @ts-expect-error D3 api
  d3.axisBottom().scale(scale.value.x)
}

watch(width, () => {
  initialize()
})
</script>

<template>
  <div
    ref="el"
    class="bar-chart"
    :style="{
      '--bar-color': barColor,
      '--bar-highlight-color': barHighlightColor
    }"
    :class="{
      'bar-chart--has-highlights': dataHasHighlights,
      'bar-chart--social-mode': socialMode
    }"
  >
    <svg
      :width="width"
      :height="height"
    >
      <g
        :style="{ transform: `translate(0, ${margin.top}px)` }"
        class="bar-chart__labels"
      >
        <text
          v-for="(label, i) in labels"
          :key="i"
          :x="label.x"
          :y="label.y"
          text-anchor="end"
          class="bar-chart__labels__item"
        >
          {{ label.label }}
        </text>
      </g>
      <g
        :style="{ transform: `translate(${margin.left}px, ${margin.top}px)` }"
        class="bar-chart__bars"
      >
        <g
          v-for="(bar, i) in bars"
          :key="i"
          class="bar-chart__bars__item"
          :class="{ 'bar-chart__bars__item--highlight': bar.highlight }"
        >
          <rect
            :width="bar.width"
            :height="bar.height"
            :x="bar.x"
            :y="bar.y"
          />
          <text
            class="bar-chart__bars__item__value"
            :x="bar.width + valueGap"
            :y="bar.y + bar.height / 2"
            text-anchor="start"
            dominant-baseline="middle"
          >
            {{ formatXDatum(bar.value) }}
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>

<style lang="scss">

.bar-chart {
  text {
    font-family: $font-family-base;
    font-size: $font-size-base;
    fill: currentColor;
  }

  &--has-highlights &__bars__item:not(&__bars__item--highlight):not(:hover) {
    opacity: 0.7;
    filter: grayscale(30%);
  }

  &__bars {
    &__item {
      rect {
        fill: var(--bar-color, var(--dark, $dark));
      }

      &--highlight rect {
        fill: var(--bar-highlight-color, var(--primary, $primary));
      }
    }
  }
}
</style>
