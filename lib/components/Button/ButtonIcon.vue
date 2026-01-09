<template>
  <b-button
    v-bind="buttonProps"
    :id="buttonId"
    ref="element"
    :to="to"
    class="button-icon"
    :class="classList"
    :aria-label="tooltipText"
    @mousenter="currentHover = true"
    @mouseleave="currentHover = false"
  >
    <slot name="start" />
    <app-icon
      v-if="iconLeft || (!iconLeft && !iconRight && loading)"
      v-b-tooltip.top.body="{ title: iconLeftLabel, offset: iconLeftLabelOffset, delay: tooltipDelay }"
      :name="iconLeftOrSpinner"
      :size="iconLeftSize"
      :spin="loading"
      :spin-duration="loadingDuration"
      :variant="iconLeftVariant"
      :hover-variant="iconLeftHoverVariant"
      :hover="currentHover"
      class="button-icon__icon-left"
    />
    <span
      v-if="!hideLabel"
      class="button-icon__label"
    >
      <slot v-bind="{ labelOrLoadingText }">{{ labelOrLoadingText }}</slot>
    </span>
    <app-icon
      v-if="iconRight"
      v-b-tooltip.top.body="{ title: iconRightLabel, offset: iconRightLabelOffset, delay: tooltipDelay }"
      :name="iconRightOrSpinner"
      :size="iconRightSize"
      :spin="loading"
      :spin-duration="loadingDuration"
      :variant="iconRightVariant"
      :hover-variant="iconRightHoverVariant"
      :hover="currentHover"
      class="button-icon__icon-right"
      @click="click('icon-right')"
    />
    <button-icon-counter
      v-if="counter !== null"
      :counter="counter"
      :variant="counterVariant"
      :style="counterStyle"
    />
    <slot name="end" />
    <b-tooltip
      v-if="hasTooltip"
      teleport-to="body"
      :delay="tooltipDelay"
      :boundary-padding="20"
      :placement="tooltipPlacement"
      :target="elementRef"
      :title="tooltipText"
    />
  </b-button>
</template>

<script setup lang="ts">
import { computed, ref, inject, useTemplateRef, type Component } from 'vue'
import { uniqueId } from 'lodash'
import IPhCircleNotch from '~icons/ph/circle-notch'
import type { TextColorVariant, ButtonVariant, PopoverPlacement, Size } from 'bootstrap-vue-next'

import { AppIcon, ButtonIconCounter } from '@/components'

const injectedVariant = inject('variant', 'action')
const injectedSize = inject('size', 'md')
const elementRef = useTemplateRef<HTMLElement>('element')

defineOptions({
  name: 'ButtonIcon'
})

export interface ButtonIconProps {
  /**
   * Custom ID for the button element
   */
  id?: string
  /**
   * Icon component or name to display on the left side
   */
  iconLeft?: string | Component
  /**
   * Color variant for the left icon
   */
  iconLeftVariant?: TextColorVariant
  /**
   * Color variant for the left icon on hover
   */
  iconLeftHoverVariant?: TextColorVariant
  /**
   * Size of the left icon. Can be a preset ('2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl') or a CSS value (e.g., '16px', '1rem').
   */
  iconLeftSize?: string
  /**
   * Tooltip label for the left icon
   */
  iconLeftLabel?: string
  /**
   * Offset for the left icon tooltip
   */
  iconLeftLabelOffset?: number
  /**
   * Icon component or name to display on the right side
   */
  iconRight?: string | Component
  /**
   * Color variant for the right icon
   */
  iconRightVariant?: TextColorVariant
  /**
   * Color variant for the right icon on hover
   */
  iconRightHoverVariant?: TextColorVariant
  /**
   * Size of the right icon. Can be a preset ('2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl') or a CSS value (e.g., '16px', '1rem').
   */
  iconRightSize?: string
  /**
   * Tooltip label for the right icon
   */
  iconRightLabel?: string
  /**
   * Offset for the right icon tooltip
   */
  iconRightLabelOffset?: number
  /**
   * Icon component to display during loading state
   */
  iconSpinner?: string | Component
  /**
   * Hide the button label text
   */
  hideLabel?: boolean
  /**
   * Hide the button tooltip
   */
  hideTooltip?: boolean
  /**
   * Button label text
   */
  label?: string
  /**
   * Make the button square (equal width and height)
   */
  square?: boolean
  /**
   * Router link destination (vue-router)
   */
  to?: any
  /**
   * Button color variant
   */
  variant?: ButtonVariant
  /**
   * Button size
   */
  size?: Size
  /**
   * Make the button full-width block element
   */
  block?: boolean
  /**
   * Apply pill styling (fully rounded corners)
   */
  pill?: boolean
  /**
   * Toggle pressed state for toggle buttons
   */
  pressed?: boolean
  /**
   * HTML tag to render the button as
   */
  tag?: string
  /**
   * Button type attribute
   */
  type?: string
  /**
   * Show loading spinner and disable interactions
   */
  loading?: boolean
  /**
   * Duration of the loading spinner animation
   */
  loadingDuration?: string
  /**
   * Text to display while loading
   */
  loadingText?: string
  /**
   * Custom tooltip text (defaults to label)
   */
  tooltipLabel?: string
  /**
   * Tooltip placement position
   */
  tooltipPlacement?: PopoverPlacement
  /**
   * Delay before showing/hiding the tooltip
   */
  tooltipDelay?: { show: number, hide: number }
  /**
   * Force showing the tooltip even when label is visible
   */
  showTooltipForce?: boolean
  /**
   * Manual hover state control
   */
  hover?: boolean
  /**
   * Truncate label text with ellipsis when too long
   */
  truncate?: boolean
  /**
   * Counter badge value to display
   */
  counter?: number
  /**
   * Color variant for the counter badge
   */
  counterVariant?: TextColorVariant
  /**
   * Custom styles for the counter badge
   */
  counterStyle?: string | object
}

const props = withDefaults(defineProps<Omit<ButtonIconProps, 'pressed'>>(), {
  square: false,
  iconLeftLabelOffset: 19,
  iconLeftSize: '1.25em',
  iconRightSize: '1.25em',
  iconSpinner: () => IPhCircleNotch as Component,
  hideLabel: false,
  hideTooltip: false,
  tag: 'button',
  type: 'button',
  loadingDuration: '1s',
  tooltipPlacement: 'top',
  tooltipDelay: () => ({ show: 0, hide: 0 })
})

const emit = defineEmits(['click:icon-right'])

function click(name: 'icon-right') {
  emit(`click:${name}`)
}

const currentHover = ref(false)

const buttonId = computed(() => props.id ?? uniqueId('button-icon-'))

const classList = computed(() => {
  return {
    'button-icon--square': props.square,
    'button-icon--loading': props.loading,
    'button-icon--truncate': props.truncate,
    'button-icon--hover': currentHover.value,
    'button-icon--use-injected-variant': !props.variant,
    'button-icon--use-injected-size': !props.size
  }
})

const iconLeftOrSpinner = computed(() => {
  return props.loading ? props.iconSpinner : props.iconLeft
})

const iconRightOrSpinner = computed(() => {
  return props.loading ? props.iconSpinner : props.iconRight
})

const labelOrLoadingText = computed(() => {
  return props.loading && props.loadingText ? props.loadingText : props.label
})

const tooltipText = computed(() => {
  return props.tooltipLabel ?? props.label
})

const hasTooltip = computed(() => {
  return !!tooltipText.value && !props.hideTooltip && (props.showTooltipForce || props.hideLabel)
})

const buttonProps = computed(() => ({
  block: props.block,
  pill: props.pill,
  pressed: props.pressed,
  size: props.size ?? injectedSize,
  tag: props.tag,
  type: props.type,
  variant: props.variant ?? injectedVariant
}))
</script>

<style lang="scss" scoped>
.button-icon {

  &::deep(.app-icon) {
    font-size: 1.25em;
  }

  &.btn {
    // force overriding display-block from bootstrap
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    min-width: 0;

    .button-icon-counter {
      margin: -0.5em 0 -0.5em $spacer-xs;
    }
  }

  --button-icon-square-size: calc(
    var(--bs-btn-line-height) * var(--bs-btn-font-size) + var(--bs-btn-padding-y) * 2 + var(--bs-btn-border-width) * 2
  );

  &--truncate.btn {
    max-width: 100%;

    .button-icon__label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1 0 0;
    }
  }

  &--square.btn {
    padding: 0;
    align-items: center;
    justify-content: center;
    width: var(--button-icon-square-size);
    height: var(--button-icon-square-size);
    position: relative;
    flex-shrink: 0;

    .button-icon-counter {
      margin: 0;
      position: absolute;
      bottom: auto;
      left: auto;
      right: 0;
      top: 0;
      transform: translate(50%, -50%);
    }
  }

  &__icon-left ~ &__label,
  &__label ~ &__icon-right {
    margin-left: $spacer-xs;
  }
}
</style>
