import { mount } from '@vue/test-utils'

import SharingOptions from '@/components/SharingOptions'

describe('SharingOptions', () => {

  const propsData = {
    url: 'https://medicaldevices.icij.org/',
    values: {
      title: 'A title to share',
      twitter_title: 'A tweet to share #vue',
      facebook_description: 'A short description for facebook but not for the other network'
    }
  }

  it('is a Vue instance', () => {
    const wrapper = mount(SharingOptions, { propsData })
    expect(wrapper.vm).toBeTruthy()
  })

  it('renders props.direction on the root element with the default value', () => {
    const wrapper = mount(SharingOptions, { propsData })
    expect(wrapper.element.style['flex-direction']).toBe('row')
  })

  it('renders props.direction on the root element with `row`', () => {
    const direction = 'row'
    const wrapper = mount(SharingOptions, {
      propsData: { direction, ...propsData }
    })
    expect(wrapper.element.style['flex-direction']).toBe(direction)
  })

  it('renders props.direction on the root element with `row-reverse`', () => {
    const direction = 'row-reverse'
    const wrapper = mount(SharingOptions, {
      propsData: { direction, ...propsData }
    })
    expect(wrapper.element.style['flex-direction']).toBe(direction)
  })

  it('renders props.direction on the root element with `column`', () => {
    const direction = 'column'
    const wrapper = mount(SharingOptions, {
      propsData: { direction, ...propsData }
    })
    expect(wrapper.element.style['flex-direction']).toBe(direction)
  })

  it('renders props.direction on the root element with `column-reverse`', () => {
    const direction = 'column-reverse'
    const wrapper = mount(SharingOptions, {
      propsData: { direction, ...propsData }
    })
    expect(wrapper.element.style['flex-direction']).toBe(direction)
  })

  it('renders the embed button by default', () => {
    const wrapper = mount(SharingOptions, { propsData })
    expect(wrapper.find('.sharing-options__link--embed').element.style.display).not.toBe('none')
  })

  it('hides the embed button when props.noEmbed is passed', () => {
    const noEmbed = true
    const wrapper = mount(SharingOptions, {
      propsData: { noEmbed, ...propsData }
    })
    expect(wrapper.find('.sharing-options__link--embed').element.style.display).toBe('none')
  })

  it('hides the embed button when props.noEmbed is passed', () => {
    const noEmbed = true
    const wrapper = mount(SharingOptions, {
      propsData: { noEmbed, ...propsData }
    })
    expect(wrapper.find('.sharing-options__link--embed').element.style.display).toBe('none')
  })

  it('uses a generic title', () => {
    const wrapper = mount(SharingOptions, { propsData })
    expect(wrapper.vm.valuesFor('facebook').title).toBe('A title to share')
    expect(wrapper.vm.valuesFor('other').title).toBe('A title to share')
  })

  it('uses a dedicated title for Twitter', () => {
    const wrapper = mount(SharingOptions, { propsData })
    expect(wrapper.vm.valuesFor('twitter').title).toBe('A tweet to share #vue')
  })

  it('uses a dedicated description for Facebook', () => {
    const wrapper = mount(SharingOptions, { propsData })
    expect(wrapper.vm.valuesFor('facebook').description).toBe('A short description for facebook but not for the other network')
  })

  it('toggles the embed form', () => {
    const wrapper = mount(SharingOptions, { propsData })
    wrapper.vm.$refs.embedForm.show = vi.fn()
    expect(wrapper.vm.$refs.embedForm.show.mock.calls.length).toBe(0)
    wrapper.vm.showEmbedForm()
    expect(wrapper.vm.$refs.embedForm.show.mock.calls.length).toBe(1)
  })

  it('uses the current location is none is given', () => {
    const wrapper = mount(SharingOptions, { })
    expect(wrapper.vm.url).toBe('http://localhost:3000/')
  })
})
