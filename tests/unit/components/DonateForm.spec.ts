import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DonateForm from '@/components/DonateForm.vue'

describe('DonateForm.vue', () => {
  const updateAmount = async (wrapper: any, amount: number) => {
    const inputAmount = wrapper.find('.donate-form__payment__input')
    const inputElement = inputAmount.element as HTMLInputElement
    inputElement.value = amount.toString()
    await inputAmount.trigger('input')
  }

  const getInput = (wrapper: any, selector: string) => {
    return (wrapper.find(selector).element as HTMLInputElement).value
  }

  it('is a Vue instance', () => {
    const wrapper = shallowMount(DonateForm)
    expect(wrapper.vm).toBeTruthy()
  })

  it('shows title when props.noTitle isn\'t passed', () => {
    const wrapper = shallowMount(DonateForm)
    expect(wrapper.find('.donate-form__title').exists()).toBeTruthy()
  })

  it('hides title when props.noTitle is passed', () => {
    const noTitle = true
    const wrapper = shallowMount(DonateForm, {
      propsData: { noTitle }
    })
    expect(wrapper.find('.donate-form__title').exists()).toBeFalsy()
  })

  it('updates the amount', async () => {
    const wrapper = shallowMount(DonateForm)

    expect(getInput(wrapper, 'input[name="amount"]')).toBe('10')
    const amount = 3
    await updateAmount(wrapper, 3)
    expect(getInput(wrapper, 'input[name="amount"]')).toBe('3')
  })

  it('shows a specific message for monthly amount higher or equal than 3', async () => {
    const wrapper = shallowMount(DonateForm)
    await wrapper.find('.frequency-monthly').trigger('click')
    const amount = 3
    await updateAmount(wrapper, amount)
    expect(wrapper.find('.donate-form__payment__level--conversation.active').exists()).toBe(true)
  })

  it('shows a specific message for monthly amount higher or equal than 15', async () => {
    const wrapper = shallowMount(DonateForm)
    await wrapper.find('.frequency-monthly').trigger('click')
    const amount = 15
    await updateAmount(wrapper, amount)
    expect(wrapper.find('.donate-form__payment__level--rules.active').exists()).toBe(true)
  })

  it('shows a specific message for monthly amount higher or equal than 50', async () => {
    const wrapper = shallowMount(DonateForm)
    await wrapper.find('.frequency-monthly').trigger('click')
    const amount = 50
    await updateAmount(wrapper, amount)
    expect(wrapper.find('.donate-form__payment__level--world.active').exists()).toBe(true)
  })

  it('shows the same specific message for monthly amount higher or equal than 150', async () => {
    const wrapper = shallowMount(DonateForm)
    await wrapper.find('.frequency-monthly').trigger('click')
    const amount = 150
    await updateAmount(wrapper, amount)
    expect(wrapper.find('.donate-form__payment__level--world.active').exists()).toBe(true)
  })

  it('shows a specific message for yearly amount higher or equal than 35', async () => {
    const wrapper = shallowMount(DonateForm)
    await wrapper.find('.frequency-yearly').trigger('click')
    const amount = 35
    await updateAmount(wrapper, amount)
    expect(wrapper.find('.donate-form__payment__level--conversation.active').exists()).toBe(true)
  })

  it('shows a specific message for yearly amount higher or equal than 180', async () => {
    const wrapper = shallowMount(DonateForm)
    await wrapper.find('.frequency-yearly').trigger('click')
    const amount = 180
    await updateAmount(wrapper, amount)
    expect(wrapper.find('.donate-form__payment__level--rules.active').exists()).toBe(true)
  })

  it('shows the same specific message for yearly amount higher or equal than 600', async () => {
    const wrapper = shallowMount(DonateForm)
    await wrapper.find('.frequency-yearly').trigger('click')
    const amount = 600
    await updateAmount(wrapper, amount)
    expect(wrapper.find('.donate-form__payment__level--world.active').exists()).toBe(true)
  })

  it('changes the amount for conversation level when changing the period', async () => {
    const wrapper = shallowMount(DonateForm)

    await wrapper.find('.frequency-onetime').trigger('click')
    expect(getInput(wrapper, 'input[name="installmentPeriod"]')).toBe('onetime')
    expect(getInput(wrapper, 'input[name="amount"]')).toBe('50')

    await wrapper.find('.frequency-monthly').trigger('click')
    expect(getInput(wrapper, 'input[name="installmentPeriod"]')).toBe('monthly')
    expect(getInput(wrapper, 'input[name="amount"]')).toBe('10')

    await wrapper.find('.frequency-yearly').trigger('click')
    expect(getInput(wrapper, 'input[name="installmentPeriod"]')).toBe('yearly')
    expect(getInput(wrapper, 'input[name="amount"]')).toBe('25')
  })

  it('changes the amount for rules level when changing the period', async () => {
    const wrapper = shallowMount(DonateForm)
    await wrapper.find('.frequency-onetime').trigger('click')
    await wrapper.find('.donate-form__payment__level--rules').trigger('click')
    expect(getInput(wrapper, 'input[name="amount"]')).toBe('200')

    await wrapper.find('.frequency-monthly').trigger('click')
    await wrapper.find('.donate-form__payment__level--rules').trigger('click')
    expect(getInput(wrapper, 'input[name="amount"]')).toBe('25')

    await wrapper.find('.frequency-yearly').trigger('click')
    await wrapper.find('.donate-form__payment__level--rules').trigger('click')
    expect(getInput(wrapper, 'input[name="amount"]')).toBe('180')
  })

  it('changes the amount for world level when changing the period', async () => {
    const wrapper = shallowMount(DonateForm)
    await wrapper.find('.frequency-onetime').trigger('click')
    await wrapper.find('.donate-form__payment__level--world').trigger('click')
    expect(getInput(wrapper, 'input[name="amount"]')).toBe('600')

    await wrapper.find('.frequency-monthly').trigger('click')
    await wrapper.find('.donate-form__payment__level--world').trigger('click')
    expect(getInput(wrapper, 'input[name="amount"]')).toBe('100')

    await wrapper.find('.frequency-yearly').trigger('click')
    await wrapper.find('.donate-form__payment__level--world').trigger('click')
    expect(getInput(wrapper, 'input[name="amount"]')).toBe('600')
  })

  it('doesn\'t change the amount when changing the period if the form isn\'t pristine', async () => {
    const wrapper = shallowMount(DonateForm)
    await wrapper.find('.frequency-yearly').trigger('click')
    expect(getInput(wrapper, 'input[name="amount"]')).toBe('25')
    const inputAmount = wrapper.find('.donate-form__payment__input')
    const inputElement = inputAmount.element as HTMLInputElement
    inputElement.dispatchEvent(new Event('change', { bubbles: true }))
    await wrapper.find('.frequency-monthly').trigger('click')
    expect(getInput(wrapper, 'input[name="amount"]')).toBe('25')
  })
})
