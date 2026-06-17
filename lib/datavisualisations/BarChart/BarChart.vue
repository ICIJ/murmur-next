<script setup lang="ts">
import identity from 'lodash/identity'
import { computed, ref, toRef, ComponentPublicInstance } from 'vue'
import { getChartProps, useChart } from '@/composables/useChart'
import { useBarChart } from '@/composables/useBarChart'

defineOptions({
  name: 'BarChart'
})

export interface BarChartProps {
  /**
   * Height of each bar in pixels.
   */
  barHeight?: number
  /**
   * Vertical gap between bars in pixels.
   */
  barGap?: number
  /**
   * Color of the bars. Falls back to theme's dark color.
   */
  barColor?: string | null
  /**
   * Color of highlighted bars. Falls back to theme's primary color.
   */
  barHighlightColor?: string | null
  /**
   * Fixed width for labels in pixels. If not set, width is calculated automatically.
   */
  fixedLabelWidth?: number | null
  /**
   * Fixed width for values in pixels. If not set, width is calculated automatically.
   */
  fixedValueWidth?: number | null
  /**
   * Horizontal gap between labels and bars in pixels.
   */
  labelGap?: number
  /**
   * Horizontal gap between bars and their values in pixels.
   */
  valueGap?: number
  /**
   * Field name(s) to sort the data by.
   */
  sortBy?: string | string[] | null
  /**
   * Formatter function or d3 format string for x-axis tick values.
   */
  xAxisTickFormat?: ((v: any) => string) | string
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

const props = withDefaults(defineProps<BarChartProps>(), {
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

// Label and value widths are measured from the rendered SVG text, so they stay
// in the component (the geometry composable holds no DOM state) and feed it.
const labelWidth = computed(() => {
  if (props.fixedLabelWidth) {
    return props.fixedLabelWidth
  }
  const selector = '.bar-chart__labels__item'
  const defaultWidth = 100
  return elementsMaxBBox({ selector, defaultWidth }).width as number
})

const valueWidth = computed(() => {
  if (props.fixedValueWidth) {
    return props.fixedValueWidth
  }
  const selector = '.bar-chart__bars__item__value'
  const defaultWidth = 0
  return (elementsMaxBBox({ selector, defaultWidth }).width as number) + props.valueGap
})

const { margin, padded, scale, bars, labels, height } = useBarChart({
  loadedData,
  width,
  labelWidth,
  valueWidth,
  sortBy: toRef(() => props.sortBy),
  barHeight: toRef(() => props.barHeight),
  barGap: toRef(() => props.barGap),
  labelGap: toRef(() => props.labelGap)
})

function formatXDatum(d: number | number[]) {
  return d3Formatter(d, props.xAxisTickFormat)
}

function onResize() {
  if (el.value) {
    width.value = el.value?.offsetWidth
  }
}

// Expose the derived geometry so tests (and host apps) can read the scale and
// dimensions the chart computes.
defineExpose({ margin, padded, scale, bars, labels, height })
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
