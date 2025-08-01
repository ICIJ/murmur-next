<script setup lang="ts">
import { filter } from 'lodash'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

/**
 * Create an input for digits.
 */
defineOptions({
  name: 'DigitsInput'
})

/**
 * Define props
 */
const props = defineProps({
  /**
   * Number of digits to display
   */
  length: {
    type: Number,
    default: 6
  },
  /**
   * Value of the input
   */
  modelValue: {
    type: [String, Number],
    default: ''
  },
  /**
   * Name of the input
   */
  name: {
    type: String,
    default: ''
  }
})

/**
 * Define emits
 */
const emit = defineEmits(['update:modelValue', 'update:values'])

const inputs = ref<HTMLInputElement[]>([])

onMounted(async () => {
  await nextTick()
})

const values = ref(
  String(props.modelValue).split('').slice(0, props.length)
)

const joinedValues = computed((): string => {
  return filter(values.value, v => !isNaN(v as any)).join('')
})

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
  () => values,
  (values) => {
    // Copy and remove values that are not numbers
    const formattedValues = values.value.map(value =>
      String(value).replace(/\D/g, '')
    )
    // Iterate over the values to be sure
    // they are not exceeding 10 and should
    // be spread to the next inputs
    formattedValues.forEach((value, d) => {
      // The value must be spread to the next input only
      // if it's higher than 9 (more than one digit)
      if (value !== null && Number(value) > 9) {
        // Split the number into an array of strings
        String(value)
          .split('')
          .forEach((nextValue, n) => {
            // Spread the value to the next inputs of the array
            formattedValues[d + n] = String(Number(nextValue))
          })
      }
    })
    // We update the values data attribute only if they changed
    // to avoid an infinite update cycle
    if (JSON.stringify(values.value) !== JSON.stringify(formattedValues)) {
      values.value = formattedValues.slice(0, props.length)
    }
    focusToNextInput()
  },
  { deep: true }
)

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
