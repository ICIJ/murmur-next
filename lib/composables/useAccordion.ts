import { computed } from 'vue'
import type { ComputedRef, Ref } from 'vue'

import type { Accordion, Step } from '@/types'

/**
 * Emit signature for the `step-change` event raised when navigation occurs.
 */
type StepChangeEmit = (event: 'step-change', step: Step) => void

/**
 * Encapsulates an accordion's step-navigation logic: tracking the active step,
 * deriving per-step position predicates, and emitting the `step-change` event
 * when moving to the next or previous step.
 *
 * The returned object matches the {@link Accordion} contract so it can be
 * provided directly to descendant `AccordionStep` components.
 *
 * @param step - Ref to the currently active step.
 * @param steps - Ref to the ordered list of all available steps.
 * @param emit - The component's emit function, used to raise `step-change`.
 * @returns The {@link Accordion} navigation API plus the `activeStepIndex` computed.
 *   `activeStepIndex` and the predicate functions (`isActiveStep`,
 *   `isPreviousStep`, `isFirstStep`, `isLastStep`) read the `step`/`steps` refs
 *   live, so they stay reactive as the refs change. By contrast, the returned
 *   `step` and `steps` values are plain snapshots captured at call time (NOT
 *   reactive); they exist to satisfy the {@link Accordion} provide/inject
 *   contract and will not update when the source refs change.
 * @example
 * import { toRef } from 'vue'
 *
 * const accordion = useAccordion(toRef(props, 'step'), toRef(props, 'steps'), emit)
 */
export function useAccordion(
  step: Ref<Step>,
  steps: Ref<Step[]>,
  emit: StepChangeEmit
): Accordion & { activeStepIndex: ComputedRef<number> } {
  const activeStepIndex = computed(() => steps.value?.indexOf(step.value))

  // The active step at provide time; descendants navigate through the predicate
  // helpers below rather than reading these snapshot values directly.
  const initialStep = step.value
  const initialSteps = steps.value

  // Emit the neighbouring step, falling back to the current step at the bounds
  // so navigation never overflows the list.
  const emitAccordionNextStepEvent = (): void => {
    emit('step-change', steps.value[activeStepIndex.value + 1] || step.value)
  }

  const emitAccordionPreviousStepEvent = (): void => {
    emit('step-change', steps.value[activeStepIndex.value - 1] || step.value)
  }

  const isFirstStep = (candidate: Step): boolean =>
    steps.value?.indexOf(candidate) === 0
  const isLastStep = (candidate: Step): boolean =>
    steps.value?.indexOf(candidate) === steps.value?.length - 1
  const isActiveStep = (candidate: Step): boolean => step.value === candidate
  const isPreviousStep = (candidate: Step): boolean =>
    steps.value?.indexOf(candidate) < activeStepIndex.value

  return {
    activeStepIndex,
    emitAccordionNextStepEvent,
    emitAccordionPreviousStepEvent,
    isActiveStep,
    isPreviousStep,
    isFirstStep,
    isLastStep,
    step: initialStep,
    steps: initialSteps
  }
}

export default useAccordion
