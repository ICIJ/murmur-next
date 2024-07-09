<template>
  <div class="tiny-pagination" :class="paginationClassList">
    <b-button
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
        <phosphor-icon :name="firstPageIcon" />
        <span class="visually-hidden">{{ t('tiny-pagination.first') }}</span>
      </slot>
    </b-button>
    <b-button
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
        <phosphor-icon :name="previousPageIcon" />
        <span class="visually-hidden">{{ t('tiny-pagination.previous') }}</span>
      </slot>
    </b-button>
    <form class="tiny-pagination__form form-inline" v-if="row" @submit.prevent="applyRowForm">
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
      <div class="tiny-pagination__form__label">
        <!-- @slot Compact display number of rows and current range -->
        <slot v-if="compact" name="compact-number-of-rows" v-bind="{ modelValue, numberOfPages, totalRows }">
          {{ t('tiny-pagination.compactRowRange', { lastRangeRow: n(lastRangeRow), totalRows: n(totalRows) }, totalRows) }}
        </slot>
        <!-- @slot Display number of rows and current range -->
        <slot v-else name="number-of-rows" v-bind="{ modelValue, numberOfPages, totalRows }">
          {{ t('tiny-pagination.rowRange', { lastRangeRow: n(lastRangeRow), totalRows: n(totalRows) }, totalRows) }}
        </slot>
      </div>
    </form>
    <form v-else class="tiny-pagination__form form-inline" @submit.prevent="applyPageForm">
      <label v-show="!compact" class="tiny-pagination__form__label me-1 mb-0">
        <!-- @slot Display page label -->
        <slot name="page" v-bind="{ modelValue, numberOfPages }">
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
        :aria-label="t('tiny-pagination.aria')"
      />
      <div class="tiny-pagination__form__label">
        <!-- @slot Display number of pages -->
        <slot name="number-of-pages" v-bind="{ modelValue, numberOfPages }">
          {{ t('tiny-pagination.total', { numberOfPages: n(numberOfPages) }) }}
        </slot>
      </div>
    </form>
    <b-button
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
        <phosphor-icon :name="nextPageIcon" />
        <span class="visually-hidden">{{ t('tiny-pagination.next') }}</span>
      </slot>
    </b-button>
    <b-button
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
        <phosphor-icon :name="lastPageIcon" />
        <span class="visually-hidden">{{ t('tiny-pagination.last') }}</span>
      </slot>
    </b-button>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { Size } from '@/enums'
import { ButtonVariant, BFormInput, BButton } from 'bootstrap-vue-next'
import { directive as vInputAutowidth } from "vue-input-autowidth"

import PhosphorIcon from './PhosphorIcon.vue'


const props = defineProps({
  /**
   * Total items to be stored in pages
   */
  totalRows: {
    type: Number,
    default: 0
  },
  /**
   * Sets the quantity of items per page
   */
  perPage: {
    type: Number,
    default: 20
  },
  /**
   * Grabs and syncs the currentPage variable passed down from the parent in v-model
   */
  modelValue: {
    type: [Number, String],
    default: 1
  },
  /**
   * Use an input to set the row number
   */
  row: {
    type: Boolean
  },
  /**
   * Set the size of the input: 'sm', 'md' (default), or 'lg'.
   */
  size: {
    type: String as PropType<Size>,
    default: Size.md,
    validator: (value: Size) => Object.values(Size).includes(value)
  },
  /**
   * (Optional) Number of page. Property `size` is required for this to work
   * properly. If `pages` is empty, it will be calculated using the size.
   */
  pages: {
    type: [Number, String],
    default: null
  },
  /**
   * Hide navigation buttons (next and previous)
   */
  noNav: {
    type: Boolean
  },
  /**
   * Hide bounds navigation buttons (first and last)
   */
  noNavBounds: {
    type: Boolean
  },
  /**
   * Phosphor icon of the previous page button
   */
  previousPageIcon: {
    type: String,
    default: 'caret-left'
  },
  /**
   * Phosphor icon of the next page button
   */
  nextPageIcon: {
    type: String,
    default: 'caret-right'
  },
  /**
   * Phosphor icon of the first page button
   */
  firstPageIcon: {
    type: String,
    default: 'caret-double-left'
  },
  /**
   * Phosphor icon of the last page button
   */
  lastPageIcon: {
    type: String,
    default: 'caret-double-right'
  },
  /**
   * Navigation button variants
   */
  navVariant: {
    type: String as PropType<ButtonVariant>,
    default: 'link'
  },
  /**
   * Display pagination as a block (full width)
   */
  block: {
    type: Boolean
  },
  /**
   * Compact mode with a grouped nav
   */
  compact: {
    type: Boolean
  }
})

const emit = defineEmits(['update:modelValue'])
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

const pageValue = computed(() => +props.modelValue)
const lastRangeRow = computed(() => +pageValue.value * props.perPage)

const currentPageInput = ref<number>(0)
const currentRowInput = ref<number>(0)

watch(() => props.modelValue, (value) => {
  currentPageInput.value = props.totalRows ? +value : 0
  currentRowInput.value = props.totalRows ? +props.perPage * (+value - 1) + 1 : 0
}, { immediate: true })

function applyPageForm(): void {
  const { value } = currentPageInput
  if (!isNaN(value as number)) {
    emit('update:modelValue', +value)
  }
}

function applyRowForm(): void {
  const { value } = currentRowInput
  if (!isNaN(value as number)) {
    currentPageInput.value = Math.floor(+value / +props.perPage) + 1
    currentRowInput.value = +props.perPage * (+currentPageInput.value - 1) + 1
    emit('update:modelValue', +currentPageInput.value)
  }
}

function applyNextPage(): void {
  emit('update:modelValue', pageValue.value + 1)
}

function applyPreviousPage(): void {
  emit('update:modelValue', pageValue.value - 1)
}

function applyFirstPage(): void {
  emit('update:modelValue', 1)
}

function applyLastPage(): void {
  emit('update:modelValue', numberOfPages.value)
}
</script>

<style lang="scss" scoped>
@import '../styles/lib';

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
