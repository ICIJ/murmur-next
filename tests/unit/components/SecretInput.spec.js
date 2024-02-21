import { mount, shallowMount } from '@vue/test-utils'
import SecretInput from '@/components/SecretInput.vue'

describe('SecretInput.vue', () => {
  // Stubs Bootstrap Vue components
  const stubs = ['b-input-group-prepend', 'b-input-group-append', 'b-input-group', 'b-form-input', 'b-button', 'haptic-copy']
  const global = {stubs, renderStubDefaultSlot:true}
  it('should be a Vue instance', () => {
    const wrapper = shallowMount(SecretInput, { global })
    expect(wrapper.vm).toBeTruthy()
  })

  it('changes visibility according to the "visible" prop', async () => {
    const propsData = { value: 'a secret value' }
    const wrapper = shallowMount(SecretInput, { global, propsData })
    expect(wrapper.vm.inputType).toBe("password")
    await wrapper.setProps({ visible: true })
    expect(wrapper.vm.inputType).toBe("text")

  })

  it('sets initial visibility according to the "visible" prop', () => {
    const propsData = { value: 'a secret value', visible: true }
    const wrapper = shallowMount(SecretInput, { global, propsData })
    expect(wrapper.vm.inputType).toBe("text")
  })

  it('emits "input" event when changing visibility', async () => {
    const propsData = { value: 'a secret value' }
    const wrapper = mount(SecretInput, { global, propsData })
    await wrapper.find(".secret-input__toggler").trigger("click")
    expect(wrapper.emitted("update:visible")).toBeTruthy()
    expect(wrapper.emitted("update:visible")[0][0]).toBe(true)
  })

  it('shows an eye icon when input is not visible', () => {
    const propsData = { value: 'a secret value', visible: false }
    const wrapper = shallowMount(SecretInput, { global, propsData })
    expect(wrapper.vm.togglerIcon[1]).toBe('eye')
  })

  it('shows an eye-slash icon when input is visible', () => {
    const propsData = { value: 'a secret value', visible: true }
    const wrapper = shallowMount(SecretInput, { global, propsData })
    expect(wrapper.vm.togglerIcon[1]).toBe('eye-slash')
  })

  it('shows the toggler button by default', () => {
    const wrapper = mount(SecretInput, {global})
    expect(wrapper.find('.secret-input__toggler').exists()).toBeTruthy()
  })

  it('hides the toggler button', () => {
    const propsData = { value: 'a secret value', noToggler: true }
    const wrapper = shallowMount(SecretInput, { global, propsData })
    expect(wrapper.find('.secret-input__toggler').exists()).toBeFalsy()
  })

  it('shows the haptic copy button by default', () => {
    const wrapper = shallowMount(SecretInput, { global })
    expect(wrapper.find('.secret-input__copy').exists()).toBeTruthy()
  })

  it('hides the haptic copy button', () => {
    const propsData = { value: 'a secret value', noHapticCopy: true }
    const wrapper = shallowMount(SecretInput, { global, propsData })
    expect(wrapper.find('.secret-input__copy').exists()).toBeFalsy()
  })

  it('uses haptic copy button primary variant by default', () => {
    const wrapper = shallowMount(SecretInput, { global })
    expect(wrapper.find('.secret-input__copy').classes('btn-primary')).toBeTruthy()
  })

  it('changes haptic copy button variant', () => {
    const propsData = { hapticCopyVariant: 'info' }
    const wrapper = shallowMount(SecretInput, { global, propsData })
    expect(wrapper.find('.secret-input__copy').classes('btn-primary')).toBeFalsy()
    expect(wrapper.find('.secret-input__copy').classes('btn-info')).toBeTruthy()
  })
})