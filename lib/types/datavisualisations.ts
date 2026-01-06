/**
 * Datavisualisation component prop types
 */

/**
 * Common chart props shared by all chart components
 */
export interface BaseChartProps {
  /**
   * Data to display, either as a URL string to fetch or an array of objects.
   */
  data?: string | object[] | null
  /**
   * Type of data file when fetching from URL.
   */
  dataUrlType?: 'json' | 'csv' | 'tsv'
  /**
   * Aspect ratio (height/width) for the chart.
   */
  chartHeightRatio?: number
  /**
   * Enable social mode for optimal display when sharing on social media.
   */
  socialMode?: boolean
  /**
   * Aspect ratio to use in social mode.
   */
  socialModeRatio?: number
}

/**
 * BarChart component props
 */
export interface BarChartProps extends BaseChartProps {
  /**
   * Height of each bar in pixels.
   */
  barHeight?: number
  /**
   * Vertical gap between bars in pixels.
   */
  barGap?: number
  /**
   * Color of the bars. Falls back to theme's dark color.
   */
  barColor?: string | null
  /**
   * Color of highlighted bars. Falls back to theme's primary color.
   */
  barHighlightColor?: string | null
  /**
   * Fixed width for labels in pixels. If not set, width is calculated automatically.
   */
  fixedLabelWidth?: number | null
  /**
   * Fixed width for values in pixels. If not set, width is calculated automatically.
   */
  fixedValueWidth?: number | null
  /**
   * Horizontal gap between labels and bars in pixels.
   */
  labelGap?: number
  /**
   * Horizontal gap between bars and their values in pixels.
   */
  valueGap?: number
  /**
   * Field name(s) to sort the data by.
   */
  sortBy?: string | string[] | null
  /**
   * Formatter function or d3 format string for x-axis tick values.
   */
  xAxisTickFormat?: ((v: number | string) => string) | string
}

/**
 * ColumnChart component props
 */
export interface ColumnChartProps extends BaseChartProps {
  /**
   * Color of the columns. Falls back to theme's dark color.
   */
  columnColor?: string | null
  /**
   * Color of highlighted columns. Falls back to theme's primary color.
   */
  columnHighlightColor?: string | null
  /**
   * Fixed height for the chart in pixels. If not set, height is calculated from width.
   */
  fixedHeight?: number | null
  /**
   * Fixed width for y-axis labels in pixels. If not set, width is calculated automatically.
   */
  fixedLabelWidth?: number | null
  /**
   * Field name in data objects containing the value to display.
   */
  seriesName?: string
  /**
   * Collapse x-axis ticks to prevent overlapping when there are many data points.
   */
  xAxisTickCollapse?: boolean
  /**
   * Formatter function or d3 format string for x-axis tick labels.
   */
  xAxisTickFormat?: ((v: number | string) => string) | string
  /**
   * Explicit list of x-axis tick values to display.
   */
  xAxisTicks?: string[] | null
  /**
   * Formatter function or d3 format string for y-axis tick labels.
   */
  yAxisTickFormat?: ((v: number | string) => string) | string
  /**
   * Number of y-axis ticks or d3 tick configuration object.
   */
  yAxisTicks?: number | object
  /**
   * Field name(s) to sort the data by.
   */
  sortBy?: string | string[] | null
  /**
   * Field name in data objects containing the x-axis category/time value.
   */
  timeseriesKey?: string
  /**
   * Maximum value for the y-axis scale. If not set, derived from data.
   */
  maxValue?: number | null
  /**
   * Disable tooltips on column hover.
   */
  noTooltips?: boolean
  /**
   * Hide the x-axis.
   */
  noXAxis?: boolean
  /**
   * Hide the y-axis.
   */
  noYAxis?: boolean
  /**
   * Padding between columns as a ratio (0-1) of the column width.
   */
  barPadding?: number
  /**
   * Margin between columns in pixels.
   */
  barMargin?: number
  /**
   * List of timeseriesKey values to highlight.
   */
  highlights?: string[]
  /**
   * Show placeholder bars for visual pattern.
   */
  stripped?: boolean
  /**
   * Enable hover effects on columns.
   */
  hover?: boolean
  /**
   * Icon component to display on column hover.
   */
  hoverIcon?: string | object | object[] | null
  /**
   * Size of the hover icon.
   */
  hoverIconSize?: string
}

/**
 * LineChart component props
 */
export interface LineChartProps extends BaseChartProps {
  /**
   * Color of the line. Falls back to theme's dark color.
   */
  lineColor?: string | null
  /**
   * Fixed width for y-axis labels in pixels. If not set, width is calculated automatically.
   */
  fixedLabelWidth?: number | null
  /**
   * Fixed height for the chart in pixels. If not set, height is calculated from width.
   */
  fixedHeight?: number | null
  /**
   * Field name in data objects containing the y-axis value.
   */
  seriesName?: string
  /**
   * Number of x-axis ticks or d3 tick configuration.
   */
  xAxisTicks?: object | number | ((d: Date) => string) | null
  /**
   * Formatter function or d3 format string for y-axis tick labels.
   */
  yAxisTickFormat?: ((v: number | string) => string) | string
  /**
   * Number of y-axis ticks or d3 tick configuration.
   */
  yAxisTicks?: object | number
  /**
   * Field name in data objects containing the x-axis time/date value (parsed as year).
   */
  timeseriesKey?: string
}

/**
 * StackedBarChart component props
 */
export interface StackedBarChartProps extends BaseChartProps {
  /**
   * Colors for each bar segment/key.
   */
  barColors?: string[]
  /**
   * Fixed height for the chart in pixels. If not set, height is calculated automatically.
   */
  fixedHeight?: number | null
  /**
   * Display names for each key in the legend.
   */
  groups?: string[]
  /**
   * Hide bar segments that have no values.
   */
  hideEmptyValues?: boolean
  /**
   * Hide the legend.
   */
  hideLegend?: boolean
  /**
   * List of keys to highlight initially.
   */
  highlights?: string[]
  /**
   * Delay in milliseconds before highlighting a key on hover.
   */
  highlightDelay?: number
  /**
   * Field names in data objects containing values for each stacked segment.
   */
  keys?: string[]
  /**
   * Position labels above the bars instead of to the left.
   */
  labelAbove?: boolean
  /**
   * Field name in data objects containing the row label.
   */
  labelField?: string
  /**
   * Minimum height for each bar row in pixels.
   */
  minBarHeight?: number
  /**
   * Maximum height for each bar row in pixels.
   */
  maxBarHeight?: number
  /**
   * Calculate bar widths relative to each row's total instead of the global maximum.
   */
  relative?: boolean
  /**
   * Delay in milliseconds before restoring highlights to initial state.
   */
  restoreHighlightDelay?: number
  /**
   * List of row labels to highlight.
   */
  rowHighlights?: string[]
  /**
   * Field name(s) to sort the data by.
   */
  sortBy?: string | string[] | null
  /**
   * Formatter function or d3 format string for bar values.
   */
  xAxisTickFormat?: ((v: number | string) => string) | string
}

/**
 * StackedColumnChart component props
 */
export interface StackedColumnChartProps extends BaseChartProps {
  /**
   * Field of each object containing data (for each group)
   */
  keys?: string[]
  /**
   * Group name to display in the legend
   */
  groups?: string[]
  /**
   * Colors of each bar group
   */
  barColors?: string[]
  /**
   * Max with of each bar.
   */
  barMaxWidth?: string
  /**
   * Hide bars that have no values.
   */
  hideEmptyValues?: boolean
  /**
   * Hide the legend.
   */
  hideLegend?: boolean
  /**
   * Enforce the height of the chart (regardless of the width or number of row)
   */
  fixedHeight?: number | null
  /**
   * Function to apply to format x-axis ticks
   */
  xAxisTickFormat?: ((v: number | string) => string) | string
  /**
   * Function to apply to format y-axis ticks (bars value).
   */
  yAxisTickFormat?: ((v: number | string) => string) | string
  /**
   * Padding on y-axis ticks
   */
  yAxisTickPadding?: number
  /**
   * Field containing the label for each column
   */
  labelField?: string
  /**
   * Sort groups by one or several keys.
   */
  sortBy?: string | string[] | null
  /**
   * Column height is relative to each group's total
   */
  relative?: boolean
  /**
   * A list of highlighted groups
   */
  highlights?: string[]
  /**
   * Delay to apply when set the first highlight
   */
  highlightDelay?: number
  /**
   * A list of entire column to highlight
   */
  columnHighlights?: string[]
  /**
   * Delay to apply when restoring highlights to initial state
   */
  restoreHighlightDelay?: number
  /**
   * Deactivate direct labeling on bars
   */
  noDirectLabeling?: boolean
  /**
   * Set max value instead of extracting it from the data.
   */
  maxValue?: number | null
  /**
   * Function to define tooltip content.
   */
  tooltipDisplay?: (params: { value?: number, formattedKey: string, formattedValue: string, key?: string }) => string
  /**
   * Hide bar tooltips
   */
  noTooltips?: boolean
}
