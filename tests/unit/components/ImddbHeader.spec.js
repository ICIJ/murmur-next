import { mount, shallowMount } from '@vue/test-utils'
import ImddbHeader from '@/components/ImddbHeader.vue'

describe('ImddbHeader.vue', () => {
  //const global = {renderStubDefaultSlot: true}
  it('is a Vue instance', () => {
    const wrapper = shallowMount(ImddbHeader)
    expect(wrapper.vm).toBeTruthy()
  })

  it('renders the header as a `headroom` component', () => {
    const wrapper = shallowMount(ImddbHeader)
    expect(wrapper.findComponent('headroom-stub').exists()).toBe(true)
  })

  it('renders the header as a div', () => {
    const noHeadroom = true
    const wrapper = shallowMount(ImddbHeader, {
      propsData: { noHeadroom }
    })
    expect(wrapper.find('#imddb-header').element.tagName).toBe('DIV')
  })

  it('sets the header position to `fixed` by default', () => {
    const wrapper = shallowMount(ImddbHeader)
    expect(wrapper.find('#imddb-header').element.style.position).toBe('fixed')
  })

  it('sets the header position to `relative`', () => {
    const position = 'relative'
    const wrapper = shallowMount(ImddbHeader, {
      propsData: { position }
    })
    expect(wrapper.find('#imddb-header').element.style.position).toBe(position)
  })

  it('sets the header position to `absolute`', () => {
    const position = 'absolute'
    const wrapper = shallowMount(ImddbHeader, {
      propsData: { position }
    })
    expect(wrapper.find('#imddb-header').element.style.position).toBe(position)
  })

  it('renders home link to the default value', () => {
    const homeUrl = 'http://localhost:3000/'
    const wrapper = shallowMount(ImddbHeader, {
      global: { renderStubDefaultSlot: true }
    })
    expect(wrapper.find('.imddb-header__brand').element.href).toBe(homeUrl)
  })

  it('renders home link to https://icij.org/', () => {
    const homeUrl = 'https://icij.org/'
    const wrapper = shallowMount(ImddbHeader, {
      propsData: { homeUrl },
      global: { renderStubDefaultSlot: true }
    })
    expect(wrapper.find('.imddb-header__brand').element.href).toBe(homeUrl)
  })

  it('renders home link to https://pirhoo.com/', () => {
    const homeUrl = 'https://pirhoo.com/'
    const wrapper = shallowMount(ImddbHeader, {
      propsData: { homeUrl },
      global: { renderStubDefaultSlot: true }
    })
    expect(wrapper.find('.imddb-header__brand').element.href).toBe(homeUrl)
  })

  it('renders the navbar as `collapse` by default', () => {
    const wrapper = shallowMount(ImddbHeader, {
      global: { renderStubDefaultSlot: true }
    })
    expect(wrapper.find('.navbar-collapse').classes('collapse')).toBeTruthy()
  })

  it('toggles the navbar', async () => {
    const wrapper = shallowMount(ImddbHeader, {
      global: { renderStubDefaultSlot: true }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.navbar-collapse').classes('collapse')).toBeTruthy()
    wrapper.vm.toggleNavbar()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.navbar-collapse').classes('collapse')).toBeFalsy()
    wrapper.vm.toggleNavbar()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.navbar-collapse').classes('collapse')).toBeTruthy()
  })

  it("should show on mouseenter then hide popover'", async () => {
    const wrapper = mount(ImddbHeader, {
      global: { renderStubDefaultSlot: true },
      stubs: { teleport: true, BPopover: true, FollowUsPopover: true }
    })

    expect(wrapper.vm.showFollowUsPopover).toBe(false)
    const popovertoggler = wrapper.find('#follow-icij')
    await popovertoggler.trigger('mouseenter')
    expect(wrapper.vm.showFollowUsPopover).toBe(true)

    wrapper.vm.closeFollowUsPopover()
    expect(wrapper.vm.showFollowUsPopover).toBe(false)
  })
})
