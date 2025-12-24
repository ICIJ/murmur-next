<script setup lang="ts">
import * as d3 from 'd3'
import isFunction from 'lodash/isFunction'
import identity from 'lodash/identity'
import { getChartProps, useChart } from '@/composables/useChart'
import {
  computed,
  ref,
  watchEffect,
  ComponentPublicInstance,
  toRaw
} from 'vue'

defineOptions({
  name: 'LineChart'
})

// Call the first argument if it's a function, or return it
const castCall = (fnOrValue = identity, ...rest: any[]) =>
  isFunction(fnOrValue) ? fnOrValue(...rest) : fnOrValue

const props = withDefaults(defineProps<{
  lineColor?: string | null
  fixedLabelWidth?: number | null
  fixedHeight?: number | null
  seriesName?: string
  xAxisTicks?: object | number | ((d: any) => any) | null
  yAxisTickFormat?: ((v: any) => string) | string
  yAxisTicks?: object | number
  timeseriesKey?: string
  data?: string | object[] | null
  dataUrlType?: 'json' | 'csv' | 'tsv'
  chartHeightRatio?: number
  socialMode?: boolean
  socialModeRatio?: number
}>(), {
  lineColor: null,
  fixedLabelWidth: null,
  fixedHeight: null,
  seriesName: 'value',
  xAxisTicks: null,
  yAxisTickFormat: () => identity,
  yAxisTicks: 5,
  timeseriesKey: 'date',
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

const width = ref(0)
const height = ref(0)
const el = ref<ComponentPublicInstance<HTMLElement> | null>(null)
const line = ref<d3.Line<[number, number]> | null>(null)
const isLoaded = ref(false)

const {
  loadedData,
  elementsMaxBBox,
  d3Formatter,
  xAxisYearFormat,
  baseHeightRatio
} = useChart(el, getChartProps(props), { emit }, isLoaded, setSizes)

const labelWidth = computed(() => {
  if (props.fixedLabelWidth) {
    return props.fixedLabelWidth
  }
  const selector = '.line-chart__axis--y .tick text'
  const defaultWidth = 100
  return elementsMaxBBox({ selector, defaultWidth }).width
})

const labelHeight = computed(() => {
  const selector = '.line-chart__axis--y .tick'
  const defaultHeight = 10
  return elementsMaxBBox({ selector, defaultHeight }).height
})

const bucketHeight = computed(() => {
  const selector = '.line-chart__axis--x .tick'
  const defaultHeight = 10
  return elementsMaxBBox({ selector, defaultHeight }).height
})

const bucketWidth = computed(() => {
  const selector = '.line-chart__axis--x .tick text'
  const defaultWidth = 0
  return elementsMaxBBox({ selector, defaultWidth }).width
})

const scale = computed(() => {
  return {
    x: d3.scaleTime().range([0, padded.value.width]),
    y: d3.scaleLinear().range([padded.value.height, 0])
  }
})

const margin = computed(() => {
  const left = labelWidth.value + 10
  const right = bucketWidth.value / 2
  const top = labelHeight.value
  const bottom = bucketHeight.value + 10
  return { left, right, top, bottom }
})

const padded = computed(() => {
  const widthP = width.value - margin.value.left - margin.value.right
  const heightP = height.value - margin.value.top - margin.value.bottom
  return { width: widthP, height: heightP }
})

const formattedData = computed(() => {
  if (!loadedData.value) {
    return []
  }
  return loadedData.value.map((d: any) => {
    // toRaw prevent modifying the Proxy object created with the props.data
    let rawD = toRaw(d)
    rawD[props.timeseriesKey] = parseTime(d[props.timeseriesKey])
    rawD[props.seriesName] = +d[props.seriesName]
    return rawD
  })
})

const createLine = d3
  .line()
  .x((d: any) => d.x)
  .y((d: any) => d.y)

const parseTime = d3.timeParse('%Y')

function setSizes() {
  if (el.value) {
    width.value = el.value.offsetWidth
    height.value
      = props.fixedHeight !== null
        ? props.fixedHeight
        : el.value.offsetWidth * baseHeightRatio.value
  }
}

function update() {
  scale.value.x.domain(
    d3.extent(formattedData.value, (d: any) => d[props.timeseriesKey]) as [Date, Date]
  )
  scale.value.y.domain([
    0,
    d3.max(formattedData.value, (d: any) => d[props.seriesName]) as number
  ])

  const points = formattedData.value.map((d: any) => {
    return {
      x: scale.value.x(d[props.timeseriesKey]),
      y: scale.value.y(d[props.seriesName])
    }
  })

  line.value = createLine(points as any) as any
  d3.select(el.value)
    .select('.line-chart__axis--x')
    .call(
      d3
        .axisBottom(scale.value.x)
        .ticks(props.xAxisTicks as any)
        .tickFormat((d: any) => castCall(xAxisYearFormat, d.getFullYear())) as any
    )
  d3.select(el.value)
    .select('.line-chart__axis--y')
    .call(
      d3
        .axisLeft(scale.value.y)
        .tickFormat((d: any) => d3Formatter(d, props.yAxisTickFormat))
        .ticks(props.yAxisTicks) as any
    )
    .selectAll('.tick line')
    .attr('x2', padded.value.width)
}

watchEffect(() => {
  update()
})
</script>

<template>
  <div
    ref="el"
    class="line-chart"
    :style="{ '--line-color': lineColor }"
    :class="{ 'line-chart--social-mode': socialMode }"
  >
    <svg
      :width="width"
      :height="height"
    >
      <g
        class="line-chart__axis line-chart__axis--x"
        :style="{
          transform: `translate(${margin.left}px, ${margin.top + padded.height}px)`
        }"
      >
        >
      </g>
      <g
        class="line-chart__axis line-chart__axis--y"
        :style="{ transform: `translate(${margin.left}px, ${margin.top}px)` }"
      >
        >
      </g>
      <g :style="{ transform: `translate(${margin.left}px, ${margin.top}px)` }">
        <path
          class="line-chart__line"
          :d="line"
        />
      </g>
    </svg>
  </div>
</template>

<style lang="scss">

.line-chart {
  text {
    font-family: $font-family-base;
    font-size: $font-size-sm;
    fill: currentColor;
  }

  &__axis {
    .domain {
      display: none;
    }

    .tick line {
      stroke: $border-color;
    }

    &--x .tick line {
      display: none;
    }
  }

  &__line {
    fill: none;
    stroke: var(--line-color, var(--dark, $dark));
    stroke-width: 3px;
  }
}
</style>
