<script lang="ts">
import { ComponentPublicInstance, computed, defineComponent, getCurrentInstance, PropType, ref, watch } from 'vue'
import { identity, iteratee, sortBy } from 'lodash'
import * as d3 from 'd3'
import { chartProps, getChartProps, useChart } from '@/composables/chart'

type ColumnBar = {
  datum: { [timeSerie: string]: any }
  width: number
  height: number
  x: number
  y: number
}

export default defineComponent({
  name: 'ColumnChart',
  props: {
    /**
     * Color of each column (uses the CSS variable --column-color by default)
     */
    columnColor: {
      type: String as PropType<string>,
      default: null
    },
    /**
     * Color of each highlighted column (uses the CSS variable --column-color by default)
     */
    columnHighlightColor: {
      type: String as PropType<string>,
      default: null
    },
    /**
     * Enforce the height of the chart (regardless of the width or the social mode)
     */
    fixedHeight: {
      type: Number as PropType<number>,
      default: null
    },
    /**
     * Enforce a width for each column's label
     */
    fixedLabelWidth: {
      type: Number as PropType<number>,
      default: null
    },
    /**
     * Name of the series (to get the value from in the data collection objects)
     */
    seriesName: {
      type: String as PropType<string>,
      default: 'value'
    },
    /**
     * Hide x-axis ticks when no enough space
     */
    xAxisTickCollapse: {
      type: Boolean as PropType<boolean> as PropType<boolean>,
      default: false
    },
    /**
     * Function to apply to format x-axis ticks
     */
    xAxisTickFormat: {
      type: [Function, String] as PropType<Function | string>,
      default: () => identity
    },
    /**
     * Definition of x-axis ticks
     */
    xAxisTicks: {
      type: Array as PropType<string[] | null>,
      default: null
    },
    /**
     * Function to apply to format y-axis ticks
     */
    yAxisTickFormat: {
      type: [Function, String] as PropType<Function | string>,
      default: () => identity
    },
    /**
     * Definition of y-axis ticks
     */
    yAxisTicks: {
      type: [Number, Object] as PropType<number | object>,
      default: 5
    },
    /**
     * Sort columns by one or several keys.
     */
    sortBy: {
      type: [Array, String] as PropType<string | string[]>,
      default: null
    },
    /**
     * Key to use for timeseries
     */
    timeseriesKey: {
      type: String as PropType<string>,
      default: 'date'
    },
    /**
     * Set max value instead of extracting it from the data.
     */
    maxValue: {
      type: Number as PropType<number>,
      default: null
    },
    /**
     * Hide bar tooltips
     */
    noTooltips: {
      type: Boolean as PropType<boolean>
    },
    /**
     * Hide x axis
     */
    noXAxis: {
      type: Boolean as PropType<boolean>
    },
    /**
     * Hide y axis
     */
    noYAxis: {
      type: Boolean as PropType<boolean>
    },
    /**
     * Bar padding as a portion of each bar width
     */
    barPadding: {
      type: Number as PropType<number>,
      default: 0.35
    },
    /**
     * Bar margin in pixel
     */
    barMargin: {
      type: Number as PropType<number>,
      default: 0
    },
    /**
     * A list of highlighted key
     */
    highlights: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    /**
     * Show a "placeholder" behind every bar
     */
    stripped: {
      type: Boolean as PropType<boolean>
    },
    /**
     * Show a "placeholder" behind every bar on hover
     */
    hover: {
      type: Boolean as PropType<boolean>
    },
    ...chartProps()
  },
  setup(props, { emit }) {
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

    const sortedData = computed((): any[] => {
      if (!loadedData.value) {
        return []
      }
      return !props.sortBy
        ? loadedData.value
        : sortBy(sortedData.value, props.sortBy)
    })

    const labelWidth = computed((): number => {
      if (props.fixedLabelWidth) {
        return props.fixedLabelWidth
      }
      const selector = '.column-chart__axis--y .tick text'
      const defaultWidth = 100
      return elementsMaxBBox({ selector, defaultWidth }).width
    })

    const labelHeight = computed((): number => {
      if (props.noYAxis) {
        return 0
      }
      const selector = '.column-chart__axis--y .tick text'
      const defaultHeight = 10
      return elementsMaxBBox({ selector, defaultHeight }).height
    })

    const bucketHeight = computed((): number => {
      if (props.noXAxis) {
        return 0
      }
      const selector = '.column-chart__axis--x .tick text'
      const defaultHeight = 10
      return elementsMaxBBox({ selector, defaultHeight }).height
    })

    const bucketWidth = computed((): number => {
      const selector = '.column-chart__axis--x .tick text'
      const defaultWidth = 100
      return elementsMaxBBox({ selector, defaultWidth }).width
    })

    const margin = computed(
      (): { left: number; right: number; top: number; bottom: number } => {
        return {
          left: props.noYAxis ? 0 : labelWidth.value + 10,
          right: 0,
          top: labelHeight.value / 2,
          bottom: props.noXAxis ? 0 : bucketHeight.value + 10
        }
      }
    )

    const padded = computed((): { width: number; height: number } => {
      const widthP = width.value - margin.value.left - margin.value.right
      const heightP = height.value - margin.value.top - margin.value.bottom
      return { width: widthP, height: heightP }
    })

    const scaleX = computed((): d3.ScaleBand<string> => {
      return d3
        .scaleBand()
        .domain(sortedData.value.map(iteratee(props.timeseriesKey)))
        .range([0, padded.value.width])
        .padding(props.barPadding)
    })

    const scaleY = computed((): d3.ScaleLinear<number, number> => {
      const maxValue =
        props.maxValue ?? d3.max(sortedData.value, iteratee(props.seriesName))
      return d3
        .scaleLinear()
        .domain([0, maxValue])
        .range([padded.value.height, 0])
    })

    const bars = computed((): ColumnBar[] => {
      return sortedData.value.map((datum: any) => {
        return {
          datum,
          width: Math.max(
            1,
            Math.abs(scaleX.value.bandwidth()) - props.barMargin
          ),
          height: Math.abs(
            padded.value.height - scaleY.value(datum[props.seriesName])
          ),
          x:
            (scaleX.value(datum[props.timeseriesKey]) ?? 0) +
            props.barMargin / 2,
          y: scaleY.value(datum[props.seriesName]) ?? 0
        }
      })
    })

    const xAxisHiddenTicks = computed((): number => {
      if (!props.xAxisTickCollapse) {
        return 0
      }

      const hiddenTicks = d3.range(1, sortedData.value.length).find((mod) => {
        const bucketWidthT = bucketWidth.value * 1.5
        return width.value / (bucketWidthT / mod) >= sortedData.value.length
      })

      return hiddenTicks ?? sortedData.value.length
    })

    const xAxisTickValues = computed((): string[] => {
      // Either use the explicit `xAxisTicks` prop or use the data
      const ticks =
        props.xAxisTicks ?? sortedData.value.map(iteratee(props.timeseriesKey))
      // Then filter out ticks according to `this.xAxisHiddenTicks`
      return ticks.map((tick, i) => {
        return (i + 1) % xAxisHiddenTicks.value ? null : tick
      })
    })

    const xAxis = computed((): d3.Axis<string> => {
      return d3
        .axisBottom(scaleX.value)
        .tickFormat((d) => d3Formatter(d, props.xAxisTickFormat))
        .tickValues(xAxisTickValues.value)
    })

    const yAxis = computed((): d3.Axis<d3.NumberValue> => {
      return d3
        .axisLeft(scaleY.value)
        .tickFormat((d) => d3Formatter(d, props.yAxisTickFormat))
        .ticks(props.yAxisTicks)
    })

    const activeBar = computed((): ColumnBar => bars.value[shownTooltip.value] ?? null)
    const activeBarId = computed((): string => columnUniqueId(shownTooltip.value))

    function formatXDatum(d: any) {
      return d3Formatter(d, props.xAxisTickFormat)
    }

    function formatYDatum(d: any) {
      return d3Formatter(d, props.yAxisTickFormat)
    }

    function setSizes() {
      width.value = (el.value as HTMLElement)?.offsetWidth ?? 0
      height.value =
        props.fixedHeight !== null
          ? props.fixedHeight
          : width.value * baseHeightRatio.value
    }

    function select({ datum }: { datum: any }) {
      /**
       * Fired when a column is selected
       * @event click
       * @param Mixed New step value.
       */
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
      // @ts-ignore
      const { uid } = getCurrentInstance()
      return `column-${uid}-${i}`
    }

    function highlighted(datum: any): boolean {
      return (
        datum.highlight || props.highlights.includes(datum[props.timeseriesKey])
      )
    }

    watch([width, height, loadedData, mounted], update.bind(this), { immediate: true})
    watch(() => props.socialMode, update.bind(this), { immediate: true})

    return {
      el,
      activeBar,
      activeBarId,
      columnUniqueId,
      dataHasHighlights,
      width,
      height,
      margin,
      padded,
      isLoaded,
      shownTooltip,
      bars,
      select,
      highlighted,
      formatYDatum,
      formatXDatum
    }
  }
})
</script>

<template>
  <div
    ref="el"
    :class="{
      'column-chart--has-highlights': dataHasHighlights,
      'column-chart--hover': hover,
      'column-chart--stripped': stripped,
      'column-chart--social-mode': socialMode,
      'column-chart--loaded': isLoaded
    }"
    :style="{
      '--column-color': columnColor,
      '--column-highlight-color': columnHighlightColor
    }"
    class="column-chart"
  >
    <svg :height="height" :width="width">
      <g :style="{ transform: `translate(${margin.left}px, ${margin.top}px)` }">
        <g
          v-if="!noXAxis"
          :style="{ transform: `translate(0, ${padded.height}px)` }"
          class="column-chart__axis column-chart__axis--x"
        />
        <g v-if="!noYAxis" class="column-chart__axis column-chart__axis--y" />
      </g>
      <g
        :style="{ transform: `translate(${margin.left}px, ${margin.top}px)` }"
        class="column-chart__columns"
      >
        <g
          v-for="(bar, index) in bars"
          :key="index"
          :class="{
            'column-chart__columns__item--highlight': highlighted(bar.datum)
          }"
          :style="{ transform: `translate(${bar.x}px, 0px)` }"
          class="column-chart__columns__item"
          @click="select(bar)"
          @mouseleave="shownTooltip = -1"
          @mouseover="shownTooltip = index"
        >
          <rect
            :height="padded.height"
            :width="bar.width"
            class="column-chart__columns__item__placeholder"
          />
          <rect
            :height="Math.max(bar.height, 0.1)"
            :width="bar.width"
            :y="bar.y"
            :id="columnUniqueId(index)"
            class="column-chart__columns__item__bar"
          />
        </g>
      </g>
    </svg>
    <template v-if="!noTooltips && activeBar">
      <b-tooltip :target="activeBarId" teleport-to="body" manual :model-value="true" class="column-chart__tooltip">
        <slot name="tooltip" v-bind="activeBar">
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
@import '../styles/lib';

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

    &__placeholder {
      opacity: 0;

      .column-chart--stripped &,
      .column-chart--hover .column-chart__columns__item:hover & {
        opacity: var(--placeholder-opacity);
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
