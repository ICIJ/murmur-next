<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useDigitsModel } from '@/composables/useDigitsModel'

/**
 * Create an input for digits.
 */
defineOptions({
  name: 'DigitsInput'
})

export interface FormControlDigitsProps {
  /**
   * Number of digits to display
   */
  length?: number
  /**
   * Value of the input
   */
  modelValue?: string | number
  /**
   * Name of the input
   */
  name?: string
}

const props = withDefaults(defineProps<FormControlDigitsProps>(), {
  length: 6,
  modelValue: '',
  name: ''
})

/**
 * Define emits
 */
const emit = defineEmits(['update:modelValue', 'update:values'])

const inputs = ref<HTMLInputElement[]>([])

onMounted(async () => {
  await nextTick()
})

// Per-cell state and digit-spreading normalization live in a dedicated
// composable; the component owns focus management and event emission.
const { values, joinedValues } = useDigitsModel(
  {
    modelValue: () => props.modelValue,
    length: () => props.length
  },
  focusToNextInput
)

const lastInput = computed((): HTMLElement | null => {
  const index = inputs.value.length - 1
  return inputs.value[index]
})

const nextInput = computed((): HTMLInputElement | null => {
  if (joinedValues.value.length === props.length) {
    return null
  }

  // Next input is the first non-empty input or the last input
  return inputs.value[joinedValues.value.length] || lastInput.value
})

const hasNextInput = computed((): boolean => {
  return !!nextInput.value
})

function focusToNextInput() {
  if (hasNextInput.value) {
    nextInput.value?.focus()
  }
}

function focusToPreviousWhenEmpty(d: number) {
  if (!values.value[d]) {
    inputs.value[d - 1]?.focus()
  }
}

watch(
  () => joinedValues.value,
  () => {
    emit('update:modelValue', joinedValues.value)
  },
  { deep: true }
)

watch(
  () => props.modelValue,
  () => {
    const formattedValues = String(props.modelValue)
      .split('')
      .slice(0, props.length)
    emit('update:values', formattedValues)
  }
)
</script>

<template>
  <div class="digits-input">
    <div class="d-flex digits-input__container">
      <input
        v-for="d in length"
        ref="inputs"
        :key="d - 1"
        v-model="values[d - 1]"
        :class="`digits-input__container__input--${d - 1}`"
        class="digits-input__container__input w-0 form-control"
        @keyup.delete="focusToPreviousWhenEmpty(d - 1)"
      >
      <input
        type="hidden"
        :value="joinedValues"
        :name="name"
      >
    </div>
  </div>
</template>

<style scoped lang="scss">

.digits-input {
  &__container {
    &__input {
      font-size: 3rem;
      height: 10rem;
      line-height: 10rem;
      text-align: center;
      padding: $spacer $spacer * 0.25;
      margin: 0 $spacer * 0.25;

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
