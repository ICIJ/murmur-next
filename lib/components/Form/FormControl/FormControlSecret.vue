<script setup lang="ts">
import { computed, ref, type Component } from 'vue'
import HapticCopy from '@/components/HapticCopy/HapticCopy.vue'
import AppIcon from '@/components/App/AppIcon.vue'
import { Size } from 'bootstrap-vue-next'
import IPhEye from '~icons/ph/eye'
import IPhEyeSlash from '~icons/ph/eye-slash'

export interface FormControlSecretProps {
  /**
   * If true the value is visible by default
   */
  visible?: boolean
  /**
   * Value of the input
   */
  value?: string | number
  /**
   * Size of the input form
   */
  size?: Size
  /**
   * Bootstrap variant of the haptic copy button
   */
  hapticCopyVariant?: string
  /**
   * Hide toggler button
   */
  noToggler?: boolean
  /**
   * Hide haptic copy button
   */
  noHapticCopy?: boolean
}

const props = withDefaults(defineProps<FormControlSecretProps>(), {
  visible: false,
  value: '',
  size: 'md',
  hapticCopyVariant: 'primary',
  noToggler: false,
  noHapticCopy: false
})

const emit = defineEmits(['update:visible'])

const secretInput = ref<HTMLInputElement | null>(null)
const inputType = computed(() => {
  return props.visible ? 'text' : 'password'
})
const togglerIcon = computed((): Component => {
  return props.visible ? IPhEyeSlash : IPhEye
})
const hapticCopyClassList = computed(() => {
  return `btn-${props.hapticCopyVariant}`
})

function toggle() {
  /**
   * Emitted when the visibility of the input changes.
   *
   * @event update:visible
   * @type {Boolean}
   */
  emit('update:visible', !props.visible)
}
function selectInput() {
  if (props.visible) {
    secretInput.value?.select()
  }
}
</script>

<template>
  <b-input-group
    :size="size"
    class="secret-input"
  >
    <b-button
      v-if="!noToggler"
      variant="link"
      class="secret-input__toggler"
      @click="toggle"
    >
      <app-icon><component :is="togglerIcon" /></app-icon>
    </b-button>
    <b-form-input
      ref="secretInput"
      class="text-monospace secret-input__input"
      readonly
      :type="inputType"
      :model-value="value"
      @click="selectInput"
    />
    <haptic-copy
      v-if="!noHapticCopy"
      class="secret-input__copy"
      hide-label
      :class="hapticCopyClassList"
      :text="value"
      @success="selectInput"
      @error="selectInput"
    />
  </b-input-group>
</template>

<style scoped lang="scss">

.secret-input {
  &__toggler {
    background: $input-disabled-bg;
    border: $input-border-width solid $input-border-color;
    border-right: 0;
  }
}
</style>
