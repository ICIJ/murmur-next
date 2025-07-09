<template>
  <div class="accordion-wrapper">
    <div class="accordion-wrapper__content ms-5">
      <!-- @slot Content with all the steps declarations -->
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType, provide } from 'vue'
import { AccordionKey } from '@/keys'
import { Accordion, Step } from '@/types'

const STEP_CHANGE_EVENT: string = 'step-change'

const props = defineProps({
  step: {
    type: [String, Symbol, Object as () => Step],
    required: true
  },
  steps: {
    type: Array as PropType<Step[]>,
    required: true
  }
})

const emit = defineEmits(['step-change'])

const activeStepIndex = computed(() => props.steps?.indexOf(props.step))

const emitAccordionNextStepEvent = () => {
  emit('step-change', props.steps[activeStepIndex.value + 1] || props.step)
}

const emitAccordionPreviousStepEvent = () => {
  emit('step-change', props.steps[activeStepIndex.value - 1] || props.step)
}

const isFirstStep = (step: Step): boolean =>
  props.steps?.indexOf(step) === 0
const isLastStep = (step: Step): boolean =>
  props.steps?.indexOf(step) === props.steps?.length - 1
const isActiveStep = (step: Step): boolean => props.step === step
const isPreviousStep = (step: Step): boolean =>
  props.steps?.indexOf(step) < activeStepIndex.value

provide<Accordion>(AccordionKey, {
  emitAccordionNextStepEvent,
  emitAccordionPreviousStepEvent,
  isActiveStep,
  isPreviousStep,
  isFirstStep,
  isLastStep,
  step: props.step,
  steps: props.steps
})
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';

.accordion-wrapper {
  $step-bullet-size: 2rem;
  $step-bullet-font-size: math.div($step-bullet-size, 2);

  &__content {
    counter-reset: step 0;
    max-width: 550px;
    &__step {
      margin-bottom: $spacer;
      position: relative;
      opacity: $btn-disabled-opacity;
      transition: $transition-base;

      &--active,
      &--previous {
        opacity: 1;
      }

      &__heading + .collapse > .card-body {
        padding-top: 0;
      }

      &:before {
        counter-increment: step;
        content: counter(step);
        z-index: 10;
        line-height: $step-bullet-size;
        height: $step-bullet-size;
        width: $step-bullet-size;
        text-align: center;
        font-size: $step-bullet-font-size;
        border-radius: 50%;
        display: block;
        color: white;
        font-weight: bolder;
        position: absolute;
        right: calc(100% + #{$spacer});
        top: $spacer * 1.25;
        background: $text-muted;
        transition: background $transition-base;
      }

      &--active:before,
      &--previous:before {
        background: $info;
      }

      &:not(:last-of-type):after {
        content: '';
        z-index: 0;
        position: absolute;
        top: $spacer * 1.25;
        right: calc(100% + #{$spacer} + #{math.div($step-bullet-size, 2)});
        transform: translateX(50%);
        bottom: -4rem;
        width: 3px;
        background: transparent;
        transition: background 400ms;
      }

      &--previous:not(:last-of-type):after {
        background: $info;
      }
    }
  }
}
</style>
