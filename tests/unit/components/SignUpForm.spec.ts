import { mount } from '@vue/test-utils'
import SignUpForm from '@/components/SignUpForm.vue'
import Murmur from '@/main'
const mockSend = vi.fn().mockResolvedValue({})
vi.mock('@/composables/useSendEmail', () => ({
  useSendEmail() {
    return {
      send: mockSend
    }
  }
}))

describe('SignUpForm', () => {
  it('is a Vue instance', () => {
    const wrapper = mount(SignUpForm)
    expect(wrapper.vm).toBeTruthy()
  })

  it('renders the label by default', () => {
    const wrapper = mount(SignUpForm)
    expect(wrapper.find('label').exists()).toBeTruthy()
  })

  it('disables the label when props.noLabel is passed', () => {
    const noLabel = true
    const wrapper = mount(SignUpForm, {
      propsData: { noLabel }
    })
    expect(wrapper.find('label').exists()).toBeFalsy()
  })

  it("doesn't render the form horizontally by default", () => {
    const wrapper = mount(SignUpForm)
    expect(wrapper.classes('sign-up-form--horizontal')).toBeFalsy()
  })

  it('renders the form horizontally when props.horizontal is passed', () => {
    const horizontal = true
    const wrapper = mount(SignUpForm, {
      propsData: { horizontal }
    })
    expect(wrapper.classes('sign-up-form--horizontal')).toBeTruthy()
  })

  it('uses a default tracker when none is given', () => {
    const wrapper = mount(SignUpForm)
    const tracker = Murmur.config.get('signup-form.tracker')
    expect(wrapper.vm.tracker).toBe(tracker)
  })

  it('uses a custom tracker when props.tracker is passed', () => {
    const tracker = 'YOLO'
    const wrapper = mount(SignUpForm, {
      propsData: { tracker }
    })
    expect(wrapper.vm.tracker).toBe(tracker)
  })

  it('sends the email when submitting the form', async () => {
    const wrapper = mount(SignUpForm)

    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    let submitEmitted:unknown[] = wrapper.emitted().submit;
    expect(submitEmitted).toBeDefined()
    let submitEmittedElement = submitEmitted[0] as unknown[];
    expect(submitEmittedElement).toBeDefined()
    expect(submitEmittedElement[0]).toBeDefined()
  })

  it('sends the email when submitting the form and display the confirmation', async () => {
    const msg = '☮️'
    mockSend.mockResolvedValueOnce({ result: 'success', msg })
    const wrapper = mount(SignUpForm)
    await wrapper.trigger('submit')
    expect(wrapper.emitted().success[0]).toContain(msg)
  })

  it('sends the email and drops it when the result is a success', async () => {
    const msg = '☮️'
    mockSend.mockResolvedValueOnce({ result: 'success', msg })
    const wrapper = mount(SignUpForm)
    const emailInput = wrapper.find('input[name=EMAIL]');
    await emailInput.setValue('data@icij.org')
    await wrapper.trigger('submit')
    const emptyEmailInput = wrapper.find('input[name=EMAIL]').element as HTMLInputElement
    expect(emptyEmailInput.value).toBe('')
  })

  it("sends the email but doesn't drop it when the result is an error", async () => {
    const msg = '❎'
    mockSend.mockRejectedValueOnce({ result: 'error', msg })
    const wrapper = mount(SignUpForm)
    const emailInput = wrapper.find('input[name=EMAIL]');
    const email = 'data@icij.org';
    await emailInput.setValue(email)
    await wrapper.trigger('submit')
    const emptyEmailInput = wrapper.find('input[name=EMAIL]').element as HTMLInputElement
    expect(emptyEmailInput.value).toBe(email)
  })

  it('sends the email when submitting the form and display the error', async () => {
    const msg = '❎'
    mockSend.mockRejectedValueOnce({ result: 'error', msg })

    const wrapper = mount(SignUpForm)
    await wrapper.trigger('submit')
    expect(wrapper.emitted().error[0]).toContain(msg)
    expect(wrapper.find('.sign-up-form__error').text()).toBe(msg)
  })

  it('sends the email and transform the error message', async () => {
    mockSend.mockRejectedValueOnce({ msg: '0 -❎' })

    const wrapper = mount(SignUpForm)
    await wrapper.trigger('submit')
      //@ts-expect-error error is emitted as an array of strings
    expect(wrapper.emitted().error[0][0]).toBe('❎')
  })

  it('sends the email and show a default error message', async () => {
    mockSend.mockRejectedValueOnce({})
    const wrapper = mount(SignUpForm)
    await wrapper.trigger('submit')

    //@ts-expect-error error is emitted as an array of strings
    expect(wrapper.emitted().error[0][0]).toBe("Something's wrong")
  })

  it('changes the color variant of the button', async () => {
    const wrapper = mount(SignUpForm)
    // variant is primary
    let element = wrapper.find('.sign-up-form__fieldset__group__addon.btn-primary')
    expect(element.exists()).toBeTruthy()

    //variant is secondary
    await wrapper.setProps({ variant: 'secondary' })
    element = wrapper.find('.sign-up-form__fieldset__group__addon.btn-secondary')
    expect(element.exists()).toBeTruthy()
  })
})
