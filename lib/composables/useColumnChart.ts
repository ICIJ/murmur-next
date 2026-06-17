import * as d3 from 'd3'
import iteratee from 'lodash/iteratee'
import sortByFn from 'lodash/sortBy'
import { computed, toValue } from 'vue'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { LoadedData } from '@/composables/useChartData'

/**
 * The geometry of a single rendered column, in canvas pixels, carrying its
 * source datum and (for waterfall charts) a flag marking the total column.
 */
export interface ColumnChartBar {
  datum: Record<string, any>
  width: number
  height: number
  x: number
  y: number
  isTotal?: boolean
}

/**
 * The chart's margins, in canvas pixels.
 */
export interface ColumnChartMargin {
  left: number
  right: number
  top: number
  bottom: number
}

/**
 * The chart's inner padding box, once the axis margins are subtracted.
 */
export interface ColumnChartPadded {
  width: number
  height: number
}

/**
 * A value formatter compatible with `useChart`'s `d3Formatter`: applies a d3
 * format string or a custom function, returning the value untouched otherwise.
 */
export type ColumnChartFormatter = (
  value: number | string,
  formatter?: ((v: number | string) => string) | string
) => string | number

/**
 * Reactive inputs driving {@link useColumnChart}. They mirror the `ColumnChart`
 * component's loaded data, its measured dimensions and the geometry-affecting
 * props, accepted as plain values, refs or getters so the composable adapts to
 * how the caller wires its state.
 */
export interface UseColumnChartOptions {
  /**
   * The chart's loaded data (inline array or fetched), as exposed by `useChart`.
   */
  loadedData: MaybeRefOrGetter<LoadedData>
  /**
   * Measured outer width of the chart, in pixels.
   */
  width: MaybeRefOrGetter<number>
  /**
   * Measured outer height of the chart, in pixels.
   */
  height: MaybeRefOrGetter<number>
  /**
   * Measured (or fixed) width reserved for the y-axis labels, in pixels.
   */
  labelWidth: MaybeRefOrGetter<number>
  /**
   * Measured height of the y-axis labels, in pixels.
   */
  labelHeight: MaybeRefOrGetter<number>
  /**
   * Measured height of the x-axis tick labels, in pixels.
   */
  bucketHeight: MaybeRefOrGetter<number>
  /**
   * Measured width of the x-axis tick labels, in pixels.
   */
  bucketWidth: MaybeRefOrGetter<number>
  /**
   * The `d3Formatter` helper exposed by `useChart`, used to format axis ticks.
   */
  d3Formatter: ColumnChartFormatter
  sortBy: MaybeRefOrGetter<string | string[] | null | undefined>
  seriesName: MaybeRefOrGetter<string>
  timeseriesKey: MaybeRefOrGetter<string>
  maxValue: MaybeRefOrGetter<number | null>
  barPadding: MaybeRefOrGetter<number>
  barMargin: MaybeRefOrGetter<number>
  noXAxis: MaybeRefOrGetter<boolean>
  noYAxis: MaybeRefOrGetter<boolean>
  xAxisTickCollapse: MaybeRefOrGetter<boolean>
  xAxisTickFormat: MaybeRefOrGetter<((v: any) => string) | string>
  xAxisTicks: MaybeRefOrGetter<string[] | null>
  yAxisTickFormat: MaybeRefOrGetter<((v: any) => string) | string>
  yAxisTicks: MaybeRefOrGetter<number | object>
  waterfall: MaybeRefOrGetter<boolean>
  waterfallTotal: MaybeRefOrGetter<boolean>
  waterfallTotalLabel: MaybeRefOrGetter<string>
}

/**
 * Reactive API returned by {@link useColumnChart}.
 */
export interface UseColumnChart {
  sortedData: ComputedRef<object[]>
  margin: ComputedRef<ColumnChartMargin>
  padded: ComputedRef<ColumnChartPadded>
  scaleX: ComputedRef<d3.ScaleBand<string>>
  scaleY: ComputedRef<d3.ScaleLinear<number, number>>
  waterfallTotalValue: ComputedRef<number>
  bars: ComputedRef<ColumnChartBar[]>
  xAxisHiddenTicks: ComputedRef<number>
  xAxisTickValues: ComputedRef<string[]>
  xAxis: ComputedRef<d3.Axis<string>>
  yAxis: ComputedRef<d3.Axis<d3.NumberValue>>
}

/**
 * Owns the pure d3 geometry of the `ColumnChart` component: it sorts the data,
 * builds the band and linear scales, derives every column (including the
 * waterfall layout and its optional total), and configures the x/y axes. It
 * holds no DOM state — the measured dimensions are passed in, and the axis
 * rendering and tooltips stay in the component.
 *
 * @param options - Reactive geometry options (see {@link UseColumnChartOptions}).
 * @returns The {@link UseColumnChart} API of derived geometry and axis builders.
 * @example
 * // Internal building block of the `ColumnChart` component; not exported from
 * // the package root. Inside a `<script setup>` block:
 * import { toRef } from 'vue'
 * import { useColumnChart } from '@/composables/useColumnChart'
 *
 * const { bars, scaleX, xAxis } = useColumnChart({
 *   loadedData,
 *   width,
 *   height,
 *   labelWidth,
 *   labelHeight,
 *   bucketHeight,
 *   bucketWidth,
 *   d3Formatter,
 *   seriesName: toRef(() => props.seriesName),
 *   timeseriesKey: toRef(() => props.timeseriesKey)
 *   // ...remaining geometry props
 * })
 */
export function useColumnChart(options: UseColumnChartOptions): UseColumnChart {
  const {
    loadedData,
    width,
    height,
    labelWidth,
    labelHeight,
    bucketHeight,
    bucketWidth,
    d3Formatter,
    sortBy,
    seriesName,
    timeseriesKey,
    maxValue,
    barPadding,
    barMargin,
    noXAxis,
    noYAxis,
    xAxisTickCollapse,
    xAxisTickFormat,
    xAxisTicks,
    yAxisTickFormat,
    yAxisTicks,
    waterfall,
    waterfallTotal,
    waterfallTotalLabel
  } = options

  const sortedData = computed((): object[] => {
    const data = toValue(loadedData)
    if (!data) {
      return []
    }
    const sortKey = toValue(sortBy)
    return !sortKey ? data : sortByFn(data, sortKey)
  })

  const margin = computed((): ColumnChartMargin => {
    return {
      left: toValue(noYAxis) ? 0 : toValue(labelWidth) + 10,
      right: 0,
      top: toValue(labelHeight) / 2,
      bottom: toValue(noXAxis) ? 0 : toValue(bucketHeight) + 10
    }
  })

  const padded = computed((): ColumnChartPadded => {
    const widthP = Math.max(0, toValue(width) - margin.value.left - margin.value.right)
    const heightP = Math.max(0, toValue(height) - margin.value.top - margin.value.bottom)
    return { width: widthP, height: heightP }
  })

  const scaleX = computed((): d3.ScaleBand<string> => {
    const domain = sortedData.value.map(iteratee(toValue(timeseriesKey)))
    if (toValue(waterfall) && toValue(waterfallTotal)) {
      domain.push(toValue(waterfallTotalLabel))
    }
    return d3
      .scaleBand()
      .domain(domain)
      .range([0, padded.value.width])
      .padding(toValue(barPadding))
  })

  const waterfallTotalValue = computed((): number => {
    return d3.sum(sortedData.value, iteratee(toValue(seriesName))) ?? 0
  })

  const scaleY = computed((): d3.ScaleLinear<number, number> => {
    let resolvedMax: number
    if (toValue(waterfall)) {
      resolvedMax = toValue(maxValue) ?? waterfallTotalValue.value
    }
    else {
      resolvedMax
        = toValue(maxValue) ?? d3.max(sortedData.value, iteratee(toValue(seriesName))) ?? 0
    }
    return d3
      .scaleLinear()
      .domain([0, resolvedMax])
      .range([padded.value.height, 0])
  })

  const bars = computed((): ColumnChartBar[] => {
    const seriesKey = toValue(seriesName)
    const timeKey = toValue(timeseriesKey)
    const innerBarMargin = toValue(barMargin)
    const barWidth = Math.max(1, Math.abs(scaleX.value.bandwidth()) - innerBarMargin)

    if (toValue(waterfall)) {
      // Each waterfall bar starts where the running total left off, so its top
      // is the cumulative scale position and its height the delta of one value.
      let cumulative = 0
      const waterfallBars: ColumnChartBar[] = sortedData.value.map((datum: any) => {
        const value = datum[seriesKey]
        cumulative += value
        return {
          datum,
          width: barWidth,
          height: Math.abs(padded.value.height - scaleY.value(value)),
          x: (scaleX.value(datum[timeKey]) ?? 0) + innerBarMargin / 2,
          y: scaleY.value(cumulative)
        }
      })

      if (toValue(waterfallTotal)) {
        const totalLabel = toValue(waterfallTotalLabel)
        const totalDatum = {
          [timeKey]: totalLabel,
          [seriesKey]: waterfallTotalValue.value
        }
        waterfallBars.push({
          datum: totalDatum,
          width: barWidth,
          height: Math.abs(padded.value.height - scaleY.value(waterfallTotalValue.value)),
          x: (scaleX.value(totalLabel) ?? 0) + innerBarMargin / 2,
          y: scaleY.value(waterfallTotalValue.value),
          isTotal: true
        })
      }

      return waterfallBars
    }

    return sortedData.value.map((datum: any) => {
      return {
        datum,
        width: barWidth,
        height: Math.abs(padded.value.height - scaleY.value(datum[seriesKey])),
        x: (scaleX.value(datum[timeKey]) ?? 0) + innerBarMargin / 2,
        y: scaleY.value(datum[seriesKey]) ?? 0
      }
    })
  })

  // Number of ticks to skip so labels stop overlapping: the first stride wide
  // enough that the visible buckets fit the chart width, or all of them.
  const xAxisHiddenTicks = computed((): number => {
    if (!toValue(xAxisTickCollapse)) {
      return 0
    }

    const hiddenTicks = d3.range(1, sortedData.value.length).find((mod) => {
      const bucketWidthT = toValue(bucketWidth) * 1.5
      return toValue(width) / (bucketWidthT / mod) >= sortedData.value.length
    })

    return hiddenTicks ?? sortedData.value.length
  })

  const xAxisTickValues = computed((): string[] => {
    // Either use the explicit `xAxisTicks` prop or use the data
    const ticks
      = toValue(xAxisTicks) ?? sortedData.value.map(iteratee(toValue(timeseriesKey)))
    // Then filter out ticks according to `xAxisHiddenTicks`
    const filtered = ticks.map((tick: string, i: number) => {
      return (i + 1) % xAxisHiddenTicks.value ? null : tick
    }) as string[]
    // Add the total label for waterfall charts
    if (toValue(waterfall) && toValue(waterfallTotal)) {
      filtered.push(toValue(waterfallTotalLabel))
    }
    return filtered
  })

  const xAxis = computed((): d3.Axis<string> => {
    return d3
      .axisBottom(scaleX.value)
      .tickFormat((d: any) => {
        // The waterfall total label is a literal, never run through the formatter.
        if (toValue(waterfall) && toValue(waterfallTotal) && d === toValue(waterfallTotalLabel)) {
          return d
        }
        return d3Formatter(d, toValue(xAxisTickFormat))
      })
      .tickValues(xAxisTickValues.value)
  })

  const yAxis = computed((): d3.Axis<d3.NumberValue> => {
    return d3
      .axisLeft(scaleY.value)
      .tickFormat((d: any) => d3Formatter(d, toValue(yAxisTickFormat)))
      .ticks(toValue(yAxisTicks) as number)
  })

  return {
    sortedData,
    margin,
    padded,
    scaleX,
    scaleY,
    waterfallTotalValue,
    bars,
    xAxisHiddenTicks,
    xAxisTickValues,
    xAxis,
    yAxis
  }
}

export default useColumnChart
