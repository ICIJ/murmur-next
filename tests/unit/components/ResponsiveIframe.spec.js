import { shallowMount } from '@vue/test-utils'
import ResponsiveIframe from '@/components/ResponsiveIframe'

describe('ResponsiveIframe', () => {
  const props = {
    url: 'https://projects.icij.org/the-implant-files/graphics/'
  }

  it('is a Vue instance', () => {
    const wrapper = shallowMount(ResponsiveIframe, { props })
    expect(wrapper.vm).toBeTruthy()
  })

  it('creates a root div with a unique id', () => {
    const first = shallowMount(ResponsiveIframe, { props })
    const second = shallowMount(ResponsiveIframe, { props })
    expect(first.element.id).not.toBe(second.element.id)
  })
})
