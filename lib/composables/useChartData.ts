import * as d3 from 'd3'
import isString from 'lodash/isString'
import { ref, toRef, toValue, watch } from 'vue'
import type { Ref } from 'vue'

/**
 * Data a chart can be fed: an array of rows, a keyed record of numbers, a URL
 * string to fetch from, or `null` before anything is provided.
 */
export type ChartData = object[] | Record<string, number> | string | null

/**
 * Data a chart holds once loading has settled: the inline value passed through,
 * the parsed result of a fetched URL, or `null` before the first load.
 */
export type LoadedData = object[] | Record<string, number> | null

/**
 * Reactive inputs driving {@link useChartData}: the raw chart data and the file
 * format to parse when that data is a URL.
 */
export interface UseChartDataOptions {
  data: Ref<ChartData>
  dataUrlType: Ref<'json' | 'csv' | 'tsv'>
}

/**
 * Reactive API returned by {@link useChartData}.
 */
export interface UseChartData {
  /**
   * The chart's resolved data: inline data passed through, or the parsed result
   * of a fetched URL. `null` until the first load settles.
   */
  loadedData: Ref<LoadedData>
}

/**
 * Owns a chart's data-loading concern: it watches the data and format inputs
 * and, whenever they change, either fetches and parses a URL through d3 or
 * passes inline data through untouched. A caller-supplied `onLoaded` hook is
 * awaited after each settled load so the parent can run its own side effects
 * (emitting events, sizing) in a predictable order.
 *
 * @param options - The reactive data and URL-type inputs (see {@link UseChartDataOptions}).
 * @param onLoaded - Hook awaited after every settled load, receiving the freshly loaded data.
 * @returns The {@link UseChartData} API exposing `loadedData`.
 * @remarks Internal building block consumed by {@link useChart}; not exported from the package root.
 * @example
 * // Inside useChart, wiring the load hook to lifecycle events:
 * import { useChartData } from '@/composables/useChartData'
 *
 * const { loadedData } = useChartData(
 *   { data: props.data, dataUrlType: props.dataUrlType },
 *   async (data) => {
 *     // simplified — see useChart for the full load→emit ordering
 *     // (afterLoaded → isLoaded → emit('loaded') → onResized → emit('resized'))
 *     await afterLoaded?.()
 *     emit('loaded', data)
 *   }
 * )
 */
export function useChartData(
  options: UseChartDataOptions,
  onLoaded: (data: LoadedData) => void | Promise<void>
): UseChartData {
  const dataRef = toRef(options.data)
  const dataUrlTypeRef = toRef(options.dataUrlType)
  const loadedData = ref<LoadedData>(null)

  // Reload whenever the data or its format changes: a URL string is fetched and
  // parsed through the matching d3 loader, while inline data is passed through.
  watch([dataRef, dataUrlTypeRef], async () => {
    await document.fonts?.ready

    const data = toValue(dataRef)
    const dataUrlType = toValue(dataUrlTypeRef)

    if (isString(data)) {
      // @ts-expect-error introspection in typescript is tricky
      loadedData.value = await d3[dataUrlType](data)
    }
    else {
      loadedData.value = data as unknown as []
    }

    await onLoaded(loadedData.value)
  }, { immediate: true })

  return { loadedData }
}

export default useChartData
