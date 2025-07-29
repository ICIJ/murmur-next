import {mount,  shallowMount} from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AdvancedLinkFormTab, {Tab} from '@/components/AdvancedLinkFormTab.vue'
interface AdvancedLinkFormTabsProps {
  readonly link: string;
  readonly title: string;
  readonly type?:Tab;
}

describe('AdvancedLinkFormTab.vue', () => {
  const global = { stubs: { HapticCopy: true }, renderStubDefaultSlot:true }
  it('should be a Vue instance', () => {
    const props = {
      link: 'https://www.icij.org',
      title: 'A Great Website',
    }
    const wrapper = mount(AdvancedLinkFormTab, { global, props })
    expect(wrapper.vm).toBeTruthy()
  })

  it('should create a raw link input', async () => {
    const props:AdvancedLinkFormTabsProps = {
      link: 'https://www.icij.org',
      title: 'A Great Website',
      type: 'raw'
    }
    const wrapper = shallowMount(AdvancedLinkFormTab, { props, global })
    expect(wrapper.find('.advanced-link-form-tab__input').attributes("modelvalue")).toBe(props.link)
  })


  it('should use the title in markdown input', async () => {
    const props :AdvancedLinkFormTabsProps= {
      link: 'https://www.icij.org',
      title: 'A Great Website',
      type: 'markdown'
    }
    const markdown = `[${props.title}](${props.link})`
    const wrapper = shallowMount(AdvancedLinkFormTab, { props, global })
    expect(wrapper.find('.advanced-link-form-tab__input').attributes("modelvalue")).toBe(markdown)
  })

  it('should use the title in rich input', () => {
    const props :AdvancedLinkFormTabsProps = {
      link: 'https://www.icij.org',
      title: 'A Great Website',
      type: 'rich'
    }
    const wrapper = shallowMount(AdvancedLinkFormTab, { props, global })
    expect(wrapper.find('.advanced-link-form-tab__input').text()).toBe(props.title)
    expect(wrapper.find('.advanced-link-form-tab__input').attributes('href')).toBe(props.link)
  })
})
