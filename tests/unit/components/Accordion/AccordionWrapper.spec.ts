import { mount, shallowMount } from '@vue/test-utils'

import type { Step } from '@/types'
import AccordionWrapper from '@/components/Accordion/AccordionWrapper.vue'
describe('AccordionStep', () => {
  // Stubs Bootstrap Vue components
  const step1: Step = 'step1'
  const step2: Step = Symbol('step2')
  const step3: Step = Symbol('step3')

  const steps: Step[] = [step1, step2, step3]
  describe('should update the current step', () => {
    it('has step2 has current step', () => {
      const propsData = { step: step2, steps }
      const wrapper = shallowMount(AccordionWrapper, { propsData })
      expect(wrapper.exists()).toBeTruthy()
      expect(wrapper.vm.isActiveStep(step2)).toBe(true)
    })
    it('has step1 has first step', () => {
      const propsData = { step: step1, steps }
      const wrapper = shallowMount(AccordionWrapper, { propsData })
      expect(wrapper.vm.isFirstStep(step1)).toBe(true)
    })

    it('has step3 has last step', () => {
      const propsData = { step: step3, steps }
      const wrapper = shallowMount(AccordionWrapper, { propsData })
      expect(wrapper.vm.isLastStep(step3)).toBe(true)
    })
    it('changes from step1 to step2', async () => {
      const propsData = { step: step1, steps }
      const wrapper = shallowMount(AccordionWrapper, { propsData })
      expect(wrapper.vm.isActiveStep(step1)).toBe(true)
      wrapper.vm.emitAccordionNextStepEvent()
      expect(wrapper.emitted()).toHaveProperty('step-change')
      const actual = wrapper.emitted('step-change')?.[0][0]
      expect(actual).toEqual(step2)
    })
    it('changes from step2 to step1', async () => {
      const propsData = { step: step2, steps }
      const wrapper = mount(AccordionWrapper, { propsData })
      expect(wrapper.vm.isActiveStep(step2)).toBe(true)
      wrapper.vm.emitAccordionPreviousStepEvent()
      expect(wrapper.emitted()).toHaveProperty('step-change')
      const actual = wrapper.emitted('step-change')?.[0][0]
      expect(actual).toEqual(step1)
      await wrapper.setProps({ step: step1 })
      wrapper.vm.emitAccordionPreviousStepEvent()
      const actual2 = wrapper.emitted('step-change')?.[1][0]
      expect(actual2).toEqual(step1)
    })
  })
})
