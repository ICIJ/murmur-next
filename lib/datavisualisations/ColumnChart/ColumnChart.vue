<script setup lang="ts">
import { ComponentPublicInstance, computed, getCurrentInstance, ref, toRef, watch } from 'vue'
import { identity } from 'lodash'
import * as d3 from 'd3'

import { getChartProps, useChart } from '@/composables/useChart'
import { useColumnChart } from '@/composables/useColumnChart'
import AppIcon from '@/components/App/AppIcon.vue'

defineOptions({
  name: 'ColumnChart'
})

export interface ColumnChartProps {
  /**
   * Color of the columns. Falls back to theme's dark color.
   */
  columnColor?: string | null
  /**
   * Color of highlighted columns. Falls back to theme's primary color.
   */
  columnHighlightColor?: string | null
  /**
   * Fixed height for the chart in pixels. If not set, height is calculated from width.
   */
  fixedHeight?: number | null
  /**
   * Fixed width for y-axis labels in pixels. If not set, width is calculated automatically.
   */
  fixedLabelWidth?: number | null
  /**
   * Field name in data objects containing the value to display.
   */
  seriesName?: string
  /**
   * Collapse x-axis ticks to prevent overlapping when there are many data points.
   */
  xAxisTickCollapse?: boolean
  /**
   * Formatter function or d3 format string for x-axis tick labels.
   */
  xAxisTickFormat?: ((v: any) => string) | string
  /**
   * Explicit list of x-axis tick values to display.
   */
  xAxisTicks?: string[] | null
  /**
   * Formatter function or d3 format string for y-axis tick labels.
   */
  yAxisTickFormat?: ((v: any) => string) | string
  /**
   * Number of y-axis ticks or d3 tick configuration object.
   */
  yAxisTicks?: number | object
  /**
   * Field name(s) to sort the data by.
   */
  sortBy?: string | string[] | null
  /**
   * Field name in data objects containing the x-axis category/time value.
   */
  timeseriesKey?: string
  /**
   * Maximum value for the y-axis scale. If not set, derived from data.
   */
  maxValue?: number | null
  /**
   * Disable tooltips on column hover.
   */
  noTooltips?: boolean
  /**
   * Hide the x-axis.
   */
  noXAxis?: boolean
  /**
   * Hide the y-axis.
   */
  noYAxis?: boolean
  /**
   * Padding between columns as a ratio (0-1) of the column width.
   */
  barPadding?: number
  /**
   * Margin between columns in pixels.
   */
  barMargin?: number
  /**
   * List of timeseriesKey values to highlight.
   */
  highlights?: string[]
  /**
   * Show placeholder bars for visual pattern.
   */
  stripped?: boolean
  /**
   * Enable hover effects on columns.
   */
  hover?: boolean
  /**
   * Icon component to display on column hover.
   */
  hoverIcon?: string | object | object[] | null
  /**
   * Size of the hover icon.
   */
  hoverIconSize?: string
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
  /**
   * Display columns as a waterfall chart where each bar starts where the previous one ended.
   */
  waterfall?: boolean
  /**
   * Show a total bar at the end of the waterfall chart displaying the sum of all values.
   * Only applies when `waterfall` is true.
   */
  waterfallTotal?: boolean
  /**
   * Label for the waterfall total bar on the x-axis.
   */
  waterfallTotalLabel?: string
  /**
   * Color for the waterfall total bar. Falls back to currentColor.
   */
  waterfallTotalColor?: string | null
}

const props = withDefaults(defineProps<ColumnChartProps>(), {
  columnColor: null,
  columnHighlightColor: null,
  fixedHeight: null,
  fixedLabelWidth: null,
  seriesName: 'value',
  xAxisTickCollapse: false,
  xAxisTickFormat: () => identity,
  xAxisTicks: null,
  yAxisTickFormat: () => identity,
  yAxisTicks: 5,
  sortBy: null,
  timeseriesKey: 'date',
  maxValue: null,
  noTooltips: false,
  noXAxis: false,
  noYAxis: false,
  barPadding: 0.35,
  barMargin: 0,
  highlights: () => [],
  stripped: false,
  hover: false,
  hoverIcon: null,
  hoverIconSize: undefined,
  data: null,
  dataUrlType: 'json',
  chartHeightRatio: undefined,
  socialMode: false,
  socialModeRatio: 5 / 4,
  waterfall: false,
  waterfallTotal: false,
  waterfallTotalLabel: 'Total',
  waterfallTotalColor: null
})

const emit = defineEmits<{
  loaded: [data: any]
  select: [datum: any]
  resized: []
}>()

const width = ref(0)
const height = ref(0)
const shownTooltip = ref(-1)
const el = ref<ComponentPublicInstance<HTMLElement> | null>(null)
const isLoaded = ref(false)

const {
  loadedData,
  mounted,
  elementsMaxBBox,
  d3Formatter,
  baseHeightRatio,
  dataHasHighlights
} = useChart(el, getChartProps(props), { emit }, isLoaded, setSizes)

// Label and bucket dimensions are measured from the rendered SVG ticks, so they
// stay in the component (the geometry composable holds no DOM state) and feed it.
const labelWidth = computed((): number => {
  if (props.fixedLabelWidth) {
    return props.fixedLabelWidth
  }
  const selector = '.column-chart__axis--y .tick text'
  const defaultWidth = 100
  return elementsMaxBBox({ selector, defaultWidth }).width as number
})

const labelHeight = computed((): number => {
  if (props.noYAxis) {
    return 0
  }
  const selector = '.column-chart__axis--y .tick text'
  const defaultHeight = 10
  return elementsMaxBBox({ selector, defaultHeight }).height as number
})

const bucketHeight = computed((): number => {
  if (props.noXAxis) {
    return 0
  }
  const selector = '.column-chart__axis--x .tick text'
  const defaultHeight = 10
  return elementsMaxBBox({ selector, defaultHeight }).height as number
})

const bucketWidth = computed((): number => {
  const selector = '.column-chart__axis--x .tick text'
  const defaultWidth = 100
  return elementsMaxBBox({ selector, defaultWidth }).width as number
})

const {
  sortedData,
  margin,
  padded,
  scaleX,
  scaleY,
  waterfallTotalValue,
  bars,
  xAxisHiddenTicks,
  xAxisTickValues,
  xAxis,
  yAxis
} = useColumnChart({
  loadedData,
  width,
  height,
  labelWidth,
  labelHeight,
  bucketHeight,
  bucketWidth,
  d3Formatter,
  sortBy: toRef(() => props.sortBy),
  seriesName: toRef(() => props.seriesName),
  timeseriesKey: toRef(() => props.timeseriesKey),
  maxValue: toRef(() => props.maxValue),
  barPadding: toRef(() => props.barPadding),
  barMargin: toRef(() => props.barMargin),
  noXAxis: toRef(() => props.noXAxis),
  noYAxis: toRef(() => props.noYAxis),
  xAxisTickCollapse: toRef(() => props.xAxisTickCollapse),
  xAxisTickFormat: toRef(() => props.xAxisTickFormat),
  xAxisTicks: toRef(() => props.xAxisTicks),
  yAxisTickFormat: toRef(() => props.yAxisTickFormat),
  yAxisTicks: toRef(() => props.yAxisTicks),
  waterfall: toRef(() => props.waterfall),
  waterfallTotal: toRef(() => props.waterfallTotal),
  waterfallTotalLabel: toRef(() => props.waterfallTotalLabel)
})

const activeBar = computed(() => bars.value[shownTooltip.value] ?? null)
const activeBarId = computed((): string => columnUniqueId(shownTooltip.value))

function formatXDatum(d: any) {
  return d3Formatter(d, props.xAxisTickFormat)
}

function formatYDatum(d: any) {
  return d3Formatter(d, props.yAxisTickFormat)
}

function setSizes() {
  width.value = (el.value as HTMLElement)?.offsetWidth ?? 0
  height.value
    = props.fixedHeight !== null
      ? props.fixedHeight
      : width.value * baseHeightRatio.value
}

function select({ datum }: { datum: any }) {
  emit('select', datum)
}

function update() {
  if (!mounted.value) {
    return
  }

  d3.select('.column-chart__axis > *').remove()

  d3.select(el.value)
    .select('.column-chart__axis--x')
    .call(xAxis.value as any)
    .select('.domain')
    .remove()

  d3.select(el.value)
    .select('.column-chart__axis--y')
    .call(yAxis.value as any)
    .selectAll('.tick line')
    .attr('x2', padded.value.width)
}

function columnUniqueId(i: number) {
  const { uid } = getCurrentInstance()!
  return `column-${uid}-${i}`
}

function highlighted(datum: any): boolean {
  return (
    datum.highlight || props.highlights.includes(datum[props.timeseriesKey])
  )
}

watch([width, height, loadedData, mounted], update, { immediate: true })
watch(() => props.socialMode, update, { immediate: true })

// Expose the derived geometry so tests (and host apps) can read the scales and
// dimensions the chart computes. Superset of the bindings poked by the specs.
defineExpose({
  sortedData,
  margin,
  padded,
  scaleX,
  scaleY,
  waterfallTotalValue,
  bars,
  xAxisHiddenTicks,
  xAxisTickValues,
  xAxis,
  yAxis
})
</script>

<template>
  <div
    ref="el"
    :class="{
      'column-chart--has-highlights': dataHasHighlights || highlights.length > 0,
      'column-chart--hover': hover,
      'column-chart--stripped': stripped,
      'column-chart--social-mode': socialMode,
      'column-chart--loaded': isLoaded,
      'column-chart--waterfall': waterfall
    }"
    :style="{
      '--column-color': columnColor,
      '--column-highlight-color': columnHighlightColor,
      '--column-total-color': waterfallTotalColor
    }"
    class="column-chart"
  >
    <svg
      :height="height"
      :width="width"
    >
      <g :style="{ transform: `translate(${margin.left}px, ${margin.top}px)` }">
        <g
          v-if="!noXAxis"
          :style="{ transform: `translate(0, ${padded.height}px)` }"
          class="column-chart__axis column-chart__axis--x"
        />
        <g
          v-if="!noYAxis"
          class="column-chart__axis column-chart__axis--y"
        />
      </g>
      <g
        :style="{ transform: `translate(${margin.left}px, ${margin.top}px)` }"
        class="column-chart__columns"
      >
        <g
          v-for="(bar, index) in bars"
          :key="index"
          :class="{
            'column-chart__columns__item--highlight': highlighted(bar.datum),
            'column-chart__columns__item--total': bar.isTotal
          }"
          :style="{ transform: `translate(${bar.x}px, 0px)` }"
          class="column-chart__columns__item"
          @click="select(bar)"
          @mouseleave="shownTooltip = -1"
          @mouseover="shownTooltip = index"
        >
          <rect
            :height="Math.max(padded.height, 0)"
            :width="bar.width"
            class="column-chart__columns__item__placeholder"
          />
          <rect
            :id="columnUniqueId(index)"
            :height="Math.max(bar.height, 0.1)"
            :width="bar.width"
            :y="bar.y"
            class="column-chart__columns__item__bar"
          />
          <foreignObject
            v-if="hoverIcon"
            :height="Math.max(bar.height, 0.1)"
            :width="bar.width"
            :y="bar.y"
          >
            <div class="column-chart__columns__item__hover-icon">
              <app-icon :size="hoverIconSize">
                <component :is="hoverIcon" />
              </app-icon>
            </div>
          </foreignObject>
        </g>
      </g>
    </svg>
    <template v-if="!noTooltips && activeBar">
      <b-tooltip
        :target="activeBarId"
        teleport-to="body"
        manual
        :model-value="true"
        class="column-chart__tooltip"
      >
        <slot
          name="tooltip"
          v-bind="activeBar"
        >
          <h6 class="column-chart__tooltip__heading mb-0">
            {{ formatXDatum(activeBar.datum[timeseriesKey]) }}
          </h6>
          <div class="column-chart__tooltip__value">
            {{ formatYDatum(activeBar.datum[seriesName]) }}
          </div>
        </slot>
      </b-tooltip>
    </template>
  </div>
</template>

<style lang="scss">

.column-chart {
  --highlight-opacity: 0.7;
  --placeholder-opacity: 0.1;

  position: relative;

  &--has-highlights
    &__columns__item:not(&__columns__item--highlight):not(:hover) {
    opacity: var(--highlight-opacity);
    filter: grayscale(30%);
  }

  text {
    font-family: $font-family-base;
    font-size: $font-size-sm;
    fill: currentColor;
  }

  &__columns__item {
    fill: var(--column-color, var(--dark, $dark));

    &--highlight {
      fill: var(--column-highlight-color, var(--primary, $primary));
    }

    &--total {
      fill: var(--column-total-color, currentColor);
    }

    &__placeholder {
      opacity: 0;

      .column-chart--stripped &,
      .column-chart--hover .column-chart__columns__item:hover & {
        opacity: var(--placeholder-opacity);
      }
    }

    &__hover-icon {
      opacity: 0;
      overflow: hidden;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .column-chart--hover .column-chart__columns__item:hover & {
        opacity: 1;
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

  &__tooltip {
    pointer-events: none;
  }
}
</style>
