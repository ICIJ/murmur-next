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
          <phosphor-icon :name="PhX" size="0.75em" variant="action"/>
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

<script setup lang="ts">
import noop from 'lodash/noop'
import uniqueId from 'lodash/uniqueId'
import { BTooltip, PopoverPlacement} from 'bootstrap-vue-next'
import { ComponentPublicInstance, PropType, ref } from 'vue'

import PhosphorIcon from './PhosphorIcon.vue'
import {PhX} from "@phosphor-icons/vue";

/**
 * ConfirmButton
 */
defineOptions({
  name: 'ConfirmButton'
})

const props = defineProps({
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
})

const emit = defineEmits(['toggled', 'cancelled', 'confirmed'])

const showTooltip = ref<boolean>(false)
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
</script>

<style lang="scss">


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
