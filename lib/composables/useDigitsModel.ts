import { filter } from 'lodash'
import { computed, ref, toValue, watch } from 'vue'
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'

/**
 * Strips every non-digit character from a single cell value.
 *
 * @param value - The raw cell value.
 * @returns The value with all non-digit characters removed.
 */
export function keepDigitsOnly(value: string): string {
  return String(value).replace(/\D/g, '')
}

/**
 * Normalizes a list of digit cells and spreads any multi-digit cell across the
 * following cells, then truncates the result to `length`. A cell holding more
 * than one digit (a value greater than 9) overflows into its neighbours so each
 * cell ends up holding a single digit.
 *
 * This is the pure transform behind the digits input; it has no reactive or DOM
 * side effects.
 *
 * @param values - The current cell values.
 * @param length - The maximum number of cells to keep.
 * @returns The normalized, spread and truncated cell values.
 */
export function spreadDigits(values: string[], length: number): string[] {
  // Remove anything that is not a digit from each cell.
  const formattedValues = values.map(keepDigitsOnly)
  // A cell holding more than one digit must overflow into the next cells.
  formattedValues.forEach((value: string, cellIndex: number) => {
    if (value !== null && Number(value) > 9) {
      String(value)
        .split('')
        .forEach((nextValue, offset) => {
          formattedValues[cellIndex + offset] = String(Number(nextValue))
        })
    }
  })
  return formattedValues.slice(0, length)
}

/**
 * Reactive inputs driving the digits model.
 */
export interface UseDigitsModelOptions {
  /**
   * The value backing the input, used to seed the cells.
   */
  modelValue: MaybeRefOrGetter<string | number>
  /**
   * Number of digit cells.
   */
  length: MaybeRefOrGetter<number>
}

/**
 * Reactive API returned by {@link useDigitsModel}.
 */
export interface UseDigitsModel {
  /**
   * The per-cell values, kept normalized (single digit per cell, spread on
   * overflow) by an internal watcher.
   */
  values: Ref<string[]>
  /**
   * The cells joined into a single string, ignoring any non-numeric cell.
   */
  joinedValues: ComputedRef<string>
}

/**
 * Owns the per-cell state of the digits input: the `values` cells seeded from
 * the bound value, the `joinedValues` projection, and the normalization watcher
 * that spreads multi-digit entries across the following cells. The watcher only
 * rewrites `values` when the normalized result differs, avoiding an infinite
 * update cycle. Focus management and event emission stay in the component since
 * they are DOM and contract concerns.
 *
 * This composable is internal to the library and not exported from the public
 * entry point; consume it from a relative path.
 *
 * @param options - Reactive digit inputs (see {@link UseDigitsModelOptions}).
 * @param onNormalized - Optional callback fired after each normalization pass,
 *   used by the component to move focus to the next cell.
 * @returns The {@link UseDigitsModel} API.
 * @example
 * import { useDigitsModel } from '@/composables/useDigitsModel'
 *
 * const { values, joinedValues } = useDigitsModel(
 *   { modelValue: () => props.modelValue, length: () => props.length },
 *   focusToNextInput
 * )
 */
export function useDigitsModel(
  options: UseDigitsModelOptions,
  onNormalized?: () => void
): UseDigitsModel {
  const { modelValue, length } = options

  const values = ref<string[]>(
    String(toValue(modelValue)).split('').slice(0, toValue(length))
  )

  const joinedValues = computed((): string => {
    return filter(values.value, v => !isNaN(v as any)).join('')
  })

  // Intentionally watches the ref object itself (not `values.value`) and relies
  // on `{ deep: true }` to traverse into it — preserved verbatim from the
  // original; do not "simplify" to `values` or `() => values.value`, as that
  // changes the watcher's firing and timing.
  watch(
    () => values,
    (valuesRef: typeof values) => {
      const normalized = spreadDigits(valuesRef.value, toValue(length))
      // Only rewrite the cells when they actually changed to avoid an infinite
      // update cycle.
      if (JSON.stringify(valuesRef.value) !== JSON.stringify(normalized)) {
        valuesRef.value = normalized
      }
      onNormalized?.()
    },
    { deep: true }
  )

  return {
    values,
    joinedValues
  }
}

export default useDigitsModel
