<script lang="ts">
import { FontAwesomeLayers } from '@fortawesome/vue-fontawesome'
import { faClipboard } from '@fortawesome/free-solid-svg-icons/faClipboard'
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons/faClipboardCheck'
import {BTooltip, PopoverPlacement} from 'bootstrap-vue-next'

import noop from 'lodash/noop'
import {
  ComponentPublicInstance,
  computed,
  defineComponent,
  onBeforeMount,
  nextTick,
  ref,
  PropType,
  onMounted, onUnmounted
} from 'vue'
import {TranslateResult, useI18n} from 'vue-i18n'

import { default as Fa, library } from './Fa'

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
    BTooltip,
    FontAwesomeLayers,
    Fa
  },
  props: {
    /**
     * Text to copy to the clipboard
     */
    text: {
      type: String,
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
    }
  },
  emits:['attempt','success', 'error','hideClipboardTooltip'],
  setup(props, {emit, expose}){
    const {t,te} = useI18n()
    const tooltip = ref<ComponentPublicInstance|null>(null)
    const el = ref<ComponentPublicInstance<HTMLElement>|null>(null)
    const tooltipContent = ref<string>('')
    const tooltipTimeout = ref<NodeJS.Timeout|undefined>(undefined)
    const showClipboardTooltip= ref(false)
    onBeforeMount(()=>{
        library.add(faClipboard)
        library.add(faClipboardCheck)
    })
    const tooltipContainer = computed((): string | null =>{
      // By default we append the tooltip in the root container using its
      // id (if any) because BootstrapVue doesn't like HTMLElement for some
      // reasons.

      return el.value?.id.length ? `#${el.value.id}` : null;
    })
    function copyTextToClipboard(): Promise<void> {
      return el.value? copyText(props.text, el.value) : Promise.resolve()
    }
    function copyHtmlToClipboard(): void {
      return copyHtml(props.text, props.plain || props.text)
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
      nextTimeout(closeTooltip, props.tooltipHideDelay)
    }
    function getTooltipContent(msg:string){
      return te(msg) ? t(msg) : msg
    }

    async function openTooltip(msg = 'haptic-copy.tooltip.succeed') {
      tooltipContent.value = getTooltipContent(msg)
      showClipboardTooltip.value=true
    }
    async function closeTooltip() {
      showClipboardTooltip.value=false
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

    onUnmounted(()=>{
      closeTooltip()
    })
    expose({
      hide: closeTooltip,
    })
    return {
      t,
      tooltip,
      el,
      showClipboardTooltip,
      tooltipContainer,
      tooltipContent,
      tooltipTimeout,
      copy,
      closeTooltip,
      nextTimeout,
    }
  },
})
</script>

<template>
    <button ref="el" id="hapticCopy" class="btn haptic-copy" @click.stop="copy" @mouseleave="closeTooltip"  >
      <!-- @slot Main content of the button (including the icon) -->
      <slot>
        <font-awesome-layers>
          <transition name="spin">
            <fa v-if="!tooltipTimeout" icon="clipboard" class="haptic-copy__icon" />
          </transition>
          <transition name="spin">
            <fa v-if="tooltipTimeout" icon="clipboard-check" class="haptic-copy__icon" />
          </transition>
        </font-awesome-layers>
        <span :class="{ 'sr-only': hideLabel }" class="ml-1 haptic-copy__label">
          {{ label || t('haptic-copy.label') }}
        </span>
      </slot>
      <b-tooltip
          v-if="!noTooltip"
          ref="tooltip"
          :placement="tooltipPlacement"
          target="hapticCopy"
          :model-value="showClipboardTooltip"
          noninteractive
          manual
      >
        {{ tooltipContent }}
      </b-tooltip>
    </button>

</template>
<style lang="scss">
.haptic-copy {
  &__icon {
    transform: rotate(0deg);

    &.spin-enter-active,
    &.spin-leave-active {
      transition: all 0.2s;
    }

    &.spin-enter-from {
      transform: rotate(-180deg);
      opacity: 0;
    }

    &.spin-leave-to {
      transform: rotate(180deg);
      opacity: 0;
    }
  }
}
</style>
