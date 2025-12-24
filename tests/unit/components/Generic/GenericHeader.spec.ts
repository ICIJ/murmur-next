import { shallowMount, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import GenericHeader from '@/components/Generic/GenericHeader.vue'

describe('GenericHeader.vue', () => {
  it('is a Vue instance', () => {
    const wrapper = shallowMount(GenericHeader)
    expect(wrapper.vm).toBeTruthy()
  })

  it('renders the header as a `headroom` component', () => {
    const wrapper = shallowMount(GenericHeader)
    expect(wrapper.find('#generic-header').element.tagName).toBe('VUE-HEADROOM-STUB')
  })

  it('renders the header as a div', () => {
    const noHeadroom = true
    const wrapper = shallowMount(GenericHeader, {
      propsData: { noHeadroom }
    })
    expect(wrapper.find('#generic-header').element.tagName).toBe('DIV')
  })

  it('sets the header position to `fixed` by default', () => {
    const wrapper = shallowMount(GenericHeader)
    expect(wrapper.find('#generic-header').element.style.position).toBe('fixed')
  })

  it('sets the header position to `relative`', () => {
    const position = 'relative'
    const wrapper = shallowMount(GenericHeader, {
      propsData: { position }
    })
    expect(wrapper.find('#generic-header').element.style.position).toBe(position)
  })

  it('sets the header position to `absolute`', () => {
    const position = 'absolute'
    const wrapper = shallowMount(GenericHeader, {
      propsData: { position }
    })
    expect(wrapper.find('#generic-header').element.style.position).toBe(position)
  })

  it('renders home link to the default value', () => {
    const homeUrl = 'http://localhost:3000/'
    const wrapper = shallowMount(GenericHeader, {
      global: { renderStubDefaultSlot: true }
    })
    const brandElement = wrapper.find('.generic-header__brand').element as HTMLAnchorElement
    expect(brandElement.href).toBe(homeUrl)
  })

  it('renders home link to https://icij.org/', () => {
    const homeUrl = 'https://icij.org/'
    const wrapper = shallowMount(GenericHeader, {
      propsData: { homeUrl },
      global: { renderStubDefaultSlot: true }
    })
    const brandElement = wrapper.find('.generic-header__brand').element as HTMLAnchorElement
    expect(brandElement.href).toBe(homeUrl)
  })

  it('renders home link to https://pirhoo.com/', () => {
    const homeUrl = 'https://pirhoo.com/'
    const wrapper = shallowMount(GenericHeader, {
      propsData: { homeUrl },
      global: { renderStubDefaultSlot: true }
    })
    const brandElement = wrapper.find('.generic-header__brand').element as HTMLAnchorElement
    expect(brandElement.href).toBe(homeUrl)
  })

  it('renders the navbar as `collapse` by default', () => {
    const wrapper = shallowMount(GenericHeader, {
      global: { renderStubDefaultSlot: true }
    })
    expect(wrapper.find('.navbar-collapse').classes('collapse')).toBeTruthy()
  })

  it('toggles the navbar on navbarToggler click', async () => {
    const wrapper = shallowMount(GenericHeader, {
      global: { renderStubDefaultSlot: true }
    })
    expect(wrapper.find('.navbar-collapse').classes('collapse')).toBeTruthy()
    const navbarToggler = wrapper.find('.navbar-toggler')
    await navbarToggler.trigger('click')
    expect(wrapper.find('.navbar-collapse').classes('collapse')).toBeFalsy()
    expect(wrapper.vm.showFollowUsPopover).toBe(false)
    await navbarToggler.trigger('click')
    expect(wrapper.find('.navbar-collapse').classes('collapse')).toBeTruthy()
  })
  it('hides popover if shown when navbar is collapsed', async () => {
    const wrapper = mount(GenericHeader, {
      global: {
        renderStubDefaultSlot: true,
        stubs: { teleport: true, BPopover: true, FollowUsPopover: true }
      }
    })
    const popovertoggler = wrapper.find('#follow-us-toggler')
    await popovertoggler.trigger('mouseenter')
    // given popover shown
    expect(wrapper.vm.showFollowUsPopover).toBe(true)
    const navbarToggler = wrapper.find('.navbar-toggler')
    // when show navbar
    await navbarToggler.trigger('click')
    // popover should be hidden
    expect(wrapper.vm.showFollowUsPopover).toBe(false)
  })
  it('should show on mouseenter then hide popover', async () => {
    const wrapper = mount(GenericHeader, {
      global: {
        renderStubDefaultSlot: true,
        stubs: { teleport: true, BPopover: true, FollowUsPopover: true }
      }
    })
    const popovertoggler = wrapper.find('#follow-us-toggler')
    await popovertoggler.trigger('mouseenter')
    expect(wrapper.vm.showFollowUsPopover).toBe(true)

    wrapper.vm.closeFollowUsPopover()
    expect(wrapper.vm.showFollowUsPopover).toBe(false)
  })
})
