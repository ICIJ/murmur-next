import clamp from 'lodash/clamp'
import { computed, toValue } from 'vue'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'

/**
 * Reactive inputs driving the pagination derivation. They mirror the props
 * shared by the pagination components, accepted as plain values, refs or
 * getters so the composable stays adaptable to how the caller wires its state.
 */
export interface UsePaginationOptions {
  /**
   * The current page, 1-based. Accepts a number or a numeric string (as it may
   * come straight from a `v-model` bound to a text input).
   */
  currentPage: MaybeRefOrGetter<number | string>
  /**
   * Total number of rows spread across the pages.
   */
  totalRows: MaybeRefOrGetter<number>
  /**
   * Number of rows displayed per page.
   */
  perPage: MaybeRefOrGetter<number>
  /**
   * Explicit number of pages. When `null` (the default), the page count is
   * derived from `totalRows` and `perPage`; otherwise this value wins.
   */
  pages?: MaybeRefOrGetter<number | string | null>
}

/**
 * Reactive API returned by {@link usePagination}.
 */
export interface UsePagination {
  /**
   * The current page coerced to a number.
   */
  pageValue: ComputedRef<number>
  /**
   * The total number of pages. Derived from `totalRows` / `perPage` unless an
   * explicit `pages` input is provided.
   */
  numberOfPages: ComputedRef<number>
  /**
   * The 1-based index of the last row covered by the current page
   * (`pageValue * perPage`).
   */
  lastRangeRow: ComputedRef<number>
  /**
   * Whether a page exists before the current one (i.e. not on the first page).
   */
  hasFirst: ComputedRef<boolean>
  /**
   * Whether a previous page exists. Alias of {@link UsePagination.hasFirst}.
   */
  hasPrevious: ComputedRef<boolean>
  /**
   * Whether a page exists after the current one (i.e. not on the last page).
   */
  hasLast: ComputedRef<boolean>
  /**
   * Whether a next page exists. Alias of {@link UsePagination.hasLast}.
   */
  hasNext: ComputedRef<boolean>
  /**
   * Clamps an arbitrary (possibly fractional or out-of-range) page number to a
   * valid integer page within `[1, numberOfPages]`.
   *
   * @param page - The candidate page number.
   * @returns The page clamped to the valid range, floored to an integer.
   */
  clampPage: (page: number) => number
}

/**
 * Owns the page-range math shared by the pagination components: the total page
 * count, the normalized current page, the row range it covers, and the
 * navigation bound flags. The derivation is pure and deterministic — identical
 * inputs always produce identical outputs — so it holds no DOM nor i18n state.
 *
 * This composable is internal to the library and not exported from the public
 * entry point; consume it from a relative path.
 *
 * @param options - Reactive pagination inputs (see {@link UsePaginationOptions}).
 * @returns The {@link UsePagination} API of derived page math and the
 *   {@link UsePagination.clampPage} helper.
 * @example
 * import { usePagination } from '@/composables/usePagination'
 *
 * const { numberOfPages, hasNext, clampPage } = usePagination({
 *   currentPage: () => modelValue.value,
 *   totalRows: () => props.totalRows,
 *   perPage: () => props.perPage,
 *   pages: () => props.pages
 * })
 */
export function usePagination(options: UsePaginationOptions): UsePagination {
  const { currentPage, totalRows, perPage, pages } = options

  const pageValue = computed((): number => +toValue(currentPage))

  // Honor an explicit page count when provided, otherwise derive it from the
  // total rows and the page size.
  const numberOfPages = computed((): number => {
    const explicitPages = toValue(pages)
    if (explicitPages == null) {
      return Math.ceil(toValue(totalRows) / toValue(perPage))
    }
    return Number(explicitPages)
  })

  const lastRangeRow = computed((): number => pageValue.value * toValue(perPage))

  const hasFirst = computed((): boolean => pageValue.value > 1)
  const hasPrevious = computed((): boolean => hasFirst.value)

  const hasLast = computed((): boolean => pageValue.value < numberOfPages.value)
  const hasNext = computed((): boolean => hasLast.value)

  const clampPage = (page: number): number => {
    return clamp(Math.floor(page), 1, numberOfPages.value)
  }

  return {
    pageValue,
    numberOfPages,
    lastRangeRow,
    hasFirst,
    hasPrevious,
    hasLast,
    hasNext,
    clampPage
  }
}

export default usePagination
