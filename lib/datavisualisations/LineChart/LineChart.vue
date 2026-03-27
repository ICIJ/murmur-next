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

export interface LineChartProps {
  /**
   * Color of the line. Falls back to theme's dark color.
   * Used for single-series mode (when `keys` is not set).
   */
  lineColor?: string | null
  /**
   * Colors for each line when using multi-series mode (`keys`).
   */
  lineColors?: string[]
  /**
   * Field names in data objects for each line series.
   * When set, enables multi-line mode. When empty, falls back to `seriesName`.
   */
  keys?: string[]
  /**
   * Display names for each key in the legend.
   */
  groups?: string[]
  /**
   * Hide the legend (only relevant in multi-line mode).
   */
  hideLegend?: boolean
  /**
   * Fixed width for y-axis labels in pixels. If not set, width is calculated automatically.
   */
  fixedLabelWidth?: number | null
  /**
   * Fixed height for the chart in pixels. If not set, height is calculated from width.
   */
  fixedHeight?: number | null
  /**
   * Field name in data objects containing the y-axis value.
   * Used for single-series mode (when `keys` is not set).
   */
  seriesName?: string
  /**
   * Number of x-axis ticks or d3 tick configuration.
   */
  xAxisTicks?: object | number | ((d: any) => any) | null
  /**
   * Formatter function or d3 format string for y-axis tick labels.
   */
  yAxisTickFormat?: ((v: any) => string) | string
  /**
   * Number of y-axis ticks or d3 tick configuration.
   */
  yAxisTicks?: object | number
  /**
   * Field name in data objects containing the x-axis time/date value (parsed as year).
   */
  timeseriesKey?: string
  /**
   * Data to display, either as a URL string to fetch or an array of objects.
   */
  data?: string | object[] | null
  /**
   * Type of data file when fetching from URL.
   */
  dataUrlType?: 'json' | 'csv' | 'tsv'
  /**
   * Aspect ratio (height/width) for the chart.
   */
  chartHeightRatio?: number
  /**
   * Enable social mode for optimal display when sharing on social media.
   */
  socialMode?: boolean
  /**
   * Aspect ratio to use in social mode.
   */
  socialModeRatio?: number
}

const props = withDefaults(defineProps<LineChartProps>(), {
  lineColor: null,
  lineColors: () => [],
  keys: () => [],
  groups: () => [],
  hideLegend: false,
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

interface LineSeries {
  key: string
  path: string | null
  color: string | null
}

const width = ref(0)
const height = ref(0)
const el = ref<ComponentPublicInstance<HTMLElement> | null>(null)
const line = ref<d3.Line<[number, number]> | null>(null)
const lines = ref<LineSeries[]>([])
const isLoaded = ref(false)

const {
  loadedData,
  elementsMaxBBox,
  d3Formatter,
  xAxisYearFormat,
  baseHeightRatio
} = useChart(el, getChartProps(props), { emit }, isLoaded, setSizes)

const isMultiLine = computed(() => props.keys.length > 0)

const activeKeys = computed(() => {
  return isMultiLine.value ? props.keys : [props.seriesName]
})

const colorScale = computed(() => {
  return d3
    .scaleOrdinal<string>()
    .domain(activeKeys.value)
    .range(props.lineColors.length ? props.lineColors : d3.schemeCategory10)
})

const highlightedKey = ref<string | null>(null)

const hasHighlight = computed(() => highlightedKey.value !== null)

function highlight(key: string) {
  highlightedKey.value = key
}

function resetHighlight() {
  highlightedKey.value = null
}

function isHighlighted(key: string) {
  return highlightedKey.value === key
}

function groupName(key: string) {
  const index = props.keys.indexOf(key)
  return props.groups[index] || key
}

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
    // Clone to avoid mutating reactive source data (parseTime on already-parsed Date returns null)
    const rawD = { ...toRaw(d) }
    rawD[props.timeseriesKey] = parseTime(d[props.timeseriesKey])
    for (const key of activeKeys.value) {
      rawD[key] = +d[key]
    }
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

  // Y domain covers all series
  const maxY = d3.max(activeKeys.value, (key) => {
    return d3.max(formattedData.value, (d: any) => d[key]) as number
  }) as number
  scale.value.y.domain([0, maxY])

  if (isMultiLine.value) {
    lines.value = activeKeys.value.map((key) => {
      const points = formattedData.value.map((d: any) => ({
        x: scale.value.x(d[props.timeseriesKey]),
        y: scale.value.y(d[key])
      }))
      return {
        key,
        path: createLine(points as any) as unknown as string,
        color: colorScale.value(key)
      }
    })
  }
  else {
    const points = formattedData.value.map((d: any) => ({
      x: scale.value.x(d[props.timeseriesKey]),
      y: scale.value.y(d[props.seriesName])
    }))
    line.value = createLine(points as any) as any
  }

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
    :class="{
      'line-chart--social-mode': socialMode,
      'line-chart--multi': isMultiLine
    }"
  >
    <ul
      v-if="isMultiLine && !hideLegend"
      class="line-chart__legend list-inline"
    >
      <li
        v-for="key in activeKeys"
        :key="key"
        class="line-chart__legend__item list-inline-item d-inline-flex"
      >
        <span
          class="line-chart__legend__item__box"
          :style="{ 'background-color': colorScale(key) }"
        />
        <span class="line-chart__legend__item__label">{{ groupName(key) }}</span>
      </li>
    </ul>
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
        <template v-if="isMultiLine">
          <path
            v-for="series in lines"
            :key="series.key"
            class="line-chart__line"
            :d="series.path"
            :style="{ stroke: series.color }"
          />
        </template>
        <path
          v-else
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

  &__legend {
    &__item {
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      padding-right: $spacer * 0.5;

      &__box {
        height: 1em;
        width: 1em;
        border-radius: 0.5em;
        display: inline-block;
        margin-right: $spacer * 0.5;
      }
    }
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
