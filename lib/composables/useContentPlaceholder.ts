import { computed, toValue } from 'vue'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'

import { formatRows } from '@/utils/placeholder'
import type {
  ContentPlaceholderRows,
  ContentPlaceholderStyledRows
} from '@/types'

/**
 * Reactive API returned by {@link useContentPlaceholder}.
 */
export interface UseContentPlaceholder {
  /**
   * The placeholder rows with every box converted to its flexbox style
   * declarations, ready to bind in the template.
   */
  formattedRows: ComputedRef<ContentPlaceholderStyledRows>
}

/**
 * Derives the styled placeholder rows for the `ContentPlaceholder` component.
 *
 * Wraps the pure {@link formatRows} geometry helper in a `computed` so the
 * styled rows recompute whenever the source rows change. The geometry itself is
 * deterministic: identical inputs always produce identical styles.
 *
 * This composable is internal to the library and not exported from the public
 * entry point; consume it from a relative path.
 *
 * @param rows - The placeholder rows, each box expressed as `[left, width]`.
 *   May be a plain value, a ref or a getter.
 * @param subClass - The CSS sub-class applied to spacer boxes.
 * @returns The {@link UseContentPlaceholder} API exposing `formattedRows`.
 * @example
 * import { useContentPlaceholder } from '@/composables/useContentPlaceholder'
 *
 * const { formattedRows } = useContentPlaceholder(
 *   () => props.rows,
 *   'content-placeholder__wrapper__row__box'
 * )
 */
export function useContentPlaceholder(
  rows: MaybeRefOrGetter<ContentPlaceholderRows | undefined>,
  subClass = 'box'
): UseContentPlaceholder {
  const formattedRows = computed((): ContentPlaceholderStyledRows => {
    const sourceRows = toValue(rows)
    // A placeholder without rows renders nothing rather than throwing.
    return sourceRows ? formatRows(sourceRows, subClass) : []
  })

  return { formattedRows }
}

export default useContentPlaceholder
