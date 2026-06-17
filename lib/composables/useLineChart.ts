import * as d3 from 'd3'
import { computed, toRaw, toValue } from 'vue'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { LoadedData } from '@/composables/useChartData'

/**
 * One rendered line series: its source key, the SVG path `d` attribute and the
 * stroke color resolved from the ordinal color scale.
 */
export interface LineChartSeries {
  key: string
  path: string | null
  color: string | null
}

/**
 * A value formatter compatible with `useChart`'s `d3Formatter`: applies a d3
 * format string or a custom function, returning the value untouched otherwise.
 */
export type LineChartFormatter = (
  value: number | string,
  formatter?: ((v: number | string) => string) | string
) => string | number

/**
 * The chart's inner padding box, once the axis margins are subtracted.
 */
export interface LineChartPadded {
  width: number
  height: number
}

/**
 * Reactive inputs driving {@link useLineChart}. They mirror the `LineChart`
 * component's loaded data, its measured padding box and the geometry-affecting
 * props, accepted as plain values, refs or getters so the composable adapts to
 * how the caller wires its state.
 */
export interface UseLineChartOptions {
  /**
   * The chart's loaded data (inline array or fetched), as exposed by `useChart`.
   */
  loadedData: MaybeRefOrGetter<LoadedData>
  /**
   * The measured inner padding box (width/height in pixels) the scales map onto.
   */
  padded: MaybeRefOrGetter<LineChartPadded>
  /**
   * Field names for each series. When non-empty the chart is multi-line.
   */
  keys: MaybeRefOrGetter<string[]>
  /**
   * Field name holding the y value in single-series mode (when `keys` is empty).
   */
  seriesName: MaybeRefOrGetter<string>
  /**
   * Field name holding the x time/date value, parsed as a year (`%Y`).
   */
  timeseriesKey: MaybeRefOrGetter<string>
  /**
   * Explicit stroke colors for each line; falls back to `d3.schemeCategory10`.
   */
  lineColors: MaybeRefOrGetter<string[]>
  /**
   * Optional d3 curve factory for line interpolation (defaults to linear).
   */
  curve: MaybeRefOrGetter<d3.CurveFactory | undefined>
  /**
   * The `d3Formatter` helper exposed by `useChart`, used to format y-axis ticks.
   */
  d3Formatter: LineChartFormatter
  /**
   * Number of x-axis ticks or a d3 tick configuration.
   */
  xAxisTicks: MaybeRefOrGetter<object | number | ((d: any) => any) | null>
  /**
   * Formatter function or d3 format string for y-axis tick labels.
   */
  yAxisTickFormat: MaybeRefOrGetter<((v: any) => string) | string>
  /**
   * Number of y-axis ticks or a d3 tick configuration.
   */
  yAxisTicks: MaybeRefOrGetter<number | object>
  /**
   * Formats an x-axis year, as exposed by `useChart` (`xAxisYearFormat`).
   */
  xAxisYearFormat: (year: number | string) => number | string
}

/**
 * Reactive API returned by {@link useLineChart}.
 */
export interface UseLineChart {
  isMultiLine: ComputedRef<boolean>
  activeKeys: ComputedRef<string[]>
  colorScale: ComputedRef<d3.ScaleOrdinal<string, string>>
  formattedData: ComputedRef<Record<string, any>[]>
  scaleX: ComputedRef<d3.ScaleTime<number, number>>
  scaleY: ComputedRef<d3.ScaleLinear<number, number>>
  lines: ComputedRef<LineChartSeries[]>
  line: ComputedRef<string | null>
  xAxis: ComputedRef<d3.Axis<Date | d3.NumberValue>>
  yAxis: ComputedRef<d3.Axis<d3.NumberValue>>
}

// Call the first argument if it's a function, or return it untouched. Mirrors
// the d3 tick configuration, which accepts either a value or an accessor.
function castCall(fnOrValue: any, ...rest: any[]) {
  return typeof fnOrValue === 'function' ? fnOrValue(...rest) : fnOrValue
}

// d3 parses a bare year ("%Y") into a Date positioned at the start of that year.
const parseTime = d3.timeParse('%Y')

/**
 * Owns the pure d3 geometry of the `LineChart` component: it normalizes the data
 * (parsing the time field and casting series values), builds the time and linear
 * scales with their domains applied, derives every line path (single or
 * multi-series) and configures the x/y axes. It holds no DOM state — the measured
 * padding box is passed in, and the axis rendering stays in the component.
 *
 * @param options - Reactive geometry options (see {@link UseLineChartOptions}).
 * @returns The {@link UseLineChart} API of derived geometry and axis builders.
 * @remarks Internal building block of the `LineChart` component; not exported
 * from the package root.
 * @example
 * // Inside the `LineChart` component's `<script setup>` block:
 * import { toRef } from 'vue'
 * import { useLineChart } from '@/composables/useLineChart'
 *
 * const { lines, line, scaleX, xAxis } = useLineChart({
 *   loadedData,
 *   padded,
 *   d3Formatter,
 *   xAxisYearFormat,
 *   keys: toRef(() => props.keys),
 *   seriesName: toRef(() => props.seriesName),
 *   timeseriesKey: toRef(() => props.timeseriesKey)
 *   // ...remaining geometry props
 * })
 */
export function useLineChart(options: UseLineChartOptions): UseLineChart {
  const {
    loadedData,
    padded,
    keys,
    seriesName,
    timeseriesKey,
    lineColors,
    curve,
    d3Formatter,
    xAxisTicks,
    yAxisTickFormat,
    yAxisTicks,
    xAxisYearFormat
  } = options

  const isMultiLine = computed((): boolean => toValue(keys).length > 0)

  const activeKeys = computed((): string[] => {
    return isMultiLine.value ? toValue(keys) : [toValue(seriesName)]
  })

  const colorScale = computed((): d3.ScaleOrdinal<string, string> => {
    const colors = toValue(lineColors)
    return d3
      .scaleOrdinal<string>()
      .domain(activeKeys.value)
      .range(colors.length ? colors : d3.schemeCategory10)
  })

  const formattedData = computed((): Record<string, any>[] => {
    const data = toValue(loadedData)
    if (!data) {
      return []
    }
    const timeKey = toValue(timeseriesKey)
    return data.map((d: any) => {
      // Clone to avoid mutating reactive source data (parseTime on an
      // already-parsed Date returns null).
      const rawD = { ...toRaw(d) }
      rawD[timeKey] = parseTime(d[timeKey])
      for (const key of activeKeys.value) {
        rawD[key] = +d[key]
      }
      return rawD
    })
  })

  const scaleX = computed((): d3.ScaleTime<number, number> => {
    const timeKey = toValue(timeseriesKey)
    return d3
      .scaleTime()
      .range([0, toValue(padded).width])
      .domain(d3.extent(formattedData.value, (d: any) => d[timeKey]) as [Date, Date])
  })

  const scaleY = computed((): d3.ScaleLinear<number, number> => {
    // Y domain covers every active series.
    const maxY = d3.max(activeKeys.value, (key) => {
      return d3.max(formattedData.value, (d: any) => d[key]) as number
    }) as number
    return d3
      .scaleLinear()
      .range([toValue(padded).height, 0])
      .domain([0, maxY])
  })

  const lineGenerator = computed((): d3.Line<{ x: number, y: number }> => {
    const generator = d3
      .line<{ x: number, y: number }>()
      .x(d => d.x)
      .y(d => d.y)
    const curveFactory = toValue(curve)
    if (curveFactory) {
      generator.curve(curveFactory)
    }
    return generator
  })

  // Map a single series key to its array of pixel-space points.
  function seriesPoints(key: string) {
    const timeKey = toValue(timeseriesKey)
    return formattedData.value.map((d: any) => ({
      x: scaleX.value(d[timeKey]),
      y: scaleY.value(d[key])
    }))
  }

  const lines = computed((): LineChartSeries[] => {
    if (!isMultiLine.value) {
      return []
    }
    return toValue(keys).map((key) => {
      return {
        key,
        path: lineGenerator.value(seriesPoints(key)),
        color: colorScale.value(key)
      }
    })
  })

  const line = computed((): string | null => {
    if (isMultiLine.value) {
      return null
    }
    return lineGenerator.value(seriesPoints(toValue(seriesName)))
  })

  const xAxis = computed((): d3.Axis<Date | d3.NumberValue> => {
    return d3
      .axisBottom(scaleX.value)
      .ticks(toValue(xAxisTicks) as any)
      .tickFormat((d: any) => castCall(xAxisYearFormat, d.getFullYear()))
  })

  const yAxis = computed((): d3.Axis<d3.NumberValue> => {
    return d3
      .axisLeft(scaleY.value)
      .tickFormat((d: any) => d3Formatter(d, toValue(yAxisTickFormat)))
      .ticks(toValue(yAxisTicks) as number)
  })

  return {
    isMultiLine,
    activeKeys,
    colorScale,
    formattedData,
    scaleX,
    scaleY,
    lines,
    line,
    xAxis,
    yAxis
  }
}

export default useLineChart
