<script setup lang="ts">
import { provide, toRef } from 'vue'

import { useAccordion } from '@/composables/useAccordion'
import { AccordionKey } from '@/keys'
import { Step } from '@/types'

export interface AccordionWrapperProps {
  /**
   * Current active step
   */
  step: Step
  /**
   * Array of all available steps
   */
  steps: Step[]
}

const props = defineProps<AccordionWrapperProps>()

const emit = defineEmits(['step-change'])

const accordion = useAccordion(toRef(props, 'step'), toRef(props, 'steps'), emit)

provide(AccordionKey, accordion)

// Expose the navigation helpers on the component instance so they remain
// reachable from unit tests (which call them through `wrapper.vm`).
defineExpose(accordion)
</script>

<template>
  <div class="accordion-wrapper">
    <div class="accordion-wrapper__content">
      <!-- @slot Content with all the steps declarations -->
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>

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
