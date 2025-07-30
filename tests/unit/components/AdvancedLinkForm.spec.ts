import { mount, flushPromises, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AdvancedLinkForm from '@/components/AdvancedLinkForm.vue'
import {Tab} from "@/components/AdvancedLinkFormTab.vue";

describe('AdvancedLinkForm.vue', () => {
  const global = { stubs: { HapticCopy: true }, renderStubDefaultSlot:true }
  it('should be a Vue instance', () => {
    const wrapper = shallowMount(AdvancedLinkForm, { global })
    expect(wrapper.vm).toBeTruthy()
  })

  it('should create 4 nav items (tabs) by default', async () => {
    const wrapper = mount(AdvancedLinkForm, { global })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.nav-item')).toHaveLength(4)
  })

  it('should create 4 pans by default, only one active', async () => {
    const wrapper = mount(AdvancedLinkForm, { global })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.tab-pane')).toHaveLength(4)
    expect(wrapper.findAll('.tab-pane.active')).toHaveLength(1)
  })

  it('should create a raw link input, active by default', async () => {
    const propsData = {
      link: 'https://www.icij.org',
      title: 'A Great Website'
    }
    const wrapper = mount(AdvancedLinkForm, { propsData, global })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.tab-pane.active [data-type="raw"]').exists()).toBeTruthy()
    expect((wrapper.find('.advanced-link-form-tab__input').element as HTMLInputElement).value).toBe(propsData.link)
  })

  it('should create switch between form using `modelValue` property', async () => {
    const wrapper = mount(AdvancedLinkForm, { global })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.tab-pane.active [data-type="raw"]').exists()).toBeTruthy()
    await wrapper.setProps({ modelValue: 1 })
    await flushPromises()
    expect(wrapper.find('.tab-pane.active [data-type="rich"]').exists()).toBeTruthy()
    await wrapper.setProps({ modelValue: 2 })
    await flushPromises()
    expect(wrapper.find('.tab-pane.active [data-type="markdown"]').exists()).toBeTruthy()
  })

  it('should create only 3 forms, markdown active by default', async () => {
    const propsData = { forms: ['raw', 'markdown', 'html'] as Tab[], modelValue: 1 }
    const wrapper = mount(AdvancedLinkForm, { propsData, global })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.tab-pane').length).toBe(3)
    expect(wrapper.find('.tab-pane.active [data-type="markdown"]').exists()).toBe(true)
  })


  describe('Display variants',()=>{
    it('should not use card by default', async () => {
      const wrapper = shallowMount(AdvancedLinkForm, { global })
      expect(wrapper.classes()).not.toContain('advanced-link-form--card')
      expect(wrapper.findComponent('b-tabs-stub').attributes('card')).toBe('false')
    })

    it('should use card when property is set', async () => {
      const propsData = { card: true }
      const wrapper = shallowMount(AdvancedLinkForm, { propsData, global })
      expect(wrapper.classes()).toContain('advanced-link-form--card')
      expect(wrapper.findComponent('b-tabs-stub').attributes('card')).toBe('true')
    })

    it('should not use pills by default', () => {
      const wrapper = shallowMount(AdvancedLinkForm, { global })
      expect(wrapper.classes()).not.toContain('advanced-link-form--pills')
      expect(wrapper.findComponent('b-tabs-stub').attributes('pills')).toBe('false')
    })

    it('should use pills when property is set', () => {
      const propsData = { pills: true }
      const wrapper = shallowMount(AdvancedLinkForm, { propsData, global })
      expect(wrapper.classes()).toContain('advanced-link-form--pills')
      expect(wrapper.findComponent('b-tabs-stub').attributes('pills')).toBe('true')

    })

    it('should not use small layout by default', () => {
      const wrapper = shallowMount(AdvancedLinkForm, { global })
      expect(wrapper.classes()).not.toContain('advanced-link-form--small')
    })

    it('should use small layout when property is set', () => {
      const propsData = { small: true }
      const wrapper = shallowMount(AdvancedLinkForm, { propsData, global })
      expect(wrapper.classes()).toContain('advanced-link-form--small')
    })

    it('should not use vertical layout by default', () => {
      const wrapper = shallowMount(AdvancedLinkForm, { global })
      expect(wrapper.classes()).not.toContain('advanced-link-form--vertical')
    })

    it('should use vertical layout when property is set', () => {
      const propsData = { vertical: true }
      const wrapper = shallowMount(AdvancedLinkForm, { propsData, global })
      expect(wrapper.classes()).toContain('advanced-link-form--vertical')
    })
  })

})
