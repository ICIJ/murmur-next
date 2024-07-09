<script lang="ts">
import { computed, ref, defineComponent } from 'vue'
import HapticCopy from './HapticCopy.vue'
import PhosphorIcon from './PhosphorIcon.vue';

export default defineComponent({
  name: 'SecretInput',
  components: { PhosphorIcon, HapticCopy },
  props: {
    /**
     * If true the value is visible by default
     */
    visible: {
      type: Boolean
    },
    /**
     * Value of the input
     */
    value: {
      type: [String, Number],
      default: ''
    },
    /**
     * Size of the input form
     */
    size: {
      type: String,
      default: 'md'
    },
    /**
     * Bootstrap variant of the haptic copy button
     */
    hapticCopyVariant: {
      type: String,
      default: 'primary'
    },
    /**
     * Hide toggler button
     */
    noToggler: {
      type: Boolean
    },
    /**
     * Hide haptic copy button
     */
    noHapticCopy: {
      type: Boolean
    }
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const secretInput = ref<HTMLInputElement | null>(null)
    const inputType = computed(() => {
      return props.visible ? 'text' : 'password'
    })
    const togglerIcon = computed(() => {
      return props.visible ? 'eye-slash' : 'eye'
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
    return {
      selectInput,
      toggle,
      togglerIcon,
      inputType,
      hapticCopyClassList
    }
  }
})
</script>

<template>
  <b-input-group :size="size" class="secret-input">
    <b-button v-if="!noToggler" variant="link" class="secret-input__toggler" @click="toggle">
      <phosphor-icon :name="togglerIcon" />
    </b-button>
    <b-form-input
      ref="secretInput"
      class="text-monospace secret-input__input"
      readonly
      :type="inputType"
      :modelValue="value"
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
@import '../styles/lib.scss';

.secret-input {
  &__toggler {
    background: $input-disabled-bg;
    border: $input-border-width solid $input-border-color;
    border-right: 0;
  }
}
</style>
