

<script>
import * as d3 from 'd3'
import identity from 'lodash/identity'
import sortBy from 'lodash/sortBy'
import {defineComponent, computed, ref, watch, ComponentPublicInstance} from "vue"
import {chartProps, getChartProps, useChart} from "@/composables/chart.ts";


export default defineComponent({
  name: 'BarChart',
  //mixins: [chart],
  props: {
    /**
     * Height of each bar
     */
    barHeight: {
      type: Number,
      default: 30
    },
    /**
     * Distance between each bar
     */
    barGap: {
      type: Number,
      default: 15
    },
    /**
     * Color of each bar (uses the CSS variable --bar-color by default)
     */
    barColor: {
      type: String,
      default: null
    },
    /**
     * Color of each highlighted bar (uses the CSS variable --bar-highlight-color by default)
     */
    barHighlightColor: {
      type: String,
      default: null
    },
    /**
     * Enforce a width for each bar's label
     */
    fixedLabelWidth: {
      type: Number,
      default: null
    },
    /**
     * Enforce a width for each bar's value
     */
    fixedValueWidth: {
      type: Number,
      default: null
    },
    /**
     * Distance between a bar and its label
     */
    labelGap: {
      type: Number,
      default: 10
    },
    /**
     * Distande between a bar and its value
     */
    valueGap: {
      type: Number,
      default: 5
    },
    /**
     * Sort bars by one or several keys.
     */
    sortBy: {
      type: [Array, String],
      default: null
    },
    /**
     * Function to apply to format x axis ticks (bar value). It can be a
     * function returning the formatted value or a d3's formatter string.
     */
    xAxisTickFormat: {
      type: [Function, String],
      default: ()=>identity
    },
    ...chartProps()
  },
  emits:["loaded","resized"],
  setup(props,{emit}){
    const el = ref(null)
    const width=ref(0)
    const isLoaded = ref(false)
    const {loadedData, elementsMaxBBox,dataHasHighlights,d3Formatter}=useChart(el,getChartProps(props),{emit},isLoaded,onResize,null)
    // onMounted(() => {
    //   window.addEventListener('resize', onResize)
    //   onResize()
    // })
    // beforeUnmount(()=> {
    //   window.removeEventListener('resize', onResize)
    // })

    const sortedData = computed(() => {
      if (!loadedData.value) {
        return []
      }
      return !props.sortBy ? loadedData.value : sortBy(sortedData.value, props.sortBy)
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
      const widthP = width.value - margin.left - margin.right
      const heightP = height.value - margin.top - margin.bottom
      return { width:widthP, height:heightP }
    })
    const scale = computed(() => {
      const x = d3
          .scaleLinear()
          .domain([0, d3.max(sortedData.value, (d) => d.value)])
          .range([0, padded.value.width - valueWidth.value])
      return { x }
    })
    const bars = computed(() => {
      return sortedData.value.map((d, i) => {
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
      return sortedData.value.map((d, i) => {
        return {
          label: d.label,
          x: labelWidth.value,
          y: 4 + props.barHeight / 2 + (props.barHeight + props.barGap) * i
        }
      })
    })
    const height = computed(() => {
          return (props.barHeight + props.barGap) * sortedData.value.length
        }
    )

    function formatXDatum(d){
      return d3Formatter(d,props.xAxisTickFormat)
    }
    function onResize() {
      if(el.value){
        width.value = el.value.offsetWidth
      }
    }
    function initialize() {
      d3.axisBottom().scale(scale.value.x)
    }

    watch(width,()=> {
      initialize()
    })

    return {
      el,
      dataHasHighlights,
      width,
      height,
      margin,
      labels,
      bars,
      formatXDatum
    }
  }
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
    <svg :width="width" :height="height">
      <g :style="{ transform: `translate(0, ${margin.top}px)` }" class="bar-chart__labels">
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
      <g :style="{ transform: `translate(${margin.left}px, ${margin.top}px)` }" class="bar-chart__bars">
        <g
            v-for="(bar, i) in bars"
            :key="i"
            class="bar-chart__bars__item"
            :class="{ 'bar-chart__bars__item--highlight': bar.highlight }"
        >
          <rect :width="bar.width" :height="bar.height" :x="bar.x" :y="bar.y" />
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
@import '../styles/lib';

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
