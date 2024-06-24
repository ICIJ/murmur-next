<template>
  <component
    :is="tag"
    :id="uniqComponentId"
    class="confirm-button"
    @click.stop="toggleConfirmationTooltip"
  >
    <!-- @slot Main content of the button -->
    <slot>-</slot>
    <b-tooltip
      ref="confirmationTooltip"
      :model-value="showTooltip"
      :placement="placement"
      :target="uniqComponentId"
      teleport-to="body"
      manual
    >
      <div class="confirm-button__tooltip">
        <button
          v-if="!noCloseButton"
          class="confirm-button__tooltip__cancel btn btn-sm btn-link text-light p-0 float-end"
          @click="cancel"
        >
          <fa icon="times" />
        </button>
        <p class="confirm-button__tooltip__label mb-2">
          {{ label }}
        </p>
        <p v-if="description" class="confirm-button__tooltip__description mb-2">
          {{ description }}
        </p>
        <div class="confirm-button__tooltip__actions text-end">
          <button
            class="confirm-button__tooltip__actions__cancel btn btn-sm btn-link text-light"
            @click="cancel"
          >
            {{ no }}
          </button>
          <button
            class="confirm-button__tooltip__actions__confirm btn btn-sm btn-link text-light fw-bold"
            @click="confirm"
          >
            {{ yes }}
          </button>
        </div>
      </div>
    </b-tooltip>
  </component>
</template>

<script lang="ts">
import noop from 'lodash/noop'
import uniqueId from 'lodash/uniqueId'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { BTooltip, PopoverPlacement } from 'bootstrap-vue-next'
import { ComponentPublicInstance, defineComponent, PropType, ref, onBeforeMount } from 'vue'

import { default as Fa, library } from './Fa'

/**
 * ConfirmButton
 */
export default defineComponent({
  name: 'ConfirmButton',
  components: {
    BTooltip,
    Fa
  },
  props: {
    /**
     * Confirmation message visible in the tooltip upon user's click
     */
    label: {
      type: String,
      default: 'Are you sure?'
    },
    /**
     * A description text to show under the confirmation label
     */
    description: {
      type: String,
      default: null
    },
    /**
     * Disable the closing button
     */
    noCloseButton: {
      type: Boolean
    },
    /**
     * The confirmation callback
     */
    confirmed: {
      type: Function,
      default: noop
    },
    /**
     * The cancellation callback
     */
    cancelled: {
      type: Function,
      default: noop
    },
    /**
     * Label for 'Yes' button
     */
    yes: {
      type: String,
      default: 'Yes'
    },
    /**
     * Label for 'No' button
     */
    no: {
      type: String,
      default: 'No'
    },
    /**
     * Tooltip position
     */
    placement: {
      type: String as PropType<PopoverPlacement>,
      default: 'top'
    },
    /**
     * HTML tag to render this component to.
     */
    tag: {
      type: String,
      default: 'button'
    }
  },
  emits: ['toggled', 'cancelled', 'confirmed'],
  setup(props, { emit }) {
    onBeforeMount(() => {
      library.add(faTimes)
    })
    const showTooltip = ref<Boolean>(false)
    const uniqComponentId = uniqueId('murmur-confirm-button-')
    const confirmationTooltip = ref<ComponentPublicInstance | null>(null)

    function toggleConfirmationTooltip(): void {
      showTooltip.value = !showTooltip.value
      /**
       * Emitted when the confirmation is toggled.
       * @event toggled
       * @param Boolean True if the button is shown.
       */
      emit('toggled', showTooltip.value)
    }

    function hideConfirmationTooltip(): void {
      showTooltip.value = false
      /**
       * Emitted when the confirmation is toggled.
       * @event toggled
       * @param Boolean True if the button is shown.
       */
      emit('toggled', false)
    }

    function cancel(): void {
      hideConfirmationTooltip()
      props.cancelled?.()
      /**
       * Emitted when the confirmation is cancelled.
       * @event cancelled
       */
      emit('cancelled')
    }

    function confirm(): void {
      hideConfirmationTooltip()
      props.confirmed?.()
      /**
       * Emitted when the confirmation is confirmed.
       * @event confirmed
       */
      emit('confirmed')
    }

    return {
      showTooltip,
      uniqComponentId,
      cancel,
      confirm,
      confirmationTooltip,
      toggleConfirmationTooltip
    }
  }
})
</script>

<style lang="scss">
@import '../styles/lib';

.confirm-button {
  &__tooltip {
    min-width: calc(#{$tooltip-max-width} - #{$tooltip-padding-x * 2});
    text-align: left;

    &__label,
    &__cancel {
      font-weight: bold;
      font-size: 1.2em;
    }

    &__actions {
      margin-bottom: $tooltip-padding-x - $tooltip-padding-y;

      &__confirm,
      &__cancel {
        text-transform: uppercase;
      }
    }
  }
}
</style>
