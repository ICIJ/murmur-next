<script setup lang="ts">
import { BButton, BTooltip, PopoverPlacement, ButtonVariant } from 'bootstrap-vue-next'
import uniqueId from 'lodash/uniqueId'
import {
  ComponentPublicInstance,
  computed,
  ref,
  type Component
} from 'vue'
import { useI18n } from 'vue-i18n'

import AppIcon from '@/components/App/AppIcon.vue'
import AppIconLayers from '@/components/App/AppIconLayers.vue'

import { useHapticCopy } from '@/composables/useHapticCopy'
import { copyHtml, copyText } from '@/utils/clipboard'
import IPhCheckFatFill from '~icons/ph/check-fat-fill'
import IPhClipboard from '~icons/ph/clipboard'

export interface HapticCopyProps {
  /**
   * HTML tag or component to render
   */
  tag?: string | Component
  /**
   * Text to copy to the clipboard
   */
  text?: string | number | null
  /**
   * Plain text to use as an alternative text for HTML copy (uses `text` by default)
   */
  plain?: string | null
  /**
   * Hide the button label (still visible for screen reader)
   */
  hideLabel?: boolean
  /**
   * Button label
   */
  label?: string | null
  /**
   * Delay after which we hide the tooltip
   */
  tooltipHideDelay?: number
  /**
   * Placement of the tooltip. Can be: top, topleft, topright, right,
   * righttop, rightbottom, bottom, bottomleft, bottomright, left, lefttop,
   * and leftbottom.
   */
  tooltipPlacement?: PopoverPlacement
  /**
   * Copy HTML content
   */
  html?: boolean
  /**
   * Deactivate haptic tooltip display
   */
  noTooltip?: boolean
  /**
   * Button variant
   */
  variant?: ButtonVariant
}

const props = withDefaults(defineProps<HapticCopyProps>(), {
  tag: () => BButton,
  text: null,
  plain: null,
  hideLabel: false,
  label: null,
  tooltipHideDelay: 1e3,
  tooltipPlacement: 'top',
  html: false,
  noTooltip: false,
  variant: 'primary'
})

const emit = defineEmits(['attempt', 'success', 'error', 'hideClipboardTooltip'])

const { t, te } = useI18n()
const tooltip = ref<ComponentPublicInstance | null>(null)
const el = ref<ComponentPublicInstance<HTMLElement> | null>(null)
const buttonId = computed(() => uniqueId('haptic-copy-'))
const buttonBinding = computed(() => {
  if (props.tag?.props?.['variant']) {
    return { variant: props.variant }
  }
  return { }
})

// Use clipboard.js internally, copying either rich HTML or plain text.
function copyTextOrHtml(): void | Promise<void> {
  if (props.html) {
    return copyHtml(String(props.text), String(props.plain ?? props.text))
  }
  return el.value ? copyText(String(props.text), el.value.$el) : Promise.resolve()
}

// Resolve a known i18n key to its translation, leaving arbitrary strings as-is.
function resolveTooltipMessage(message: string): string {
  return te(message) ? t(message) : message
}

const {
  tooltipContent,
  showTooltip: showClipboardTooltip,
  tooltipTimeout,
  copy,
  openTooltip,
  closeTooltip,
  nextTimeout
} = useHapticCopy({
  copy: copyTextOrHtml,
  resolveMessage: resolveTooltipMessage,
  hideDelay: () => props.tooltipHideDelay,
  /**
   * Emitted when an attempt to copy text is made
   *
   * @event attempt
   */
  onAttempt: () => emit('attempt'),
  /**
   * Emitted when the text has been copied successfully
   *
   * @event success
   */
  onSuccess: () => emit('success'),
  /**
   * Emitted when the text couldn't be copied
   *
   * @event error
   */
  onError: error => emit('error', error),
  onHide: () => emit('hideClipboardTooltip')
})

defineExpose({
  hide: closeTooltip,
  copy,
  openTooltip,
  closeTooltip,
  nextTimeout,
  tooltipContent
})
</script>

<template>
  <component
    :is="tag"
    :id="buttonId"
    ref="el"
    v-bind="buttonBinding"
    class="haptic-copy"
    @mouseleave="closeTooltip"
    @click.stop="copy"
  >
    <!-- @slot Main content of the button (including the icon) -->
    <slot>
      <app-icon-layers>
        <transition name="spin">
          <app-icon
            v-if="!tooltipTimeout"
            class="haptic-copy__icon"
          >
            <i-ph-clipboard />
          </app-icon>
        </transition>
        <transition name="spin">
          <app-icon
            v-if="tooltipTimeout"
            class="haptic-copy__icon"
          >
            <i-ph-check-fat-fill />
          </app-icon>
        </transition>
      </app-icon-layers>
      <span
        :class="{ 'visually-hidden': hideLabel }"
        class="ms-2 haptic-copy__label"
      >
        {{ label || t('haptic-copy.label') }}
      </span>
    </slot>
    <b-tooltip
      v-if="!noTooltip"
      ref="tooltip"
      :model-value="showClipboardTooltip"
      :placement="tooltipPlacement"
      :target="buttonId"
      teleport-to="body"
      manual
      noninteractive
    >
      {{ tooltipContent }}
    </b-tooltip>
  </component>
</template>
<style lang="scss">
.haptic-copy {
  &__icon {
    transform: rotate(0deg) translate(-50%, -50%);

    &.spin-enter-active,
    &.spin-leave-active {
      transition: all 500ms;
    }

    &.spin-enter-from {
      transform: rotate(-180deg) translate(-50%, -50%);
      opacity: 0;
    }

    &.spin-leave-to {
      transform: rotate(180deg) translate(-50%, -50%);
      opacity: 0;
    }
  }
}
</style>
