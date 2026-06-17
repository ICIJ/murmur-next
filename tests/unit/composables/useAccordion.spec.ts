import { ref } from 'vue'

import { useAccordion } from '@/composables/useAccordion'
import type { Step } from '@/types'

describe('useAccordion', () => {
  const step1: Step = 'step1'
  const step2: Step = Symbol('step2')
  const step3: Step = Symbol('step3')
  const steps: Step[] = [step1, step2, step3]

  it('reports the active step', () => {
    const { isActiveStep } = useAccordion(ref(step2), ref(steps), () => {})
    expect(isActiveStep(step2)).toBe(true)
    expect(isActiveStep(step1)).toBe(false)
  })

  it('reports the first and last steps', () => {
    const { isFirstStep, isLastStep } = useAccordion(ref(step1), ref(steps), () => {})
    expect(isFirstStep(step1)).toBe(true)
    expect(isFirstStep(step2)).toBe(false)
    expect(isLastStep(step3)).toBe(true)
    expect(isLastStep(step1)).toBe(false)
  })

  it('reports previous steps relative to the active one', () => {
    const { isPreviousStep } = useAccordion(ref(step2), ref(steps), () => {})
    expect(isPreviousStep(step1)).toBe(true)
    expect(isPreviousStep(step3)).toBe(false)
  })

  it('emits the next step on forward navigation', () => {
    const emit = vi.fn()
    const { emitAccordionNextStepEvent } = useAccordion(ref(step1), ref(steps), emit)
    emitAccordionNextStepEvent()
    expect(emit).toHaveBeenCalledWith('step-change', step2)
  })

  it('emits the previous step on backward navigation', () => {
    const emit = vi.fn()
    const { emitAccordionPreviousStepEvent } = useAccordion(ref(step2), ref(steps), emit)
    emitAccordionPreviousStepEvent()
    expect(emit).toHaveBeenCalledWith('step-change', step1)
  })

  it('stays on the current step when navigating past the bounds', () => {
    const emit = vi.fn()
    const { emitAccordionNextStepEvent } = useAccordion(ref(step3), ref(steps), emit)
    emitAccordionNextStepEvent()
    expect(emit).toHaveBeenCalledWith('step-change', step3)
  })

  it('reads the step ref reactively when navigating', () => {
    const emit = vi.fn()
    const step = ref(step1)
    const { emitAccordionNextStepEvent } = useAccordion(step, ref(steps), emit)

    // Move the active step forward through the ref, then navigate: the emitted
    // neighbour must reflect the updated ref value, not the call-time snapshot.
    step.value = step2
    emitAccordionNextStepEvent()
    expect(emit).toHaveBeenCalledWith('step-change', step3)
  })
})
