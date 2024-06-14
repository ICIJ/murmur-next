import { shallowMount } from '@vue/test-utils'
import DonateForm from '@/components/DonateForm.vue'

describe('DonateForm.vue', () => {
  const updateAmount = async (wrapper, amount) => {
    const inputAmount = wrapper.find('.donate-form__payment__input')
    inputAmount.element.value = amount
    await inputAmount.trigger('input')
  }
  it('is a Vue instance', () => {
    const wrapper = shallowMount(DonateForm)
    expect(wrapper.vm).toBeTruthy()
  })

  it("shows title when props.noTitle isn't passed", () => {
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
    expect(wrapper.vm.amount).toBe(10) //default value
    await updateAmount(wrapper, 2)
    expect(wrapper.vm.amount).toBe(2)
  })

  it('shows a specific message for monthly amount higher or equal than 3', async () => {
    const wrapper = shallowMount(DonateForm)
    await wrapper.find('.frequency-monthly').trigger('click')
    const amount = 3
    await updateAmount(wrapper, amount)
    expect(wrapper.vm.changeThe).toBe(wrapper.vm.t('donate-form.result.conversation'))
  })

  it('shows a specific message for monthly amount higher or equal than 15', async () => {
    const wrapper = shallowMount(DonateForm)
    await wrapper.find('.frequency-monthly').trigger('click')
    const amount = 15
    await updateAmount(wrapper, amount)
    expect(wrapper.vm.changeThe).toBe(wrapper.vm.t('donate-form.result.rules'))
  })

  it('shows a specific message for monthly amount higher or equal than 50', async () => {
    const wrapper = shallowMount(DonateForm)
    await wrapper.find('.frequency-monthly').trigger('click')
    const amount = 50
    await updateAmount(wrapper, amount)
    expect(wrapper.vm.changeThe).toBe(wrapper.vm.t('donate-form.result.world'))
  })

  it('shows the same specific message for monthly amount higher or equal than 150', async () => {
    const wrapper = shallowMount(DonateForm)
    await wrapper.find('.frequency-monthly').trigger('click')
    const amount = 150
    await updateAmount(wrapper, amount)
    expect(wrapper.vm.changeThe).toBe(wrapper.vm.t('donate-form.result.world'))
  })

  it('shows a specific message for yearly amount higher or equal than 35', async () => {
    const wrapper = shallowMount(DonateForm)
    await wrapper.find('.frequency-yearly').trigger('click')
    const amount = 35
    await updateAmount(wrapper, amount)
    expect(wrapper.vm.changeThe).toBe(wrapper.vm.t('donate-form.result.conversation'))
  })

  it('shows a specific message for yearly amount higher or equal than 180', async () => {
    const wrapper = shallowMount(DonateForm)
    await wrapper.find('.frequency-yearly').trigger('click')
    const amount = 180
    await updateAmount(wrapper, amount)
    expect(wrapper.vm.changeThe).toBe(wrapper.vm.t('donate-form.result.rules'))
  })

  it('shows the same specific message for yearly amount higher or equal than 600', async () => {
    const wrapper = shallowMount(DonateForm)
    await wrapper.find('.frequency-yearly').trigger('click')
    const amount = 600
    await updateAmount(wrapper, amount)
    expect(wrapper.vm.changeThe).toBe(wrapper.vm.t('donate-form.result.world'))
  })

  it('changes the amount for conversation level when changing the period', async () => {
    const wrapper = shallowMount(DonateForm)

    await wrapper.find('.frequency-onetime').trigger('click')
    expect(wrapper.vm.amount).toBe(50)

    await wrapper.find('.frequency-monthly').trigger('click')
    expect(wrapper.vm.amount).toBe(10)

    await wrapper.find('.frequency-yearly').trigger('click')
    expect(wrapper.vm.amount).toBe(25)
  })

  it('changes the amount for rules level when changing the period', async () => {
    const wrapper = shallowMount(DonateForm)
    await wrapper.find('.frequency-onetime').trigger('click')

    wrapper.vm.selectLevel('rules')

    expect(wrapper.vm.amount).toBe(200)

    await wrapper.find('.frequency-monthly').trigger('click')
    wrapper.vm.selectLevel('rules')
    expect(wrapper.vm.amount).toBe(25)

    await wrapper.find('.frequency-yearly').trigger('click')
    wrapper.vm.selectLevel('rules')
    expect(wrapper.vm.amount).toBe(180)
  })

  it('changes the amount for world level when changing the period', async () => {
    const wrapper = shallowMount(DonateForm)
    await wrapper.find('.frequency-onetime').trigger('click')
    wrapper.vm.selectLevel('world')

    expect(wrapper.vm.amount).toBe(600)

    await wrapper.find('.frequency-monthly').trigger('click')
    wrapper.vm.selectLevel('world')

    expect(wrapper.vm.amount).toBe(100)

    await wrapper.find('.frequency-yearly').trigger('click')
    wrapper.vm.selectLevel('world')

    expect(wrapper.vm.amount).toBe(600)
  })

  it("doesn't change the amount when changing the period if the form isn't pristine", async () => {
    const wrapper = shallowMount(DonateForm)
    await wrapper.find('.frequency-yearly').trigger('click')
    expect(wrapper.vm.amount).toBe(25)
    const inputAmount = wrapper.find('.donate-form__payment__input')
    inputAmount.element.dispatchEvent(new Event('change', { bubbles: true }))
    await wrapper.find('.frequency-monthly').trigger('click')
    expect(wrapper.vm.amount).toBe(25)
  })
})
