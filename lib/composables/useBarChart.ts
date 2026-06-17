import * as d3 from 'd3'
import sortByFn from 'lodash/sortBy'
import { computed, toValue } from 'vue'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { LoadedData } from '@/composables/useChartData'

/**
 * A single datum of a horizontal bar chart. `value` is the measured quantity;
 * `label` and `highlight` are optional presentation hints.
 */
export interface BarChartDatum {
  value: number | number[]
  highlight?: boolean
  label?: string
}

/**
 * The geometry of a single rendered bar, in canvas pixels, carrying the source
 * datum's value and highlight flag for the template.
 */
export type BarChartBar = {
  width: number
  height: number
  x: number
  y: number
} & BarChartDatum

/**
 * The geometry of a single rendered label, in canvas pixels.
 */
export interface BarChartLabel {
  label?: string
  x: number
  y: number
}

/**
 * The chart's inner padding box, once the axis margins are subtracted.
 */
export interface BarChartPadded {
  width: number
  height: number
}

/**
 * The chart's margins, in canvas pixels. Only the left margin is non-zero (it
 * reserves room for the labels); the others are kept for symmetry with the
 * padded-box computation.
 */
export interface BarChartMargin {
  left: number
  right: number
  top: number
  bottom: number
}

/**
 * Reactive inputs driving {@link useBarChart}. They mirror the `BarChart`
 * component's loaded data, its measured dimensions and the geometry-affecting
 * props, accepted as plain values, refs or getters so the composable adapts to
 * how the caller wires its state.
 */
export interface UseBarChartOptions {
  /**
   * The chart's loaded data (inline array or fetched), as exposed by `useChart`.
   */
  loadedData: MaybeRefOrGetter<LoadedData>
  /**
   * Measured outer width of the chart, in pixels.
   */
  width: MaybeRefOrGetter<number>
  /**
   * Measured (or fixed) width reserved for the labels column, in pixels.
   */
  labelWidth: MaybeRefOrGetter<number>
  /**
   * Measured (or fixed) width reserved for the values, in pixels. Already
   * includes the value gap.
   */
  valueWidth: MaybeRefOrGetter<number>
  /**
   * Field name(s) to sort the data by, or `null`/`undefined` to keep the
   * loaded order.
   */
  sortBy: MaybeRefOrGetter<string | string[] | null | undefined>
  /**
   * Height of each bar, in pixels.
   */
  barHeight: MaybeRefOrGetter<number>
  /**
   * Vertical gap between consecutive bars, in pixels.
   */
  barGap: MaybeRefOrGetter<number>
  /**
   * Horizontal gap between the labels and the bars, in pixels.
   */
  labelGap: MaybeRefOrGetter<number>
}

/**
 * Reactive API returned by {@link useBarChart}.
 */
export interface UseBarChart {
  /**
   * The loaded data, optionally sorted by the `sortBy` option.
   */
  sortedData: ComputedRef<object[]>
  /**
   * The chart's margins (only the left margin reserves label room).
   */
  margin: ComputedRef<BarChartMargin>
  /**
   * The inner padding box, after subtracting the margins.
   */
  padded: ComputedRef<BarChartPadded>
  /**
   * The linear scale mapping a datum value to a bar width in pixels.
   */
  scale: ComputedRef<{ x: d3.ScaleLinear<number, number> }>
  /**
   * The geometry of every bar, in source-data order (after sorting).
   */
  bars: ComputedRef<BarChartBar[]>
  /**
   * The geometry of every label, in source-data order (after sorting).
   */
  labels: ComputedRef<BarChartLabel[]>
  /**
   * The total SVG height needed to stack every bar.
   */
  height: ComputedRef<number>
}

/**
 * Owns the pure d3 geometry of the `BarChart` component: it sorts the data,
 * builds the linear value scale, and derives the bar, label, margin and padded
 * boxes. It holds no DOM state — the measured `width`/`labelWidth`/`valueWidth`
 * are passed in, and rendering stays in the component.
 *
 * @param options - Reactive geometry options (see {@link UseBarChartOptions}).
 * @returns The {@link UseBarChart} API of derived geometry.
 * @example
 * // Internal building block of the `BarChart` component; not exported from the
 * // package root. Inside a `<script setup>` block:
 * import { toRef } from 'vue'
 * import { useBarChart } from '@/composables/useBarChart'
 *
 * const { bars, height } = useBarChart({
 *   loadedData,
 *   width,
 *   labelWidth,
 *   valueWidth,
 *   sortBy: toRef(() => props.sortBy),
 *   barHeight: toRef(() => props.barHeight),
 *   barGap: toRef(() => props.barGap),
 *   labelGap: toRef(() => props.labelGap)
 * })
 */
export function useBarChart(options: UseBarChartOptions): UseBarChart {
  const {
    loadedData,
    width,
    labelWidth,
    valueWidth,
    sortBy,
    barHeight,
    barGap,
    labelGap
  } = options

  const sortedData = computed((): object[] => {
    const data = toValue(loadedData)
    if (!data) {
      return []
    }
    const sortKey = toValue(sortBy)
    return !sortKey ? data : sortByFn(data, sortKey)
  })

  // Only the left margin is non-zero: it reserves room for the labels column
  // plus the gap between labels and bars.
  const margin = computed((): BarChartMargin => {
    return {
      left: toValue(labelWidth) + toValue(labelGap),
      right: 0,
      top: 0,
      bottom: 0
    }
  })

  const padded = computed((): BarChartPadded => {
    const widthP = Math.max(0, toValue(width) - margin.value.left - margin.value.right)
    const heightP = Math.max(0, height.value - margin.value.top - margin.value.bottom)
    return { width: widthP, height: heightP }
  })

  // The value labels sit to the right of each bar, so the scale stops short of
  // the padded width by the room reserved for the widest value.
  const scale = computed((): { x: d3.ScaleLinear<number, number> } => {
    const x = d3
      .scaleLinear()
      // @ts-expect-error D3 api
      .domain([0, d3.max(sortedData.value, (d: BarChartDatum) => d.value)])
      .range([0, Math.max(0, padded.value.width - toValue(valueWidth))])
    return { x }
  })

  const bars = computed((): BarChartBar[] => {
    return sortedData.value.map((d: BarChartDatum, i: number) => {
      return {
        width: Math.abs(scale.value.x(d.value as number)),
        height: Math.abs(toValue(barHeight)),
        value: d.value,
        highlight: d.highlight,
        x: 0,
        y: (toValue(barHeight) + toValue(barGap)) * i
      }
    })
  })

  const labels = computed((): BarChartLabel[] => {
    return sortedData.value.map((d: BarChartDatum, i: number) => {
      return {
        label: d.label,
        x: toValue(labelWidth),
        y: 4 + toValue(barHeight) / 2 + (toValue(barHeight) + toValue(barGap)) * i
      }
    })
  })

  const height = computed((): number => {
    return (toValue(barHeight) + toValue(barGap)) * sortedData.value.length
  })

  return {
    sortedData,
    margin,
    padded,
    scale,
    bars,
    labels,
    height
  }
}

export default useBarChart
