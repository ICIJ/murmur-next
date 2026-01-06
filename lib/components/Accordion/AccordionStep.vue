<template>
  <b-card
    :class="{
      'accordion-wrapper__content__step--active': isActive,
      'accordion-wrapper__content__step--previous': isPrevious
    }"
    class="accordion-wrapper__content__step"
    no-body
  >
    <h4 class="card-body accordion-wrapper__content__step__heading m-0">
      <!-- @slot Title of the step -->
      <slot name="title">
        {{ title }}
      </slot>
    </h4>
    <slide-up-down :active="isActive">
      <div class="accordion-wrapper__content__step__main card-body row g-0">
        <!-- @slot Content of the step with props {isFirst:boolean, isLast:boolean, step:Step, nextStep:Function}-->
        <slot
          name="content"
          v-bind="{ isFirst, isLast, step, previousStep, nextStep }"
        >
          {{ content }}
        </slot>
      </div>
      <div class="card-footer">
        <!-- @slot Previous step button with props {isFirst:boolean, isLast:boolean, step:Step, nextStep:Function} -->
        <slot
          name="previousStepButton"
          v-bind="{ isFirst, isLast, step, previousStep }"
        >
          <b-button
            v-if="!isFirst"
            class="accordion-wrapper__content__step__back-button"
            type="button"
            variant="link"
            @click="previousStep"
          >
            Back
          </b-button>
        </slot>
        <!-- @slot Next step button with props {isFirst:boolean, isLast:boolean, step:Step, nextStep:Function} }-->
        <slot
          name="nextStepButton"
          v-bind="{ isFirst, isLast, step, nextStep }"
        >
          <b-button
            v-if="!isLast"
            class="accordion-wrapper__content__step__continue-button"
            type="button"
            variant="primary"
            @click="nextStep"
          >
            Continue
          </b-button>
        </slot>
      </div>
    </slide-up-down>
  </b-card>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'

import SlideUpDown from '@/components/SlideUpDown/SlideUpDown.vue'
import { AccordionKey } from '@/keys'
import { Accordion, Step } from '@/types'

export interface AccordionStepProps {
  /**
   * Step name
   */
  step: Step
  /**
   * Title of the step card
   */
  title?: string
  /**
   * Content of the step card
   */
  content?: string
  /**
   * Force card expansion/collapse
   */
  active?: boolean
}

const props = withDefaults(defineProps<AccordionStepProps>(), {
  title: 'Step',
  content: 'Step',
  active: false
})

const emit = defineEmits(['next-step', 'previous-step'])

const accordion = inject<Accordion>(AccordionKey)

const isActive = computed(() => {
  const fromAccordion = !!accordion?.isActiveStep(props.step)
  const fromSelf = props.active !== undefined ? props.active : false
  return fromSelf || fromAccordion
})

const isPrevious = computed(() => !!accordion?.isPreviousStep(props.step))
const isFirst = computed(() => !!accordion?.isFirstStep(props.step))
const isLast = computed(() => !!accordion?.isLastStep(props.step))

const nextStep = () => {
  accordion?.emitAccordionNextStepEvent()
  /**
   * Fired when the nextStep function is called
   * either by clicking on the next button or in the next step slot
   * with the new value as parameter
   * @event next-step
   * @param Mixed New step value.
   */
  emit('next-step')
}

const previousStep = () => {
  accordion?.emitAccordionPreviousStepEvent()
  /**
   * Fired when the previousStep function is called
   * either by clicking on the previous button or in the previous step slot
   * with the new value as parameter
   * @event previous-step
   * @param Mixed New step value.
   */
  emit('previous-step')
}
</script>
