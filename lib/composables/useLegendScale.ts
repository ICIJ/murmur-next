import { isString } from 'lodash'
import * as d3 from 'd3'
import * as scaleFunctions from 'd3-scale'
import { computed, toValue } from 'vue'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'

/**
 * Maps a numeric value to a CSS color string. This is the shape returned by
 * d3 sequential/threshold scales as well as the function callers can pass
 * directly through the `colorScale` prop.
 */
export type ColorScaleFn = (v?: number) => string

/**
 * Maps a horizontal canvas pixel offset to the color painted at that column.
 */
export type WidthScaleFn = (x: number) => string

/**
 * Reactive options driving the scale legend derivation. They mirror the props
 * of the `LegendScale` component, accepted as plain values, refs or getters so
 * the composable stays adaptable to how the caller wires its state.
 */
export interface UseLegendScaleOptions {
  /**
   * Width of the legend (and of its color canvas), in pixels.
   */
  width: MaybeRefOrGetter<number>
  /**
   * Lower bound of the value domain.
   */
  min: MaybeRefOrGetter<number>
  /**
   * Upper bound of the value domain.
   */
  max: MaybeRefOrGetter<number>
  /**
   * Current cursor value, or `null`/`undefined` when no cursor is shown.
   */
  cursorValue: MaybeRefOrGetter<number | null | undefined>
  /**
   * Either a ready-made color scale function, or the name of a d3-scale
   * factory (e.g. `'scaleLinear'`) to build a two-stop scale from.
   */
  colorScale: MaybeRefOrGetter<ColorScaleFn | string>
  /**
   * Start color of the built-in two-stop scale (used when `colorScale` is a
   * factory name).
   */
  colorScaleStart: MaybeRefOrGetter<string>
  /**
   * End color of the built-in two-stop scale (used when `colorScale` is a
   * factory name).
   */
  colorScaleEnd: MaybeRefOrGetter<string>
}

/**
 * Reactive API returned by {@link useLegendScale}.
 */
export interface UseLegendScale {
  /**
   * Color scale mapping a value of the domain to a CSS color. When the
   * `colorScale` option is a factory name, it is a two-stop scale spanning
   * `[min, max]`; otherwise it is the caller-provided function.
   */
  colorScaleFunction: ComputedRef<ColorScaleFn>
  /**
   * Maps a canvas pixel column to the value it represents on the `[min, max]`
   * domain.
   */
  widthScale: ComputedRef<d3.ScaleLinear<number, number>>
  /**
   * Maps a canvas pixel column directly to the color painted there, composing
   * {@link widthScale} with {@link colorScaleFunction}.
   */
  widthScaleColor: ComputedRef<WidthScaleFn>
  /**
   * Pixel columns to paint, from `1` to `width` inclusive.
   */
  colorScaleWidthRange: ComputedRef<number[]>
  /**
   * Whether a cursor value is set (and therefore the cursor should render).
   */
  hasCursor: ComputedRef<boolean>
  /**
   * Left offset of the cursor as a CSS percentage string (e.g. `'33%'`),
   * falling back to `'0%'` when the value is not a number.
   */
  cursorLeft: ComputedRef<string>
}

/**
 * Owns the d3 scale and color-domain derivation of the `LegendScale`
 * component: it builds the color scale over the value domain, the linear scale
 * mapping canvas pixels to values (and to colors), and the cursor positioning
 * scale. It holds no DOM state — canvas rendering stays in the component.
 *
 * @param options - Reactive scale options (see {@link UseLegendScaleOptions}).
 * @returns The {@link UseLegendScale} API of derived d3 scales and the cursor
 *   placement helpers.
 * @example
 * // Internal building block of the `LegendScale` component; not exported from
 * // the package root. Inside a `<script setup>` block:
 * import { toRef } from 'vue'
 * import { useLegendScale } from '@/composables/useLegendScale'
 *
 * const props = defineProps<{ min?: number, max?: number }>()
 * const { widthScaleColor, cursorLeft } = useLegendScale({
 *   width: toRef(() => props.width),
 *   min: toRef(() => props.min),
 *   max: toRef(() => props.max),
 *   cursorValue: toRef(() => props.cursorValue),
 *   colorScale: toRef(() => props.colorScale),
 *   colorScaleStart: toRef(() => props.colorScaleStart),
 *   colorScaleEnd: toRef(() => props.colorScaleEnd)
 * })
 */
export function useLegendScale(options: UseLegendScaleOptions): UseLegendScale {
  const {
    width,
    min,
    max,
    cursorValue,
    colorScale,
    colorScaleStart,
    colorScaleEnd
  } = options

  // Use the caller-provided color function as-is, or build a two-stop scale
  // from the named d3-scale factory spanning the value domain.
  const colorScaleFunction = computed((): ColorScaleFn => {
    const scale = toValue(colorScale)
    if (isString(scale)) {
      const factory = (scaleFunctions as unknown as Record<string, () => any>)[scale]
      return factory()
        .domain([toValue(min), toValue(max)])
        .range([toValue(colorScaleStart), toValue(colorScaleEnd)])
    }
    return scale
  })

  // Map canvas pixel columns to values on the domain.
  const widthScale = computed((): d3.ScaleLinear<number, number> => {
    return d3
      .scaleLinear()
      .domain([0, toValue(width)])
      .range([toValue(min), toValue(max)])
  })

  const widthScaleColor = computed((): WidthScaleFn => {
    return (x: number) => colorScaleFunction.value(widthScale.value(x))
  })

  const colorScaleWidthRange = computed((): number[] => {
    return d3.range(1, toValue(width) + 1)
  })

  const hasCursor = computed((): boolean => {
    return toValue(cursorValue) != null // double equal also tests undefined
  })

  // Map the cursor value to a [0, 100] percentage, rounding to integers.
  const cursorLeftScale = computed((): d3.ScaleLinear<number, number> => {
    return d3
      .scaleLinear()
      .domain([toValue(min), toValue(max)])
      .range([0, 100])
      .interpolate(d3.interpolateRound)
  })

  const cursorLeft = computed((): string => {
    const left = cursorLeftScale.value(toValue(cursorValue) as number)
    return isNaN(left) ? '0%' : `${left}%`
  })

  return {
    colorScaleFunction,
    widthScale,
    widthScaleColor,
    colorScaleWidthRange,
    hasCursor,
    cursorLeft
  }
}

export default useLegendScale
