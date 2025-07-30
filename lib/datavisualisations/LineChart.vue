<script lang="ts">
import * as d3 from 'd3'
import isFunction from 'lodash/isFunction'
import identity from 'lodash/identity'
import { chartProps, getChartProps, useChart } from '@/composables/useChart'
import {
  computed,
  ref,
  defineComponent,
  watchEffect,
  ComponentPublicInstance,
  toRaw
} from 'vue'

// Call the first argument if it's a function, or return it
const castCall = (fnOrValue = identity, ...rest) =>
  isFunction(fnOrValue) ? fnOrValue(...rest) : fnOrValue

export default defineComponent({
  name: 'LineChart',
  props: {
    /**
     * Color of the line (uses the CSS variable --line-color by default)
     */
    lineColor: {
      type: String,
      default: null
    },
    /**
     * Enforce a width for each column's label
     */
    fixedLabelWidth: {
      type: Number,
      default: null
    },
    /**
     * Enforce the height of the chart (regardless of the width or the social mode)
     */
    fixedHeight: {
      type: Number,
      default: null
    },
    /**
     * Name of the series (to get the value from in the data collection objects)
     */
    seriesName: {
      type: String,
      default: 'value'
    },
    /**
     * Argument for x-axis ticks
     * @see https://github.com/d3/d3-axis#axis_ticks
     */
    xAxisTicks: {
      type: [Object, Number, Function],
      default: null
    },
    /**
     * Function to apply to format y-axis ticks (line value). It can be a
     * function returning the formatted value or a d3's formatter string.
     */
    yAxisTickFormat: {
      type: [Function, String],
      default: () => identity
    },
    /**
     * Argument for y-axis ticks
     * @see https://github.com/d3/d3-axis#axis_ticks
     */
    yAxisTicks: {
      type: [Object, Number, Function],
      default: 5
    },
    /**
     * Key to use for timeseries
     */
    timeseriesKey: {
      type: String,
      default: 'date'
    },
    ...chartProps()
  },
  setup(props, { emit }) {
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
      return loadedData.value.map((d) => {
        // toRaw prevent modifying the Proxy object created with the props.data
        let rawD = toRaw(d)
        rawD[props.timeseriesKey] = parseTime(d[props.timeseriesKey])
        rawD[props.seriesName] = +d[props.seriesName]
        return rawD
      })
    })
    const createLine = d3
      .line()
      .x(d => d.x)
      .y(d => d.y)

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
        d3.extent(formattedData.value, d => d[props.timeseriesKey])
      )
      scale.value.y.domain([
        0,
        d3.max(formattedData.value, d => d[props.seriesName])
      ])

      const points = formattedData.value.map((d) => {
        return {
          x: scale.value.x(d[props.timeseriesKey]),
          y: scale.value.y(d[props.seriesName])
        }
      })

      line.value = createLine(points)
      d3.select(el.value)
        .select('.line-chart__axis--x')
        .call(
          d3
            .axisBottom(scale.value.x)
            .ticks(props.xAxisTicks)
            .tickFormat(d => castCall(xAxisYearFormat, d.getFullYear()))
        )
      d3.select(el.value)
        .select('.line-chart__axis--y')
        .call(
          d3
            .axisLeft(scale.value.y)
            .tickFormat(d => d3Formatter(d, props.yAxisTickFormat))
            .ticks(props.yAxisTicks)
        )
        .selectAll('.tick line')
        .attr('x2', padded.value.width)
    }

    watchEffect(() => {
      update()
    })
    return {
      el,
      width,
      height,
      margin,
      padded,
      line
    }
  }
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
