<template>
  <div class="tiny-pagination" :class="paginationClassList">
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
        <fa :icon="previousPageIcon" />
        <span class="sr-only">{{ t('tiny-pagination.previous') }}</span>
      </slot>
    </b-button>
    <form
      class="tiny-pagination__form form-inline"
      @submit.prevent="applyPageForm"
    >
      <label v-show="!compact" class="tiny-pagination__form__label me-1 mb-0">
        <!-- @slot Display page label -->
        <slot name="page" v-bind="{ modelValue, numberOfPages }">
          {{ t('tiny-pagination.page') }}
        </slot>
      </label>
      <b-form-input
        v-model="currentPageInput"
        :size="size"
        class="tiny-pagination__form__input me-1"
        type="number"
        step="1"
        :min="1"
        :max="numberOfPages"
        :aria-label="t('tiny-pagination.aria')"
      />
      <!-- @slot Display number of pages -->
      <slot name="number-of-pages" v-bind="{ modelValue, numberOfPages }">
        {{ t('tiny-pagination.total', { numberOfPages }) }}
      </slot>
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
        <fa :icon="nextPageIcon" />
        <span class="sr-only">{{ t('tiny-pagination.next') }}</span>
      </slot>
    </b-button>
  </div>
</template>

<script lang="ts">
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import {
  defineComponent,
  PropType,
  ref,
  computed,
  watch,
  onBeforeMount
} from 'vue'
import { useI18n } from 'vue-i18n'

import { library, default as Fa } from './Fa'

import { Size } from '@/enums'
import { ButtonVariant, BFormInput, BButton } from 'bootstrap-vue-next'

export default defineComponent({
  name: 'TinyPagination',
  components: {
    Fa,
    BFormInput,
    BButton
  },
  props: {
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
     * FontAwesome icon of the previous page button
     */
    previousPageIcon: {
      type: [String, Array, Object],
      default: 'angle-left'
    },
    /**
     * FontAwesome icon of the next page button
     */
    nextPageIcon: {
      type: [String, Array, Object],
      default: 'angle-right'
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
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    onBeforeMount(() => {
      library.add(faAngleLeft, faAngleRight)
    })

    const { t } = useI18n()
    const pageValue = computed(() => {
      return +props.modelValue
    })
    const currentPageInput = ref<number | string>(pageValue.value)
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
        [`tiny-pagination--block`]: props.block,
        [`tiny-pagination--compact`]: props.compact
      }
    })
    const hasPrevious = computed((): boolean => {
      return pageValue.value > 1
    })
    const hasNext = computed((): boolean => {
      return pageValue.value < numberOfPages.value
    })
    function applyPageForm(): void {
      if (!isNaN(currentPageInput.value as number)) {
        emit('update:modelValue', +currentPageInput.value)
      }
    }

    function applyNextPage(): void {
      emit('update:modelValue', pageValue.value - 1)
    }
    function applyPreviousPage(): void {
      emit('update:modelValue', pageValue.value + 1)
    }
    return {
      t,
      currentPageInput,
      paginationClassList,
      numberOfPages,
      hasPrevious,
      hasNext,
      applyPreviousPage,
      applyNextPage,
      applyPageForm
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../styles/lib';

.tiny-pagination {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;

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
    align-items: center;
    justify-content: center;

    &__input {
      max-width: 2.5rem;
      padding-left: 0.2rem;
      padding-right: 0.2rem;
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
  }
}
</style>
