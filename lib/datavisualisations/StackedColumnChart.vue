

<script lang="ts">
// import { VBTooltip } from 'bootstrap-vue/esm/directives/tooltip/tooltip'
import * as d3 from 'd3'
import keys from 'lodash/keys'
import find from 'lodash/find'
import get from 'lodash/get'
import identity from 'lodash/identity'
import sortBy from 'lodash/sortBy'
import without from 'lodash/without'
import {ComponentPublicInstance, computed, defineComponent, ref, nextTick, watch} from 'vue'
import {chartProps, getChartProps, useChart} from "@/composables/chart.js";

export default defineComponent({
  name: 'StackedColumnChart',
  // directives: {
  //   'b-tooltip': VBTooltip
  // },
  //mixins: [chart],
  props: {
    /**
     * Field of each object containing data (for each group)
     */
    keys: {
      type: Array,
      default: () => []
    },
    /**
     * Group name to display in the legend
     */
    groups: {
      type: Array,
      default: () => []
    },
    /**
     * Colors of each bar group
     */
    barColors: {
      type: Array,
      default: () => []
    },
    /**
     * Max with of each bar.
     */
    barMaxWidth: {
      type: String,
      default: '100%'
    },
    /**
     * Hide bars that have no values.
     */
    hideEmptyValues: {
      type: Boolean
    },
    /**
     * Hide the legend.
     */
    hideLegend: {
      type: Boolean
    },
    /**
     * Enforce the height of the chart (regardless of the width or number of row)
     */
    fixedHeight: {
      type: Number,
      default: null
    },
    /**
     * Function to apply to format x axis ticks
     */
    xAxisTickFormat: {
      type: [Function, String],
      default: ()=>identity
    },
    /**
     * Function to apply to format y axis ticks (bars value). It can be a
     * function returning the formatted value or a d3's formatter string.
     */
    yAxisTickFormat: {
      type: [Function, String],
      default: ()=>identity
    },
    /**
     * Padding on y axis ticks
     */
    yAxisTickPadding: {
      type: Number,
      default: 10
    },
    /**
     * Field containing the label for each column
     */
    labelField: {
      type: String,
      default: 'date'
    },
    /**
     * Sort groups by one or several keys.
     */
    sortBy: {
      type: [Array, String],
      default: null
    },
    /**
     * Column height is relative to each group's total
     */
    relative: {
      type: Boolean,
      default: false
    },
    /**
     * A list of highlighted groups
     */
    highlights: {
      type: Array,
      default: () => []
    },
    /**
     * Delay to apply when set the first highlight
     */
    highlightDelay: {
      type: Number,
      default: 400
    },
    /**
     * A list of entire column to highlight
     */
    columnHighlights: {
      type: Array,
      default: () => []
    },
    /**
     * Delay to apply when restoring highlights to initial state
     */
    restoreHighlightDelay: {
      type: Number,
      default: 50
    },
    /**
     * Deactivate direct labeling on bars
     */
    noDirectLabeling: {
      type: Boolean
    },
    /**
     * Set max value instead of extracting it from the data.
     */
    maxValue: {
      type: Number,
      default: null
    },
    /**
      * Function to define tooltip content.
     */
    tooltipDisplay: {
      type: Function,
      default:  ({ formattedKey, formattedValue }:{formattedKey:string, formattedValue:string}):string => {
        return `<h6 class="mb-0">${formattedKey}</h6><div>${formattedValue}</div>`
      }
    },
    /**
     * Hide bar tooltips
     */
    noTooltips: {
      type: Boolean
    },
    ...chartProps()
  },
  setup(props,{emit}){
    const width = ref(0)
    const height = ref(0)
    const leftAxisHeight = ref(0)
    const highlightedKeys = ref(props.highlights)
    const highlightTimeout = ref<NodeJS.Timeout | undefined>(undefined)
    const isLoaded = ref(false)
    const el = ref<ComponentPublicInstance<HTMLElement> | null>(null)

    const {
      elementsMaxBBox,
      baseHeightRatio,
      loadedData,
      d3Formatter,
      dataHasHighlights
    } = useChart(el, getChartProps(props), {emit}, isLoaded, setSizes)
    const sortedData = computed(() => {
      if (!isLoaded.value) {
        return []
      }
      return !props.sortBy ? loadedData.value : sortBy(loadedData.value, props.sortBy)
    })

    const discoveredKeys = computed((): any[] => {
      if (props.keys.length) {
        return props.keys
      }
      if (!loadedData.value) {
        return []
      }
      return without(keys(loadedData.value[0]), props.labelField)
    })
    const colorScale = computed(() => {
      return d3.scaleOrdinal().domain(discoveredKeys.value).range(props.barColors)
    })

    const hasHighlights = computed(() => {
      return !!highlightedKeys.value.length
    })

// different

    const hasColumnHighlights= computed(() => {
      return !!props.columnHighlights.length
    })
    const leftScale= computed(() =>{
      return d3.scaleLinear().domain([0, maxRowValue.value]).range([leftAxisHeight.value, 0])
    })

    const leftAxis= computed(() =>{
        return d3
            .axisLeft(leftScale.value)
            .tickFormat((d) => d3Formatter(d, props.yAxisTickFormat))
            .tickSize(width.value - leftAxisLabelsWidth.value)
            .tickPadding(props.yAxisTickPadding)
    }/*, {cache: false}*/)
    const leftAxisLabelsWidth= computed(() => {
        const selector = '.stacked-column-chart__left-axis__canvas .tick text'
        const defaultWidth = 0
        return elementsMaxBBox({ selector, defaultWidth }).width + props.yAxisTickPadding
    }/*, {cache: false}*/)

    const leftAxisCanvas= computed(() => {
      return d3.select(el.value).select('.stacked-column-chart__left-axis__canvas')
    })
    const paddedStyle= computed(() => {
      return {
        marginLeft: props.noDirectLabeling ? `${leftAxisLabelsWidth.value + props.yAxisTickPadding}px` : 0
      }
    })
    const barTooltipDelay = computed(() => {
      return hasHighlights.value ? 0 : props.highlightDelay
    })
    const maxRowValue = computed(() => {
      return (
          props.maxValue ||
          d3.max(loadedData.value || [], (datum, i) => {
            return totalRowValue(i)
          }) as number
      )
    })

    function  setSizes() {
      if(!el.value ){
        return
      }
      width.value = el.value.offsetWidth
      height.value = props.fixedHeight !== null ? props.fixedHeight : width.value * baseHeightRatio.value
    }
    function groupName(key:string) {
      const index = discoveredKeys.value.indexOf(key)
      return props.groups[index] || key
    }

    function highlight(key:string) {
      highlightedKeys.value = [key]
    }

    function restoreHighlights() {
      clearTimeout(highlightTimeout.value)
      const delay = props.restoreHighlightDelay
      // Delay the restoration so it can be cancelled by a new highlight
      highlightTimeout.value = setTimeout(() => (highlightedKeys.value = props.highlights), delay)
    }

    function delayHighlight(key:string) {
      clearTimeout(highlightTimeout.value)
      // Reduce the delay to zero if there is already an highlighted key
      const isDelayed = !hasHighlights.value
      const delay = isDelayed ? props.highlightDelay : 0
      highlightTimeout.value = setTimeout(() => highlight(key), delay)
    }

    function isHighlighted(key:string) {
      return highlightedKeys.value.indexOf(key) > -1
    }

    function isColumnHighlighted(i:string|number) {
      const column = get(sortedData.value, [i, props.labelField], null)
      return props.columnHighlights.includes(column) && !highlightedKeys.value.length
    }

    function totalRowValue(i:string|number) {
      return d3.sum(discoveredKeys.value, (key:string) => {
        return sortedData.value[i][key]
      })
    }

    function barStyle(i:string|number, key:string) {
      const value = sortedData.value[i][key]
      let totalWidth = props.relative ? totalRowValue(i) : maxRowValue.value
      if(!totalWidth){
          console.error("totalWidth as divider cannot be "+totalWidth)
          totalWidth = 100
      }
      const height = `${100 * (value / totalWidth)}%`
      const backgroundColor = colorScale.value(key)
      const maxWidth = props.barMaxWidth
      return { maxWidth, height, backgroundColor }
    }

    function barTitle(i:string|number, key:string) {
      const value = sortedData.value[i][key]
      const formattedValue = d3Formatter(value, props.yAxisTickFormat)
      const formattedKey = groupName(key)
      return props.tooltipDisplay({ value, formattedValue, key, formattedKey })
    }

    async function stackBarAndValue(i:string|number) {
      if (!sortedData.value) {
        return []
      }
      await nextTick()

      // Collect sizes first
      const stack = discoveredKeys.value.map((key:string) => {
        const { bar, row, value } = queryBarAndValue(i as number, key)
        if(!bar || !row || !value){
          throw new Error("Empty values for bar, row or value")
        }
        const barEdge = bar.getBoundingClientRect().top + bar.offsetHeight
        const barHeight = bar.offsetHeight
        const rowEdge = row.getBoundingClientRect().top + row.offsetHeight
        const valueHeight = value.offsetHeight
        return { key, barEdge, barHeight, rowEdge, valueHeight, overflow:false, pushed:false }
      })
      // Infer value's display
      return stack.map((desc, index) => {
        desc.overflow = desc.valueHeight >= desc.barHeight
        if (index > 0) {
          const prevDesc = stack[index - 1]
          const bothValuesHeight = desc.valueHeight + prevDesc.valueHeight
          desc.overflow = desc.overflow || (prevDesc.overflow && desc.barHeight < bothValuesHeight)
        }
        desc.pushed = desc.barEdge + desc.valueHeight > desc.rowEdge && desc.overflow
        return desc
      })
    }

    function queryBarAndValue(i:number, key:string) {
      if (!sortedData.value) {
        return {}
      }
      const rowSelector = '.stacked-column-chart__groups__item'
      const row = el.value?.querySelectorAll(rowSelector)[i]  as HTMLElement
      const barSelector = `.stacked-column-chart__groups__item__bars__item--${key}`
      const bar = row.querySelector(barSelector) as HTMLElement
      const valueSelector = '.stacked-column-chart__groups__item__bars__item__value'
      const value = bar.querySelector(valueSelector)  as HTMLElement
      return { bar, row, value }
    }

    function isHidden(i:string|number, key:string) {
      return props.hideEmptyValues && !sortedData.value[i][key]
    }

    function hasValueOverflow(i:string|number, key:string) {
      const stack = stackBarAndValue(i)
      return find(stack, { key })?.overflow
    }

    function hasValuePushed(i:string|number, key:string) {
      const stack = stackBarAndValue(i)
      return find(stack, { key })?.pushed
    }

    function hasValueHidden(i:string|number, key:string) {
      const keyIndex = discoveredKeys.value.indexOf(key)
      const nextKey = discoveredKeys.value[keyIndex + 1]
      if (!nextKey) {
        return false
      }
      return hasValueOverflow(i, key) && hasValueOverflow(i, nextKey)
    }
    function formatXDatum(d: string) {
      return d3Formatter(d, props.yAxisTickFormat)
    }
    function formatYDatum(d: string) {
      return d3Formatter(d, props.yAxisTickFormat)
    }
    watch(() => props.highlights, (newHighlights) => {
      highlightedKeys.value = newHighlights
    })
    watch(sortedData, async (newVal)=>{
        await nextTick()
        // This must be set after the column have been rendered
        const element = el.value?.querySelector('.stacked-column-chart__groups__item__bars')
        leftAxisHeight.value = (element as HTMLElement).offsetHeight
        //@ts-ignore
        leftAxisCanvas.value.call(leftAxis.value)
    })

    return {
      barTooltipDelay,
      colorScale,
      dataHasHighlights,
      discoveredKeys,
      el,
      hasColumnHighlights,
      hasHighlights,
      height,
      loadedData,
      paddedStyle,
      sortedData,
      width,
      barTitle,
      barStyle,
      delayHighlight,
      formatXDatum,
      formatYDatum,
      groupName,
      hasValueHidden,
      hasValueOverflow,
      hasValuePushed,
      isColumnHighlighted,
      isHidden,
      isHighlighted,
      restoreHighlights
    }
  }

})
</script>
<template>
  <div
      ref="el"
      :style="{ height: `${height}px` }"
      class="stacked-column-chart d-flex flex-column"
      :class="{
      'stacked-column-chart--social-mode': socialMode,
      'stacked-column-chart--has-highlights': hasHighlights || hasColumnHighlights,
      'stacked-column-chart--no-direct-labeling': noDirectLabeling
    }"
  >
    <ul v-if="!hideLegend" class="stacked-column-chart__legend list-inline">
      <li
          v-for="key in discoveredKeys"
          :key="key"
          class="stacked-column-chart__legend__item list-inline-item d-inline-flex"
          :class="{
          'stacked-column-chart__legend__item--highlighted': isHighlighted(key)
        }"
          @mouseover="delayHighlight(key)"
          @mouseleave="restoreHighlights()"
      >
        <span class="stacked-column-chart__legend__item__box" :style="{ 'background-color': colorScale(key) }" />
        {{ groupName(key) }}
      </li>
    </ul>
    <div class="d-flex flex-grow-1 position-relative overflow-hidden">
      <svg
          v-show="noDirectLabeling"
          :width="width + 'px'"
          :height="height + 'px'"
          class="stacked-column-chart__left-axis"
      >
        <g class="stacked-column-chart__left-axis__canvas" :transform="`translate(${width}, 0)`" />
      </svg>
      <div class="stacked-column-chart__groups d-flex flex-grow-1" :style="paddedStyle">
        <div
            v-for="(datum, i) in sortedData"
            :key="i"
            class="stacked-column-chart__groups__item flex-grow-1 d-flex flex-column text-center"
        >
          <div
              class="stacked-column-chart__groups__item__bars flex-grow-1 d-flex flex-column-reverse px-1 justify-content-start align-items-center"
          >
            <div
                v-for="(key, j) in discoveredKeys"
                :key="j"
                v-b-tooltip.html="{ delay: barTooltipDelay, disabled: noTooltips, title: barTitle(i, key) }"
                :style="barStyle(i, key)"
                class="stacked-column-chart__groups__item__bars__item"
                :class="{
                [`stacked-column-chart__groups__item__bars__item--${key}`]: true,
                [`stacked-column-chart__groups__item__bars__item--${j}n`]: true,
                'stacked-column-chart__groups__item__bars__item--hidden': isHidden(i, key),
                'stacked-column-chart__groups__item__bars__item--highlighted':
                  isHighlighted(key) || isColumnHighlighted(i),
                'stacked-column-chart__groups__item__bars__item--value-overflow': hasValueOverflow(i, key),
                'stacked-column-chart__groups__item__bars__item--value-pushed': hasValuePushed(i, key),
                'stacked-column-chart__groups__item__bars__item--value-hidden': hasValueHidden(i, key)
              }"
                @mouseover="delayHighlight(key)"
                @mouseleave="restoreHighlights()"
            >
              <div v-show="!noDirectLabeling" class="stacked-column-chart__groups__item__bars__item__value">
                {{ formatYDatum(datum[key]) }}
              </div>
            </div>
          </div>
          <div class="stacked-column-chart__groups__item__label small py-2">
            {{ formatXDatum(datum[labelField]) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@use 'sass:math';
@import '../styles/lib';

.stacked-column-chart {
  $muted-group-opacity: 0.2;
  $muted-group-filter: grayscale(30%) brightness(10%);
  $muted-group-transition: opacity 0.3s, filter 0.3s;
  $colors: $primary, $info, $warning;
  $quantile: 3;

  @each $start-color in $colors {
    $i: index($colors, $start-color) - 1;
    $end-color: mix($start-color, text-contrast($start-color), 20%);

    @for $j from ($quantile * $i) through ($quantile * $i + $quantile - 1) {
      $amount: ($j % $quantile) * math.div(100%, $quantile);
      --group-color-#{$j}n: #{mix($end-color, $start-color, $amount)};
    }
  }

  &__legend {
    &__item {
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      padding-right: $spacer * 0.5;

      @for $i from 0 through ($quantile * length($colors)) {
        &:nth-child(#{$i + 1}n) &__box {
          background-color: var(--group-color-#{$i}n);
        }
      }

      .stacked-column-chart--has-highlights &:not(&--highlighted) {
        opacity: $muted-group-opacity;
        filter: $muted-group-filter;
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

  &__left-axis {
    position: absolute;
    top: 0;
    left: 0;

    path {
      display: none;
    }

    .tick {
      line {
        stroke: $border-color;
      }

      text {
        font-family: $font-family-base;
        font-size: $font-size-sm;
        fill: currentColor;
      }
    }
  }

  &__groups {
    &__item {
      &__bars {
        &__item {
          width: 100%;
          position: relative;
          min-height: 1px;

          @for $i from 0 through ($quantile * length($colors)) {
            &--#{$i}n {
              background: var(--group-color-#{$i}n);
            }
          }

          &__value {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            text-align: center;
            white-space: nowrap;
            color: #fff;
          }

          .stacked-column-chart--has-highlights &:not(&--highlighted) {
            opacity: $muted-group-opacity;
            filter: $muted-group-filter;
          }

          .stacked-column-chart--has-highlights &:not(&--highlighted) &__value {
            visibility: hidden;
          }

          .stacked-column-chart:not(.stacked-column-chart--has-highlights) &--value-hidden &__value,
          .stacked-column-chart:not(.stacked-column-chart--has-highlights) &--value-pushed &__value {
            visibility: hidden;
          }

          &--hidden {
            display: none;
          }

          &--value-overflow &__value {
            color: $body-color;
            transform: translateY(-100%);
          }

          &--value-pushed {
            direction: ltr;
          }

          &--value-pushed &__value {
            color: $body-color;
            transform: translateY(100%);
          }
        }
      }
    }
  }
}
</style>
