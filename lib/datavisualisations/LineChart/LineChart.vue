<script setup lang="ts">
import * as d3 from 'd3'
import identity from 'lodash/identity'
import { getChartProps, useChart } from '@/composables/useChart'
import { useLineChart } from '@/composables/useLineChart'
import { computed, ref, toRef, watchEffect, ComponentPublicInstance } from 'vue'

defineOptions({
  name: 'LineChart'
})

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
   * D3 curve factory for line interpolation (e.g. d3.curveStep, d3.curveMonotoneX).
   * Defaults to d3.curveLinear.
   */
  curve?: d3.CurveFactory
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
  curve: undefined,
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
const isLoaded = ref(false)

const {
  loadedData,
  elementsMaxBBox,
  d3Formatter,
  xAxisYearFormat,
  baseHeightRatio
} = useChart(el, getChartProps(props), { emit }, isLoaded, setSizes)

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

const margin = computed(() => {
  const left = labelWidth.value + 10
  const right = bucketWidth.value / 2
  const top = labelHeight.value
  const bottom = bucketHeight.value + 10
  return { left, right, top, bottom }
})

const padded = computed(() => {
  const widthP = Math.max(0, width.value - margin.value.left - margin.value.right)
  const heightP = Math.max(0, height.value - margin.value.top - margin.value.bottom)
  return { width: widthP, height: heightP }
})

// Pure d3 geometry (scales, line paths, axes) lives in the line-chart
// composable; the component keeps the DOM measurement and axis rendering.
const {
  isMultiLine,
  activeKeys,
  colorScale,
  formattedData,
  scaleX,
  scaleY,
  lines,
  line,
  xAxis,
  yAxis
} = useLineChart({
  loadedData,
  padded,
  d3Formatter,
  xAxisYearFormat,
  keys: toRef(() => props.keys),
  seriesName: toRef(() => props.seriesName),
  timeseriesKey: toRef(() => props.timeseriesKey),
  lineColors: toRef(() => props.lineColors),
  curve: toRef(() => props.curve),
  xAxisTicks: toRef(() => props.xAxisTicks),
  yAxisTickFormat: toRef(() => props.yAxisTickFormat),
  yAxisTicks: toRef(() => props.yAxisTicks)
})

function setSizes() {
  if (el.value) {
    width.value = el.value.offsetWidth
    let h = props.fixedHeight !== null
      ? props.fixedHeight
      : el.value.offsetWidth * baseHeightRatio.value
    // Subtract legend height so the SVG fits within the container
    const legend = el.value.querySelector('.line-chart__legend')
    if (legend) {
      const style = getComputedStyle(legend)
      h -= legend.offsetHeight + (parseFloat(style.marginTop) || 0) + (parseFloat(style.marginBottom) || 0)
    }
    height.value = Math.max(0, h)
  }
}

// Render the axes imperatively from the composable's d3 axis generators; the
// line paths themselves are bound declaratively in the template.
function update() {
  d3.select(el.value)
    .select('.line-chart__axis--x')
    .call(xAxis.value as any)
  d3.select(el.value)
    .select('.line-chart__axis--y')
    .call(yAxis.value as any)
    .selectAll('.tick line')
    .attr('x2', padded.value.width)
}

watchEffect(() => {
  update()
})

defineExpose({
  width,
  height,
  setSizes,
  isMultiLine,
  activeKeys,
  colorScale,
  formattedData,
  scaleX,
  scaleY,
  lines,
  line,
  xAxis,
  yAxis,
  highlightedKey,
  hasHighlight,
  highlight,
  resetHighlight,
  isHighlighted
})
</script>

<template>
  <div
    ref="el"
    class="line-chart"
    :style="{ '--line-color': lineColor }"
    :class="{
      'line-chart--social-mode': socialMode,
      'line-chart--multi': isMultiLine,
      'line-chart--has-highlight': hasHighlight
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
        :class="{ 'line-chart__legend__item--highlighted': isHighlighted(key) }"
        @mouseover="highlight(key)"
        @mouseleave="resetHighlight()"
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
            :class="{ 'line-chart__line--highlighted': isHighlighted(series.key) }"
            :d="series.path"
            :style="{ stroke: series.color }"
            @mouseover="highlight(series.key)"
            @mouseleave="resetHighlight()"
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
      transition: opacity 0.3s, filter 0.3s;

      .line-chart--has-highlight &:not(&--highlighted) {
        opacity: 0.2;
        filter: grayscale(30%) brightness(10%);
      }

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
    transition: opacity 0.3s;

    .line-chart--has-highlight &:not(&--highlighted) {
      opacity: 0.15;
    }
  }
}
</style>
