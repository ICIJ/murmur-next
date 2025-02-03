<script lang="ts">
import { BButton, BTooltip, PopoverPlacement, ButtonVariant } from 'bootstrap-vue-next'

import noop from 'lodash/noop'
import uniqueId from 'lodash/uniqueId'
import {
  ComponentPublicInstance,
  computed,
  defineComponent,
  nextTick,
  onUnmounted,
  PropType,
  ref
} from 'vue'
import { TranslateResult, useI18n } from 'vue-i18n'

import PhosphorIcon from './PhosphorIcon.vue'
import PhosphorIconLayers from './PhosphorIconLayers.vue'

import { copyHtml, copyText } from '@/utils/clipboard'

type HapticCopyData = {
  mounted: boolean
  succeed: boolean
  tooltipContent: TranslateResult | string
  tooltipTimeout: ReturnType<typeof setTimeout> | undefined
}

export default defineComponent({
  name: 'HapticCopy',
  components: {
    BButton,
    BTooltip,
    PhosphorIcon,
    PhosphorIconLayers
  },
  props: {
    /**
     * Text to copy to the clipboard
     */
    text: {
      type: [String, Number],
      default: null
    },
    /**
     * Plain text to use as an alternative text for HTML copy (uses `text` by default)
     */
    plain: {
      type: String,
      default: null
    },
    /**
     * Hide the button label (still visible for screen reader)
     */
    hideLabel: {
      type: Boolean
    },
    /**
     * Button label
     */
    label: {
      type: String,
      default: null
    },
    /**
     * Delay after which we hide the tooltip
     */
    tooltipHideDelay: {
      type: Number,
      default: 1e3
    },
    /**
     * Placement of the tooltip. Can be: top, topleft, topright, right,<br />
     * righttop, rightbottom, bottom, bottomleft, bottomright, left, lefttop,
     * and leftbottom.
     */
    tooltipPlacement: {
      type: String as PropType<PopoverPlacement>,
      default: 'top'
    },
    /**
     * Copy HTML content
     */
    html: {
      type: Boolean
    },
    /**
     * Deactivate haptic tooltip display
     */
    noTooltip: {
      type: Boolean
    },
    /**
     * Button variant
     */
    variant: {
      type: String as PropType<ButtonVariant>,
      default: 'primary'
    }
  },
  emits: ['attempt', 'success', 'error', 'hideClipboardTooltip'],
  setup(props, { emit, expose }) {
    const { t, te } = useI18n()
    const tooltip = ref<ComponentPublicInstance | null>(null)
    const el = ref<ComponentPublicInstance<HTMLElement> | null>(null)
    const tooltipContent = ref<string>('')
    const tooltipTimeout = ref<NodeJS.Timeout | undefined>(undefined)
    const showClipboardTooltip = ref(false)
    const buttonId = computed(() => uniqueId('haptic-copy-'))

    function copyTextToClipboard(): Promise<void> {
      return el.value ? copyText(String(props.text), el.value.$el) : Promise.resolve()
    }

    function copyHtmlToClipboard(): void {
      return copyHtml(String(props.text), String(props.plain ?? props.text))
    }

    function copyTextOrHtml() {
      return props.html ? copyHtmlToClipboard() : copyTextToClipboard()
    }

    async function copy(): Promise<void> {
      try {
        /**
         * Emitted when an attempt to copy text is made
         *
         * @event attempt
         */
        emit('attempt')
        // Use clipboard.js internally
        await copyTextOrHtml()
        // Then option the tooltip in case of success
        await openTooltip('haptic-copy.tooltip.succeed')
        /**
         * Emitted when the text has been copied successfully
         *
         * @event success
         */
        emit('success')
      } catch (error) {
        await openTooltip('haptic-copy.tooltip.failed')
        /**
         * Emitted when the text couldn't be copied
         *
         * @event error
         */
        emit('error', error)
      }
      // And close the tooltip after a short delay
      return nextTimeout(closeTooltip, props.tooltipHideDelay)
    }

    function getTooltipContent(msg: string) {
      return te(msg) ? t(msg) : msg
    }

    async function openTooltip(msg = 'haptic-copy.tooltip.succeed') {
      tooltipContent.value = getTooltipContent(msg)
      showClipboardTooltip.value = true
    }

    async function closeTooltip() {
      showClipboardTooltip.value = false
      tooltipTimeout.value = undefined
      emit('hideClipboardTooltip')
    }

    function nextTimeout(fn = noop, delay = 0) {
      clearTimeout(tooltipTimeout.value)
      return new Promise((resolve) => {
        tooltipTimeout.value = setTimeout(resolve, delay)
      })
        .finally(nextTick)
        .then(fn)
    }

    onUnmounted(() => {
      closeTooltip()
    })

    expose({
      hide: closeTooltip
    })

    return {
      t,
      tooltip,
      el,
      buttonId,
      showClipboardTooltip,
      tooltipContent,
      tooltipTimeout,
      copy,
      closeTooltip,
      openTooltip,
      nextTimeout
    }
  }
})
</script>

<template>
  <b-button
    :id="buttonId"
    ref="el"
    class="haptic-copy"
    :variant="variant"
    @mouseleave="closeTooltip"
    @click.stop="copy"
  >
    <!-- @slot Main content of the button (including the icon) -->
    <slot>
      <phosphor-icon-layers>
        <transition name="spin">
          <phosphor-icon
            v-if="!tooltipTimeout"
            class="haptic-copy__icon"
            name="clipboard"
          />
        </transition>
        <transition name="spin">
          <phosphor-icon
            v-if="tooltipTimeout"
            class="haptic-copy__icon"
            name="check-fat"
            weight="fill"
          />
        </transition>
      </phosphor-icon-layers>
      <span :class="{ 'sr-only': hideLabel }" class="ms-2 haptic-copy__label">
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
  </b-button>
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
