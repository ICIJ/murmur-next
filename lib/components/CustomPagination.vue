<script lang="ts">
import { computed, defineComponent, ref, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

import { Size } from '@/enums'
import { BPagination } from 'bootstrap-vue-next'

export default defineComponent({
  name: 'CustomPagination',
  components: { BPagination },
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
      type: Number,
      default: 1
    },
    /**
     * Displays the pagination element in pills styling as opposed to the default boxes
     */
    pills: {
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
     * Compact layout
     */
    compact: {
      type: Boolean
    },
    /**
     * (Optional) Number of page. Property `size` is required for this to work
     * properly. If `pages` is empty, it will be calculated using the size.
     */
    pages: {
      type: [Number, String],
      default: null
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const customPaginationForm = ref<HTMLFormElement | null>(null)
    const currentPageInput = ref('')
    const invalidNumberError = t('custom-pagination.invalid-number-error')
    const errors = ref<string[]>([])
    const inputPlaceholder = computed((): string => {
      const compact = props.compact ? 'compact-' : ''
      return t(`custom-pagination.${compact}placeholder`) as string
    })
    const numberOfPages = computed((): number => {
      if (props.pages === null) {
        return Math.ceil(props.totalRows / props.perPage)
      }
      return Number(props.pages)
    })
    const paginationClassList = computed((): string[] => {
      return props.size === Size.sm ? ['float-end', 'me-1'] : []
    })

    function applyJumpFormPage(): void {
      const number = isNaN(parseInt(currentPageInput.value))
        ? 0
        : parseInt(currentPageInput.value)
      errors.value = []
      if (number > numberOfPages.value || number < 1) {
        errors.value.push(invalidNumberError)
      }
      if (errors.value.length === 0) {
        updateModelValue(parseInt(currentPageInput.value))
      }
    }

    function updateModelValue(value: string | number): void {
      emit('update:modelValue', value)
    }

    return {
      customPaginationForm,
      currentPageInput,
      errors,
      inputPlaceholder,
      numberOfPages,
      paginationClassList,
      t,
      applyJumpFormPage,
      updateModelValue
    }
  }
})
</script>

<template>
  <div
    class="custom-pagination container-fluid"
    :class="{
      'custom-pagination--compact': compact,
      'custom-pagination--pills': pills
    }"
  >
    <div
      class="row justify-content-center align-items-stretch"
      :class="{ 'no-gutters': compact && !pills }"
    >
      <div class="col-auto custom-pagination__pages">
        <b-pagination
          :total-rows="perPage * numberOfPages"
          :per-page="perPage"
          :model-value="modelValue"
          :pills="pills"
          :class="paginationClassList"
          :size="size"
          class="m-0"
          first-number
          last-number
          @update:modelValue="updateModelValue"
        >
          <template #prev-text="{ disabled, index, page }">
            <!-- @slot The 'Go to previous page' button content -->
            <slot name="prev-text" v-bind="{ disabled, index, page }" />
          </template>
          <template #next-text="{ disabled, index, page }">
            <!-- @slot The 'Go to next page' button content -->
            <slot name="next-text" v-bind="{ disabled, index, page }" />
          </template>
          <template #page="{ active, content, disabled, index, page }">
            <!-- @slot Page number button content -->
            <slot
              name="page"
              v-bind="{ active, content, disabled, index, page }"
            />
          </template>
          <template #ellipsis-text>
            <!-- @slot The '...' indicator content. Overrides the `ellipsis-text` prop -->
            <slot name="ellipsis-text" />
          </template>
        </b-pagination>
      </div>
      <div class="col-auto">
        <div class="custom-pagination__form">
          <form
            ref="customPaginationForm"
            class="input-group"
            @submit.prevent="applyJumpFormPage"
          >
            <b-input-group :size="size">
              <input
                v-model="currentPageInput"
                type="number"
                class="form-control"
                :placeholder="inputPlaceholder"
                aria-label="Jump to page"
              />
              <button  v-if="!compact" class="btn btn-secondary btn-sm" type="submit">
                <span class="px-1 py-3"> Go </span>
              </button>
            </b-input-group>
          </form>
          <template v-if="!compact">
            <small
              v-if="errors.length"
              id="invalid-number-error"
              class="float-start mt-1 ms-1 text-danger"
            >
              {{ errors[0] }}
            </small>
            <small v-else class="float-start mt-1 ms-1 text-muted">
              {{ t('custom-pagination.total-pages', { count: numberOfPages }) }}
            </small>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../styles/lib';

.custom-pagination {
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }

  &:not(.custom-pagination--compact) &__pages {
    border-right: 1px solid $border-color;
  }

  &--compact &__pages:deep(.page-item:last-of-type .page-link) {
    border-right: 0;
    border-radius: 0;
  }

  &--compact &__form {
    max-width: 105px;

    &,
    & > .input-group {
      height: 100%;
    }
  }

  &--compact &__form input {
    height: 100%;
  }

  &--compact > .row {
    align-items: center;
  }
}
</style>
