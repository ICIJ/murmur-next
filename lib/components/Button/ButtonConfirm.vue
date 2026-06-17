<template>
  <component
    :is="tag"
    :id="uniqComponentId"
    class="confirm-button"
    @click.stop="toggle"
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
          <app-icon
            size="0.75em"
            variant="action"
          >
            <i-ph-x />
          </app-icon>
        </button>
        <p class="confirm-button__tooltip__label mb-2">
          {{ label }}
        </p>
        <p
          v-if="description"
          class="confirm-button__tooltip__description mb-2"
        >
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
import { BTooltip } from 'bootstrap-vue-next'
import type { PopoverPlacement } from 'bootstrap-vue-next'
import { ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'

import AppIcon from '@/components/App/AppIcon.vue'
import { useConfirmButton } from '@/composables/useConfirmButton'

/**
 * ConfirmButton
 */
defineOptions({
  name: 'ConfirmButton'
})

export interface ButtonConfirmProps {
  /**
   * Confirmation message visible in the tooltip upon user's click
   */
  label?: string
  /**
   * A description text to show under the confirmation label
   */
  description?: string | null
  /**
   * Disable the closing button
   */
  noCloseButton?: boolean
  /**
   * The confirmation callback
   */
  confirmed?: () => void
  /**
   * The cancellation callback
   */
  cancelled?: () => void
  /**
   * Label for 'Yes' button
   */
  yes?: string
  /**
   * Label for 'No' button
   */
  no?: string
  /**
   * Tooltip position
   */
  placement?: PopoverPlacement
  /**
   * HTML tag to render this component to.
   */
  tag?: string
}

const props = withDefaults(defineProps<ButtonConfirmProps>(), {
  label: 'Are you sure?',
  description: null,
  noCloseButton: false,
  confirmed: noop,
  cancelled: noop,
  yes: 'Yes',
  no: 'No',
  placement: 'top',
  tag: 'button'
})

/**
 * @event toggled Emitted when the confirmation tooltip is toggled. Payload is
 *   `true` when the tooltip becomes visible.
 * @event cancelled Emitted when the confirmation is cancelled.
 * @event confirmed Emitted when the confirmation is confirmed.
 */
const emit = defineEmits(['toggled', 'cancelled', 'confirmed'])

const uniqComponentId = uniqueId('murmur-confirm-button-')
const confirmationTooltip = ref<ComponentPublicInstance | null>(null)

// The confirmation lifecycle (show/hide state plus cancel/confirm handlers) is
// owned by the composable; the callback props are forwarded so they still run.
const { showTooltip, toggle, cancel, confirm } = useConfirmButton(emit, {
  onConfirmed: () => props.confirmed?.(),
  onCancelled: () => props.cancelled?.()
})
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
