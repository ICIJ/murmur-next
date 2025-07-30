<script lang="ts">
import type { Timeout } from 'node:timers'
import * as d3 from 'd3'
import find from 'lodash/find'
import get from 'lodash/get'
import identity from 'lodash/identity'
import kebabCase from 'lodash/kebabCase'
import keys from 'lodash/keys'
import without from 'lodash/without'
import sortBy from 'lodash/sortBy'
import { ComponentPublicInstance, computed, defineComponent, PropType, ref, watch } from 'vue'
import { chartProps, getChartProps, useChart } from '@/composables/useChart'
import { useQueryObserver } from '@/composables/useQueryObserver'
import { isArray } from 'lodash'

export default defineComponent({
  name: 'StackedBarChart',
  props: {
    /**
     * Colors of each bar group
     */
    barColors: {
      type: Array,
      default: () => []
    },
    /**
     * Enforce the height of the chart (regardless of the width or number of row)
     */
    fixedHeight: {
      type: Number as PropType<number | null>,
      default: null
    },
    /**
     * Group name to display in the legend
     */
    groups: {
      type: Array,
      default: () => []
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
     * Field of each object containing data (for each group)
     */
    keys: {
      type: Array,
      default: () => []
    },
    /**
     * Switch labels above bars
     */
    labelAbove: {
      type: Boolean,
      default: false
    },
    /**
     * Field containing the label for each row
     */
    labelField: {
      type: String,
      default: 'label'
    },
    /**
     * Set a minimal height for the bars
     */
    minBarHeight: {
      type: Number,
      default: 16
    },
    /**
     * Set a maximal height for the bars
     */
    maxBarHeight: {
      type: Number,
      default: 60
    },
    /**
     * Bar width is relative to each group's total
     */
    relative: {
      type: Boolean,
      default: false
    },
    /**
     * Delay to apply when restoring hightlights to initial state
     */
    restoreHighlightDelay: {
      type: Number,
      default: 50
    },
    /**
     * A list of entire row to highlight
     */
    rowHighlights: {
      type: Array,
      default: () => []
    },
    /**
     * Sort groups by one or several keys.
     */
    sortBy: {
      type: [Array, String],
      default: null
    },
    /**
     * Function to apply to format x-axis ticks (bar value). It can be a
     * function returning the formatted value or a d3's formatter string.
     */
    xAxisTickFormat: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      type: [Function, String] as PropType<Function | string>,
      default: () => identity
    },
    ...chartProps()
  },
  setup(props, { emit }) {
    const highlightedKeys = ref(props.highlights)
    const highlightTimeout = ref<Timeout | undefined>(undefined)
    const isLoaded = ref(false)
    const el = ref<ComponentPublicInstance<HTMLElement> | null>(null)
    const {
      loadedData,
      mounted,
      baseHeightRatio,
      d3Formatter,
      dataHasHighlights
    } = useChart(el, getChartProps(props), { emit }, isLoaded)
    const { querySelectorAll } = useQueryObserver(el.value)

    const hasConstraintHeight = computed(() => {
      return props.fixedHeight !== null || props.socialMode
    })

    const sortedData = computed(() => {
      if (!isLoaded.value) {
        return []
      }
      return !props.sortBy
        ? loadedData.value
        : sortBy(loadedData.value, props.sortBy)
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
      return d3
        .scaleOrdinal()
        .domain(discoveredKeys.value)
        .range(props.barColors)
    })

    const maxValue = computed(() => {
      return d3.max(loadedData.value || [], (datum, i) => {
        return totalRowValue(i)
      })
    })

    const hasHighlights = computed(() => {
      return !!highlightedKeys.value.length
    })

    const hasRowHighlights = computed(() => {
      return !!props.rowHighlights.length
    })

    const hasAnyHighlights = computed(() => {
      return hasHighlights.value || hasRowHighlights.value || dataHasHighlights.value
    })

    const height = computed(() => {
      if (props.fixedHeight !== null) {
        return `${props.fixedHeight}px`
      }
      return props.socialMode && mounted.value && el.value
        ? `${el.value.offsetWidth * baseHeightRatio.value}px`
        : 'auto'
    })

    function normalizeKey(key: string) {
      return kebabCase(key)
    }

    function totalRowValue(i: number | string) {
      return d3.sum(discoveredKeys.value, (key) => {
        return sortedData.value[i][key]
      })
    }

    function groupName(key: string) {
      const index = discoveredKeys.value.indexOf(key)
      return props.groups[index] || key
    }

    function highlight(key: string) {
      highlightedKeys.value = [key]
    }

    function restoreHighlights() {
      clearTimeout(highlightTimeout.value)
      const delay = props.restoreHighlightDelay
      // Delay the restoration so it can be cancelled by a new highlight
      highlightTimeout.value = setTimeout(
        () => (highlightedKeys.value = props.highlights),
        delay
      )
    }

    function delayHighlight(key: string) {
      clearTimeout(highlightTimeout.value)
      // Reduce the delay to zero if there is already a highlighted key
      const isDelayed = !hasHighlights.value
      const delay = isDelayed ? props.highlightDelay : 0
      highlightTimeout.value = setTimeout(() => highlight(key), delay)
    }

    function isHighlighted(key: string) {
      return highlightedKeys.value.indexOf(key) > -1
    }

    function isRowHighlighted(i: number | string) {
      const row = get(sortedData.value, [i, props.labelField], null)
      return (
        isArray(props.rowHighlights)
        && props.rowHighlights?.includes(row)
        && !highlightedKeys.value.length
      )
    }

    function barStyle(i: number | string, key: string) {
      const value = sortedData.value[i][key]
      const totalWidth = props.relative ? totalRowValue(i) : maxValue.value
      if (!totalWidth) {
        throw new Error('Total width is not correct' + totalWidth)
      }
      const width = `${100 * (value / totalWidth)}%`
      const backgroundColor = colorScale.value(key)
      return { width, backgroundColor }
    }

    function stackBarAndValue(i: number | string) {
      if (!mounted.value) {
        return []
      }
      // Collect sizes first
      const stack = discoveredKeys.value.map((key: string) => {
        const { bar, row, value } = queryBarAndValue(i as number, key)
        if (!bar || !row || !value) {
          throw new Error('Values not retrieved')
        }
        const barEdge = bar.getBoundingClientRect().left + bar.offsetWidth
        const barWidth = bar.offsetWidth
        const rowEdge = row.getBoundingClientRect().left + row.offsetWidth
        const valueWidth = value.offsetWidth
        const overflow = false
        const pushed = false
        return { key, barEdge, barWidth, rowEdge, valueWidth, overflow, pushed }
      })
      // Infer value's display
      return stack.map((desc, index) => {
        // Value must be visible out of the bar (overflow) if the size of the value label is bigger than the bar
        desc.overflow = desc.valueWidth >= desc.barWidth
        // If the value not out of the bar, we must ensure its predecesor isn't.
        if (!desc.overflow && index > 0) {
          const prevDesc = stack[index - 1]
          const bothValuesWidth = desc.valueWidth + prevDesc.valueWidth
          desc.overflow = prevDesc.overflow && desc.barWidth < bothValuesWidth
        }
        // Value must be pushed to the other side (left) if the value label is outside the bar (overflow)
        // and if the size of the value label isn't fitting in the row
        desc.pushed = desc.overflow && desc.barEdge + desc.valueWidth > desc.rowEdge
        return desc
      })
    }

    function queryBarAndValue(i: number, key: string) {
      if (!mounted.value) {
        return {}
      }
      const barClass = 'stacked-bar-chart__groups__item__bars__item'
      const rowSelector = '.stacked-bar-chart__groups__item'
      const row = querySelectorAll(rowSelector)[i] as HTMLElement
      const normalizedKey = normalizeKey(key)
      const barSelector = `.${barClass}--${normalizedKey}`
      const bar = row?.querySelector(barSelector) as HTMLElement
      const valueSelector = `.${barClass}__value`
      const value = bar?.querySelector(valueSelector) as HTMLElement
      return { bar, row, value }
    }

    function hasValueOverflow(i: number | string, key: string) {
      try {
        const stack = stackBarAndValue(i)
        return find(stack, { key })?.overflow
      }
      catch {
        return false
      }
    }

    function hasValuePushed(i: number | string, key: string) {
      try {
        const stack = stackBarAndValue(i)
        return find(stack, { key })?.pushed
      }
      catch {
        return false
      }
    }

    function hasValueHidden(i: number | string, key: string) {
      const keyIndex = discoveredKeys.value.indexOf(key)
      const nextKey = discoveredKeys.value[keyIndex + 1]
      if (!nextKey) {
        return false
      }
      const keyC = hasValueOverflow(i, key)
      const keyN = hasValueOverflow(i, nextKey)
      return keyC && keyN
    }

    function isHidden(i: number | string, key: string) {
      return props.hideEmptyValues && !sortedData.value[i][key]
    }

    function formatXDatum(d: string) {
      return d3Formatter(d, props.xAxisTickFormat)
    }

    watch(() => props.highlights, (newHighlights) => {
      highlightedKeys.value = newHighlights
    })

    return {
      colorScale,
      discoveredKeys,
      el,
      hasConstraintHeight,
      hasAnyHighlights,
      height,
      sortedData,
      barStyle,
      delayHighlight,
      formatXDatum,
      groupName,
      hasValueHidden,
      hasValueOverflow,
      hasValuePushed,
      isHidden,
      isHighlighted,
      isRowHighlighted,
      loadedData,
      normalizeKey,
      restoreHighlights
    }
  }
})
</script>
<template>
  <div
    ref="el"
    :class="{
      'stacked-bar-chart--social-mode': socialMode,
      'stacked-bar-chart--label-above': labelAbove,
      'stacked-bar-chart--has-highlights': hasAnyHighlights,
      'stacked-bar-chart--has-constraint-height': hasConstraintHeight,
      'stacked-bar-chart--has-label-above': labelAbove
    }"
    :style="{ height }"
    class="stacked-bar-chart d-flex flex-column"
  >
    <div class="d-flex align-items-center">
      <slot name="header-left">
        <ul
          v-if="!hideLegend"
          class="stacked-bar-chart__legend list-inline mx-0 mt-0 mb-2"
        >
          <li
            v-for="key in discoveredKeys"
            :key="key"
            :class="{
              'stacked-bar-chart__legend__item--highlighted': isHighlighted(key)
            }"
            class="stacked-bar-chart__legend__item list-inline-item d-inline-flex"
            @mouseleave="restoreHighlights()"
            @mouseover="delayHighlight(key)"
          >
            <span
              :style="{ 'background-color': colorScale(key) }"
              class="stacked-bar-chart__legend__item__box"
            />
            {{ groupName(key) }}
          </li>
        </ul>
      </slot>
      <slot name="header-right" />
    </div>
    <div class="stacked-bar-chart__groups">
      <div
        v-for="(datum, i) in sortedData"
        :key="i"
        :class="{ 'flex-column': labelAbove, }"
        class="stacked-bar-chart__groups__item border-bottom flex-fill d-flex align-items-center"
      >
        <div
          :class="{ 'w-100': labelAbove }"
          class="stacked-bar-chart__groups__item__label me-1 small"
        >
          {{ datum[labelField] }}
        </div>
        <div
          class="stacked-bar-chart__groups__item__bars my-1 d-flex flex-grow-1 align-items-center"
        >
          <div
            v-for="(key, j) in discoveredKeys"
            :key="j"
            :class="{
              [`stacked-bar-chart__groups__item__bars__item--${normalizeKey(key)}`]: true,
              [`stacked-bar-chart__groups__item__bars__item--${j}n`]: true,
              'stacked-bar-chart__groups__item__bars__item--highlighted': isHighlighted(key) || isRowHighlighted(i),
              'stacked-bar-chart__groups__item__bars__item--hidden': isHidden(i, key),
              'stacked-bar-chart__groups__item__bars__item--value-overflow': hasValueOverflow(i, key),
              'stacked-bar-chart__groups__item__bars__item--value-pushed': hasValuePushed(i, key),
              'stacked-bar-chart__groups__item__bars__item--value-hidden': hasValueHidden(i, key)
            }"
            :style="barStyle(i, key)"
            class="stacked-bar-chart__groups__item__bars__item"
            @mouseleave="restoreHighlights()"
            @mouseover="delayHighlight(key)"
          >
            <div class="stacked-bar-chart__groups__item__bars__item__value p-1">
              {{ formatXDatum(datum[key]) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">

.stacked-bar-chart {
  $muted-group-opacity: 0.2;
  $muted-group-filter: grayscale(30%) brightness(10%);
  $muted-group-transition:
    opacity 0.3s,
    filter 0.3s;
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
      transition: $muted-group-transition;

      @for $i from 0 through ($quantile * length($colors)) {
        &:nth-child(#{$i + 1}n) &__box {
          background-color: var(--group-color-#{$i}n);
        }
      }

      .stacked-bar-chart--has-highlights &:not(&--highlighted) {
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

  &__groups {
    .stacked-bar-chart--has-constraint-height & {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    &__item {
      &__label {
        width: 20%;
        padding: $spacer * 0.5 0;

        .stacked-bar-chart--label-above & {
          width: 100%;
          padding-bottom: 0;
        }

        &:empty {
          display: none;
        }
      }

      &__bars {
        min-height: 100%;
        width: 100%;

        .stacked-bar-chart--has-constraint-height & {
          height: calc(100% - 1.5rem);
          min-height: calc(100% - 1.5rem);
        }

        .stacked-bar-chart--has-constraint-height.stacked-bar-chart--label-above
          & {
          height: auto;
          min-height: auto;
        }

        &__item {
          text-align: right;
          transition: $muted-group-transition;
          min-width: 1px;
          min-height: 10px;
          height: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;

          .stacked-bar-chart--has-constraint-height & {
            height: auto;
            align-self: stretch;
          }

          &--hidden {
            display: none !important;
          }

          @for $i from 0 through ($quantile * length($colors)) {
            &--#{$i}n {
              background: var(--group-color-#{$i}n);
            }
          }

          .stacked-bar-chart--has-highlights &:not(&--highlighted) {
            opacity: $muted-group-opacity;
            filter: $muted-group-filter;
          }

          .stacked-bar-chart--has-highlights &:not(&--highlighted) &__value {
            visibility: hidden;
          }

          .stacked-bar-chart:not(.stacked-bar-chart--has-highlights)
            &--value-hidden
            &__value,
          .stacked-bar-chart:not(.stacked-bar-chart--has-highlights)
            &--value-pushed
            &__value {
            visibility: hidden;
          }

          &--value-overflow &__value {
            color: $body-color;
            transform: translateX(100%);
          }

          &--value-pushed {
            justify-content: flex-start;
          }

          &--value-pushed &__value {
            color: $body-color;
            transform: translateX(-100%);
          }

          &__value {
            white-space: nowrap;
            color: white;
            pointer-events: none;
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>
