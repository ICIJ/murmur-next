import * as d3 from 'd3'
import keysFn from 'lodash/keys'
import sortByFn from 'lodash/sortBy'
import without from 'lodash/without'
import { computed, toValue } from 'vue'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { LoadedData } from '@/composables/useChartData'

/**
 * Reactive inputs driving {@link useStackedChart}. They mirror the data and
 * stacking-related props shared by the `StackedBarChart` and
 * `StackedColumnChart` components, accepted as plain values, refs or getters so
 * the composable adapts to how each caller wires its state.
 */
export interface UseStackedChartOptions {
  /**
   * The chart's loaded data (inline array or fetched), as exposed by `useChart`.
   */
  loadedData: MaybeRefOrGetter<LoadedData>
  /**
   * Whether the data has finished loading. Until then `sortedData` is empty so
   * the chart never reads from half-loaded data.
   */
  isLoaded: MaybeRefOrGetter<boolean>
  /**
   * Field name(s) to sort the data by, or `null`/`undefined` to keep the
   * loaded order.
   */
  sortBy: MaybeRefOrGetter<string | string[] | null | undefined>
  /**
   * Explicit list of stacked segment keys. When empty, the keys are discovered
   * from the first datum (every field except the label field).
   */
  keys: MaybeRefOrGetter<string[]>
  /**
   * Field name in each datum holding the row label, excluded from the
   * discovered keys.
   */
  labelField: MaybeRefOrGetter<string>
  /**
   * Display names for each key, used by {@link UseStackedChart.groupName}. The
   * name at the key's index wins, falling back to the key itself.
   */
  groups: MaybeRefOrGetter<string[]>
  /**
   * Colors for each segment, mapped to the discovered keys by an ordinal scale.
   */
  barColors: MaybeRefOrGetter<string[]>
}

/**
 * Reactive API returned by {@link useStackedChart}.
 */
export interface UseStackedChart {
  /**
   * The loaded data, optionally sorted by the `sortBy` option, or an empty
   * array until the data has loaded.
   */
  sortedData: ComputedRef<any[]>
  /**
   * The stacked segment keys, either the explicit `keys` option or the fields
   * discovered from the first datum (minus the label field).
   */
  discoveredKeys: ComputedRef<string[]>
  /**
   * The ordinal scale mapping each key to its color.
   */
  colorScale: ComputedRef<(key: string) => string>
  /**
   * Sums every key's value for the row at the given index.
   */
  totalRowValue: (i: number | string) => number
  /**
   * The largest row total across the data, driving the relative bar sizing.
   */
  maxStackValue: ComputedRef<number | undefined>
  /**
   * The display name for a key: the matching `groups` entry, or the key itself.
   */
  groupName: (key: string) => string
}

/**
 * Owns the pure data logic shared by the `StackedBarChart` and
 * `StackedColumnChart` components: it sorts the data, discovers the stacked
 * keys, builds the ordinal color scale, sums each row and exposes the maximum
 * row total. It holds no DOM state — measurement, highlighting and the
 * width/height geometry stay in each component because they differ between the
 * horizontal and vertical layouts.
 *
 * @param options - Reactive stacking options (see {@link UseStackedChartOptions}).
 * @returns The {@link UseStackedChart} API of derived data.
 * @example
 * // Internal building block of the stacked chart components; not exported from
 * // the package root. Inside a `<script setup>` block:
 * import { toRef } from 'vue'
 * import { useStackedChart } from '@/composables/useStackedChart'
 *
 * const { sortedData, discoveredKeys, colorScale, totalRowValue } = useStackedChart({
 *   loadedData,
 *   isLoaded,
 *   sortBy: toRef(() => props.sortBy),
 *   keys: toRef(() => props.keys),
 *   labelField: toRef(() => props.labelField),
 *   groups: toRef(() => props.groups),
 *   barColors: toRef(() => props.barColors)
 * })
 */
export function useStackedChart(options: UseStackedChartOptions): UseStackedChart {
  const {
    loadedData,
    isLoaded,
    sortBy,
    keys,
    labelField,
    groups,
    barColors
  } = options

  const sortedData = computed((): any[] => {
    if (!toValue(isLoaded)) {
      return []
    }
    const data = toValue(loadedData)
    const sortKey = toValue(sortBy)
    return !sortKey ? data : sortByFn(data, sortKey)
  })

  const discoveredKeys = computed((): string[] => {
    const explicitKeys = toValue(keys)
    if (explicitKeys.length) {
      return explicitKeys
    }
    const data = toValue(loadedData)
    if (!data) {
      return []
    }
    return without(keysFn(data[0]), toValue(labelField))
  })

  const colorScale = computed((): (key: string) => string => {
    return d3
      .scaleOrdinal()
      .domain(discoveredKeys.value)
      .range(toValue(barColors)) as unknown as (key: string) => string
  })

  function totalRowValue(i: number | string): number {
    return d3.sum(discoveredKeys.value, (key: string) => {
      return sortedData.value[i as number][key]
    })
  }

  const maxStackValue = computed((): number | undefined => {
    return d3.max(toValue(loadedData) || [], (_datum: any, i: number) => {
      return totalRowValue(i)
    })
  })

  function groupName(key: string): string {
    const index = discoveredKeys.value.indexOf(key)
    return toValue(groups)[index] || key
  }

  return {
    sortedData,
    discoveredKeys,
    colorScale,
    totalRowValue,
    maxStackValue,
    groupName
  }
}

export default useStackedChart
