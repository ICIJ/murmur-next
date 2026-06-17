import { round } from 'lodash'
import { computed, ref, toValue, watch } from 'vue'
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'

/**
 * A range expressed as its `[start, end]` bounds, both normalized to the
 * `[0, 1]` interval.
 */
export type RangeBounds = [number, number]

/**
 * Reactive inputs driving the range derivation. They mirror the props of the
 * range component, accepted as plain values, refs or getters so the composable
 * stays adaptable to how the caller wires its state.
 */
export interface UseRangeControlOptions {
  /**
   * Initial `[start, end]` bounds. A range with fewer than two entries is
   * considered disabled.
   */
  range: MaybeRefOrGetter<RangeBounds>
  /**
   * Snap increment. For instance, with a snap of `0.1` values snap to `0`,
   * `0.1`, `0.2`, and so on.
   */
  snap: MaybeRefOrGetter<number>
  /**
   * Number of decimal places to which bound values are rounded.
   */
  precision: MaybeRefOrGetter<number>
  /**
   * Minimum distance kept between the two bounds so they never overlap.
   */
  minDistance: MaybeRefOrGetter<number>
}

/**
 * Reactive API returned by {@link useRangeControl}.
 */
export interface UseRangeControl {
  /**
   * The start bound, in the `[0, 1]` interval.
   */
  start: Ref<number>
  /**
   * The end bound, in the `[0, 1]` interval.
   */
  end: Ref<number>
  /**
   * Whether the range is disabled (fewer than two bounds were provided).
   */
  disabled: ComputedRef<boolean>
  /**
   * Snaps a value to the nearest multiple of the `snap` increment.
   *
   * @param value - The raw value to snap.
   * @returns The value snapped to the closest `snap` step.
   */
  snapValue: (value: number) => number
  /**
   * Computes the start bound for a pixel offset, snapping and rounding it, but
   * keeps the previous value if the new one would come too close to the end
   * bound.
   *
   * @param offset - Drag offset in pixels.
   * @param width - Total draggable width in pixels.
   * @returns `true` when the start bound changed, `false` otherwise.
   */
  moveStartTo: (offset: number, width: number) => boolean
  /**
   * Computes the end bound for a pixel offset, snapping and rounding it, but
   * keeps the previous value if the new one would come too close to the start
   * bound.
   *
   * @param offset - Drag offset in pixels.
   * @param width - Total draggable width in pixels.
   * @returns `true` when the end bound changed, `false` otherwise.
   */
  moveEndTo: (offset: number, width: number) => boolean
  /**
   * Slides the whole range to a new start offset, preserving the distance
   * between the two bounds.
   *
   * @param offset - Drag offset in pixels.
   * @param width - Total draggable width in pixels.
   */
  moveBoundsTo: (offset: number, width: number) => void
}

/**
 * Owns the range bounds math shared by the range component: the start/end
 * bounds in the `[0, 1]` interval, the snapping/rounding rules, and the
 * minimum-distance constraint between the two bounds. The derivation is pure
 * and deterministic — given the same offsets and width it always produces the
 * same bounds — so it holds no DOM state.
 *
 * This composable is internal to the library and not exported from the public
 * entry point; consume it from a relative path.
 *
 * @param options - Reactive range inputs (see {@link UseRangeControlOptions}).
 * @returns The {@link UseRangeControl} API of bounds refs and drag helpers.
 * @example
 * import { useRangeControl } from '@/composables/useRangeControl'
 *
 * const { start, end, moveStartTo } = useRangeControl({
 *   range: () => props.range,
 *   snap: () => props.snap,
 *   precision: () => props.precision,
 *   minDistance: () => props.minDistance
 * })
 */
export function useRangeControl(options: UseRangeControlOptions): UseRangeControl {
  const { range, snap, precision, minDistance } = options

  const start = ref<number>(toValue(range)[0] ?? 0)
  const end = ref<number>(toValue(range)[1] ?? 0)

  const disabled = computed((): boolean => toValue(range).length < 2)

  const snapValue = (value: number): number => {
    const step = toValue(snap)
    return round(value / step) * step
  }

  // Convert a pixel offset into a snapped bound within the [0, 1] interval.
  const offsetToBound = (offset: number, width: number): number => {
    return snapValue(offset / width)
  }

  const moveStartTo = (offset: number, width: number): boolean => {
    const newValue = offsetToBound(offset, width)
    // Ensure the start bound doesn't get too close to the end bound.
    if (newValue < end.value - toValue(minDistance)) {
      start.value = round(newValue, toValue(precision))
      return true
    }
    return false
  }

  const moveEndTo = (offset: number, width: number): boolean => {
    const newValue = offsetToBound(offset, width)
    // Ensure the end bound doesn't get too close to the start bound.
    if (newValue > start.value + toValue(minDistance)) {
      end.value = round(newValue, toValue(precision))
      return true
    }
    return false
  }

  const moveBoundsTo = (offset: number, width: number): void => {
    const distance = snapValue(end.value - start.value)
    const newValue = offsetToBound(offset, width)
    start.value = round(newValue, toValue(precision))
    end.value = round(newValue + distance, toValue(precision))
  }

  // Keep the bounds in sync when the source range changes from the outside.
  watch(() => toValue(range), (newRange: RangeBounds) => {
    start.value = newRange[0] ?? 0
    end.value = newRange[1] ?? 0
  })

  return {
    start,
    end,
    disabled,
    snapValue,
    moveStartTo,
    moveEndTo,
    moveBoundsTo
  }
}

export default useRangeControl
