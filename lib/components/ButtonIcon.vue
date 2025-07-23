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
    <phosphor-icon
        v-if="iconLeft || (!iconLeft && !iconRight && loading)"
        v-b-tooltip.top.body="{ title: iconLeftLabel, offset: iconLeftLabelOffset, delay: tooltipDelay }"
        :name="iconLeftOrSpinner"
        :size="iconLeftSize"
        :weight="iconLeftWeight"
        :hover-weight="iconLeftHoverWeight"
        :spin="loading"
        :spin-duration="loadingDuration"
        :variant="iconLeftVariant"
        :hover-variant="iconLeftHoverVariant"
        :hover="currentHover"
        class="button-icon__icon-left"
    />
    <span v-if="!hideLabel" class="button-icon__label">
      <slot v-bind="{ labelOrLoadingText }">{{ labelOrLoadingText }}</slot>
    </span>
    <phosphor-icon
        v-if="iconRight"
        v-b-tooltip.top.body="{ title: iconRightLabel, offset: iconRightLabelOffset, delay: tooltipDelay }"
        :name="iconRightOrSpinner"
        :size="iconRightSize"
        :weight="iconRightWeight"
        :hover-weight="iconRightHoverWeight"
        :spin="loading"
        :spin-duration="loadingDuration"
        :variant="iconRightVariant"
        :hover-variant="iconRightHoverVariant"
        :hover="currentHover"
        class="button-icon__icon-right"
        @click="click('icon-right')"
    />
    <button-icon-counter v-if="counter !== null" :counter="counter" :variant="counterVariant" :style="counterStyle" />
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
import {computed, ref, inject, useTemplateRef} from 'vue'
import { uniqueId } from 'lodash'
import { PhCircleNotch } from '@phosphor-icons/vue'
import type { ButtonIconProps } from '@/types'

import {PhosphorIcon, ButtonIconCounter} from "@/components"

const injectedVariant = inject('variant', 'action')
const injectedSize = inject('size', 'md')
const elementRef = useTemplateRef<HTMLElement>('element')

defineOptions({
  name: 'ButtonIcon'
})
const props = withDefaults(defineProps<ButtonIconProps>(),{
  square:false,
  iconLeftLabelOffset:19,
  iconSpinner:PhCircleNotch,
  hideLabel:false,
  hideTooltip:false,
  tag:'button',
  type:'button',
  loadingDuration:'1s',
  tooltipPlacement:'top',
  tooltipDelay:() =>({ show: 0, hide: 0 })
})


const emit = defineEmits(['click:icon-right'])

function click(name:'icon-right') {
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

<style lang="scss">
.button-icon {
  &.btn { /* force overriding display-block from bootstrap */
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    min-width: 0;
  }

  --button-icon-square-size: calc(
      #{$btn-line-height * $btn-font-size} + #{$btn-padding-y * 2} + #{$btn-border-width} * 2
  );
  --button-icon-square-size-sm: calc(
      #{$btn-line-height * $btn-font-size-sm} + #{$btn-padding-y-sm * 2} + #{$btn-border-width} * 2
  );
  --button-icon-square-size-lg: calc(
      #{$btn-line-height * $btn-font-size-lg} + #{$btn-padding-y-lg * 2} + #{$btn-border-width} * 2
  );



  .button-icon-counter {
    margin: -0.5em 0 -0.5em $spacer-xs;
  }

  &--truncate {
    max-width: 100%;

    .button-icon__label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1 0 0;
    }
  }

  &--square {
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

  &--square.btn-sm {
    width: var(--button-icon-square-size-sm);
    height: var(--button-icon-square-size-sm);
  }

  &--square.btn-lg {
    width: var(--button-icon-square-size-lg);
    height: var(--button-icon-square-size-lg);
  }

  &__icon-left ~ &__label,
  &__label ~ &__icon-right {
    margin-left: $spacer-xs;
  }
  &__icon-left,
  &__icon-right {
    --phosphor-icon-size: #{$line-height-base * $btn-font-size};

    .btn-sm & {
      --phosphor-icon-size: #{$line-height-base * $btn-font-size-sm};
    }

    .btn-lg & {
      --phosphor-icon-size: #{$line-height-base * $btn-font-size-lg};
    }
  }
}
</style>
