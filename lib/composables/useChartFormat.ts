import * as d3 from 'd3'
import isFunction from 'lodash/isFunction'
import isString from 'lodash/isString'
import some from 'lodash/some'
import { computed, toValue } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { LoadedData } from '@/composables/useChartData'

/**
 * Reactive inputs driving {@link useChartFormat}: the chart's loaded data (used
 * to detect highlights) and the height-ratio props feeding {@link baseHeightRatio}.
 */
export interface UseChartFormatOptions {
  loadedData: Ref<LoadedData>
  rawData: Ref<unknown>
  chartHeightRatio: Ref<number | undefined>
  socialMode: Ref<boolean>
  socialModeRatio: Ref<number>
}

/**
 * Reactive API returned by {@link useChartFormat}.
 */
export interface UseChartFormat {
  /**
   * Whether at least one datum is flagged `highlight`.
   */
  dataHasHighlights: ComputedRef<boolean>
  /**
   * The chart's base height-to-width ratio, honouring an explicit ratio first,
   * then social mode, then the default 16:9.
   */
  baseHeightRatio: ComputedRef<number>
  /**
   * Formats a value with a d3 format string or a custom function, returning the
   * value untouched when no usable formatter is given.
   */
  d3Formatter: (value: number | string, formatter?: ((v: number | string) => string) | string) => string | number
}

/**
 * Whether a datum is flagged as highlighted.
 */
function highlighted(datum: { highlight: boolean }) {
  return datum.highlight
}

/**
 * Owns a chart's pure formatting and derivation concern: it exposes the value
 * formatter, the base height ratio, and highlight detection. It holds no DOM
 * state and reads only from the reactive inputs it is given.
 *
 * @param options - The reactive data and height-ratio inputs (see {@link UseChartFormatOptions}).
 * @returns The {@link UseChartFormat} API of formatting and derived-config helpers.
 * @remarks Internal building block consumed by {@link useChart}; not exported from the package root.
 * @example
 * // Inside useChart, fed the loaded data and the height-ratio props:
 * import { useChartFormat } from '@/composables/useChartFormat'
 *
 * const { d3Formatter, baseHeightRatio, dataHasHighlights } = useChartFormat({
 *   loadedData,
 *   rawData: props.data,
 *   chartHeightRatio: props.chartHeightRatio,
 *   socialMode: props.socialMode,
 *   socialModeRatio: props.socialModeRatio
 * })
 */
export function useChartFormat(options: UseChartFormatOptions): UseChartFormat {
  const { loadedData, rawData, chartHeightRatio, socialMode, socialModeRatio } = options

  function d3Formatter(value: any, formatter: any) {
    if (isFunction(formatter)) {
      return formatter(value)
    }
    else if (isString(formatter)) {
      return d3.format(formatter)(value)
    }
    return value
  }

  const baseHeightRatio = computed(() => {
    const ratio = toValue(chartHeightRatio)
    const isSocialMode = toValue(socialMode)
    const socialRatio = toValue(socialModeRatio)
    return ratio || (isSocialMode ? socialRatio : 9 / 16)
  })

  const dataHasHighlights = computed(() => {
    // Prefer loadedData (so URL-fetched data is inspected), but fall back to the
    // raw prop so a synchronously-passed array reports highlights on first paint
    // rather than flickering once the load watcher resolves.
    const data = loadedData.value ?? toValue(rawData)
    if (Array.isArray(data)) {
      return some(data, highlighted)
    }
    return false
  })

  return { dataHasHighlights, baseHeightRatio, d3Formatter }
}

export default useChartFormat
