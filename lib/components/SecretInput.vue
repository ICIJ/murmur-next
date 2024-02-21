<script lang="ts">
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'

import { computed,ref,onBeforeMount, watch,defineComponent} from 'vue'
import { library, default as Fa } from './Fa'
import HapticCopy from './HapticCopy.vue'

export default defineComponent({
  name: 'SecretInput',
  components: { Fa, HapticCopy },
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
  emits:['update:visible'],
  setup(props,{emit}){
    onBeforeMount(() =>{
      library.add(faEye, faEyeSlash)
    })
    const secretInput = ref<HTMLInputElement|null>(null)
    const inputType = computed(() => {
      return props.visible ? 'text' : 'password'
    })
    const togglerIcon = computed(() => {
      return props.visible ? ['far', 'eye-slash'] : ['far', 'eye']
    })
    const hapticCopyClassList = computed(() => {
          return `btn-${props.hapticCopyVariant}`
    })


    function toggle() {
      /**
       * Emitted when the visibility of the input changes.
       *
       * @event update:modelValue
       * @type {Boolean}
       */
      emit("update:visible", !props.visible)
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
    <b-input-group-prepend v-if="!noToggler">
      <b-button variant="link" class="secret-input__toggler" @click="toggle">
        <fa fixed-width :icon="togglerIcon" />
      </b-button>
    </b-input-group-prepend>
    <b-form-input
      ref="secretInput"
      class="text-monospace secret-input__input"
      readonly
      :type="inputType"
      :modelValue="value"
      @click="selectInput"
    />
    <b-input-group-append v-if="!noHapticCopy">
      <haptic-copy
        class="secret-input__copy"
        hide-label
        :class="hapticCopyClassList"
        :text="value"
        @success="selectInput"
        @error="selectInput"
      />
    </b-input-group-append>
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
