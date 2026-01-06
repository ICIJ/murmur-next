<template>
  <div
    class="tiny-pagination"
    :class="paginationClassList"
  >
    <b-button
      v-if="!noFirst"
      class="tiny-pagination__nav tiny-pagination__nav--bound  tiny-pagination__nav--first"
      :size="size"
      :disabled="!hasFirst"
      :variant="navVariant"
      @click="applyFirstPage"
    >
      <!-- @slot Previous button content -->
      <slot
        name="first"
        v-bind="{ modelValue, numberOfPages, hasFirst, hasPrevious, hasNext, hasLast }"
      >
        <app-icon>
          <component :is="firstPageIcon" />
        </app-icon>
        <span class="visually-hidden">{{ firstLabel ?? t('tiny-pagination.first') }}</span>
      </slot>
    </b-button>
    <b-button
      v-if="!noPrevious"
      class="tiny-pagination__nav"
      :size="size"
      :disabled="!hasPrevious"
      :variant="navVariant"
      @click="applyPreviousPage"
    >
      <!-- @slot Previous button content -->
      <slot
        name="previous"
        v-bind="{ modelValue, numberOfPages, hasPrevious, hasNext }"
      >
        <app-icon>
          <component :is="previousPageIcon" />
        </app-icon>
        <span class="visually-hidden">{{ previousLabel ?? t('tiny-pagination.previous') }}</span>
      </slot>
    </b-button>
    <form
      v-if="row"
      class="tiny-pagination__form form-inline"
      @submit.prevent="applyRowForm"
    >
      <b-form-input
        v-model="currentRowInput"
        v-input-autowidth="{ minWidth: '2em' }"
        :size="size"
        class="tiny-pagination__form__input tiny-pagination__form__input--row me-1"
        type="number"
        step="1"
        :disabled="!totalRows"
        :min="1"
        :max="totalRows - 1"
        :aria-label="t('tiny-pagination.ariaRow')"
      />
      <div
        v-ellipsis-tooltip="{ title }"
        class="tiny-pagination__form__label"
      >
        <!-- @slot Display number of rows and current range -->
        <slot
          name="number-of-rows"
          v-bind="{ modelValue, lastRangeRow, numberOfPages, totalRows }"
        >
          {{ title }}
        </slot>
      </div>
    </form>
    <form
      v-else
      class="tiny-pagination__form form-inline"
      @submit.prevent="applyPageForm"
    >
      <label
        v-show="!compact"
        class="tiny-pagination__form__label me-1 mb-0"
      >
        <!-- @slot Display page label -->
        <slot
          name="page"
          v-bind="{ modelValue, numberOfPages }"
        >
          {{ t('tiny-pagination.page') }}
        </slot>
      </label>
      <b-form-input
        v-model="currentPageInput"
        v-input-autowidth="{ minWidth: '2em' }"
        :size="size"
        class="tiny-pagination__form__input tiny-pagination__form__input--item me-1"
        type="number"
        step="1"
        :disabled="!totalRows"
        :min="1"
        :max="numberOfPages"
        :aria-label="inputAriaLabel ?? t('tiny-pagination.aria')"
      />
      <div
        v-ellipsis-tooltip="{ title }"
        class="tiny-pagination__form__label"
      >
        <!-- @slot Display number of pages -->
        <slot
          name="number-of-pages"
          v-bind="{ modelValue, numberOfPages }"
        >
          {{ title }}
        </slot>
      </div>
    </form>
    <b-button
      v-if="!noNext"
      class="tiny-pagination__nav"
      :size="size"
      :disabled="!hasNext"
      :variant="navVariant"
      @click="applyNextPage"
    >
      <!-- @slot Next button content -->
      <slot
        name="next"
        v-bind="{ modelValue, numberOfPages, hasPrevious, hasNext }"
      >
        <app-icon>
          <component :is="nextPageIcon" />
        </app-icon>
        <span class="visually-hidden">{{ nextLabel ?? t('tiny-pagination.next') }}</span>
      </slot>
    </b-button>
    <b-button
      v-if="!noLast"
      class="tiny-pagination__nav tiny-pagination__nav--bound  tiny-pagination__nav--last"
      :size="size"
      :disabled="!hasLast"
      :variant="navVariant"
      @click="applyLastPage"
    >
      <!-- @slot Previous button content -->
      <slot
        name="last"
        v-bind="{ modelValue, numberOfPages, hasFirst, hasPrevious, hasNext, hasLast }"
      >
        <app-icon>
          <component :is="lastPageIcon" />
        </app-icon>
        <span class="visually-hidden">{{ lastLabel ?? t('tiny-pagination.last') }}</span>
      </slot>
    </b-button>
  </div>
</template>

<script lang="ts" setup>
import { BButton, BFormInput } from 'bootstrap-vue-next'
import { computed, ref, watch, type Component } from 'vue'
import { directive as vInputAutowidth } from 'vue-input-autowidth'
import { useI18n } from 'vue-i18n'
import type { ButtonVariant, Size } from 'bootstrap-vue-next'

import { SIZE } from '@/enums'
import vEllipsisTooltip from '@/directives/EllipsisTooltip'
import AppIcon from '@/components/App/AppIcon.vue'
import IPhCaretDoubleLeft from '~icons/ph/caret-double-left'
import IPhCaretDoubleRight from '~icons/ph/caret-double-right'
import IPhCaretLeft from '~icons/ph/caret-left'
import IPhCaretRight from '~icons/ph/caret-right'

/**
 * Grabs and syncs the currentPage variable passed down from the parent in v-model
 */
const modelValue = defineModel<number | string>({
  default: 1
})

export interface PaginationTinyProps {
  /**
   * Total items to be stored in pages
   */
  totalRows?: number
  /**
   * Sets the quantity of items per page
   */
  perPage?: number
  /**
   * Use an input to set the row number
   */
  row?: boolean
  /**
   * Set the size of the input: 'sm', 'md' (default), or 'lg'.
   */
  size?: Size
  /**
   * (Optional) Number of page. Property `size` is required for this to work
   * properly. If `pages` is empty, it will be calculated using the size.
   */
  pages?: number | string | null
  /**
   * Hide navigation buttons (next and previous)
   */
  noNav?: boolean
  /**
   * Hide bounds navigation buttons (first and last)
   */
  noNavBounds?: boolean
  /**
   * Hide the first page button
   */
  noFirst?: boolean
  /**
   * Hide the last page button
   */
  noLast?: boolean
  /**
   * Hide the previous page button
   */
  noPrevious?: boolean
  /**
   * Hide the next page button
   */
  noNext?: boolean
  /**
   * Icon of the previous page button
   */
  previousPageIcon?: string | string[] | Component
  /**
   * Icon of the next page button
   */
  nextPageIcon?: string | string[] | Component
  /**
   * Icon of the first page button
   */
  firstPageIcon?: string | string[] | Component
  /**
   * Icon of the last page button
   */
  lastPageIcon?: string | string[] | Component
  /**
   * Navigation button variants
   */
  navVariant?: ButtonVariant
  /**
   * Display pagination as a block (full width)
   */
  block?: boolean
  /**
   * Compact mode with a grouped nav
   */
  compact?: boolean
  /**
   * Label for the previous page button
   */
  previousLabel?: string | null
  /**
   * Label for the next page button
   */
  nextLabel?: string | null
  /**
   * Label for the first page button
   */
  firstLabel?: string | null
  /**
   * Label for the last page button
   */
  lastLabel?: string | null
  /**
   * ARIA label for the input field
   */
  inputAriaLabel?: string | null
  /**
   * Title label for the pagination component
   */
  titleLabel?: string | null
}

const props = withDefaults(defineProps<PaginationTinyProps>(), {
  totalRows: 0,
  perPage: 20,
  row: false,
  size: SIZE.md,
  pages: null,
  noNav: false,
  noNavBounds: false,
  noFirst: false,
  noLast: false,
  noPrevious: false,
  noNext: false,
  previousPageIcon: () => IPhCaretLeft,
  nextPageIcon: () => IPhCaretRight,
  firstPageIcon: () => IPhCaretDoubleLeft,
  lastPageIcon: () => IPhCaretDoubleRight,
  navVariant: 'link',
  block: false,
  compact: false,
  previousLabel: null,
  nextLabel: null,
  firstLabel: null,
  lastLabel: null,
  inputAriaLabel: null,
  titleLabel: null
})

const { t, n } = useI18n()

const numberOfPages = computed((): number => {
  if (props.pages === null) {
    return Math.ceil(props.totalRows / props.perPage)
  }
  return Number(props.pages)
})

const paginationClassList = computed((): object => {
  return {
    [`tiny-pagination--${props.size}`]: true,
    [`tiny-pagination--no-nav`]: props.noNav,
    [`tiny-pagination--no-nav-bounds`]: props.noNavBounds,
    [`tiny-pagination--block`]: props.block,
    [`tiny-pagination--compact`]: props.compact
  }
})

const hasFirst = computed((): boolean => pageValue.value > 1)
const hasPrevious = computed((): boolean => hasFirst.value)

const hasLast = computed((): boolean => pageValue.value < numberOfPages.value)
const hasNext = computed((): boolean => hasLast.value)

const pageValue = computed(() => +modelValue.value)
const lastRangeRow = computed(() => +pageValue.value * props.perPage)

const currentPageInput = ref<number>(0)
const currentRowInput = ref<number>(0)

watch(modelValue, (value: number) => {
  // Update currentPageInput value based on totalRows
  currentPageInput.value = props.totalRows ? +value : 0
  // Determine the row offset based on the perPage value.
  if (props.perPage === 1) {
    currentRowInput.value = +value
  }
  else {
    // Update currentRowInput value based on totalRows and calculated rowOffset
    currentRowInput.value = props.totalRows ? +props.perPage * (+value - 1) + 1 : 0
  }
}, { immediate: true })

const title = computed(() => {
  if (props.titleLabel) {
    return props.titleLabel
  }

  if (props.row) {
    const locales = { lastRangeRow: n(lastRangeRow.value), totalRows: n(props.totalRows) }

    // Only one per page, meaning we navigate through rows one by one
    if (props.perPage === 1) {
      return props.compact ? '' : t('tiny-pagination.uniqueRowRange', locales, props.totalRows)
    }

    // The total is less or equal than the current row range
    if (props.totalRows <= (props.perPage * pageValue.value)) {
      return t('tiny-pagination.rowRangeFewer', locales, props.totalRows)
    }

    return t(props.compact ? 'tiny-pagination.compactRowRange' : 'tiny-pagination.rowRange', locales, props.totalRows)
  }

  const locales = { numberOfPages: n(numberOfPages.value) }

  return t('tiny-pagination.total', locales, props.totalRows)
})

function applyPageForm(): void {
  const { value } = currentPageInput
  if (!isNaN(value as number)) {
    modelValue.value = +value
  }
}

function applyRowForm(): void {
  const { value } = currentRowInput
  if (!isNaN(value as number)) {
    currentPageInput.value = Math.floor(+value / +props.perPage) + 1
    currentRowInput.value = +props.perPage * (+currentPageInput.value - 1) + 1
    modelValue.value = +currentPageInput.value
  }
}

function applyNextPage(): void {
  modelValue.value = pageValue.value + 1
}

function applyPreviousPage(): void {
  modelValue.value = pageValue.value - 1
}

function applyFirstPage(): void {
  modelValue.value = 1
}

function applyLastPage(): void {
  modelValue.value = numberOfPages.value
}
</script>

<style lang="scss" scoped>

.tiny-pagination {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: nowrap;
  flex-wrap: nowrap;
  max-width: 100%;

  &__nav {
    padding-left: 0.25em;
    padding-right: 0.25em;
    color: var(--bs-body-color);

    &:hover {
      color: var(--bs-link-hover-color);
    }
  }

  &--block {
    display: flex;
  }

  &--sm {
    font-size: $font-size-sm;
  }

  &--lg {
    font-size: $font-size-lg;
  }

  &--no-nav &__nav {
    display: none;
  }

  &--compact &__nav--bound,
  &--no-nav-bounds &__nav--bound {
    display: none;
  }

  &--no-nav &__form {
    margin: 0;
  }

  &--compact &__nav {
    order: 0;
  }

  &--compact &__form {
    order: 10;
  }

  &__form {
    margin: 0 $spacer * 0.25;
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    min-width: 0;

    &__input {
      padding-left: 0.5em;
      padding-right: 0.5em;
      text-align: center;

      &[type='number'] {
        -moz-appearance: textfield;

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      }
    }

    &__label {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
