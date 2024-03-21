import { shallowMount, mount, flushPromises } from '@vue/test-utils'
import SelectableDropdown from '@/components/SelectableDropdown.vue'

const KEY_UP_CODE = 38
const KEY_DOWN_CODE = 40
const KEY_MAP = {}

// Wrapper the addEventListener to trigger events
window.addEventListener = vi.fn((event, cb) => {
  KEY_MAP[event] = cb
})

describe('SelectableDropdown.vue', () => {
  beforeAll(() => {
    // Removes warning about IntersectionObserver used in vue virtual scroller
    // but not implemented in jsdom
    const mockIntersectionObserver = vi.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    })
    window.IntersectionObserver = mockIntersectionObserver
  })
  afterAll(() => {
    window.IntersectionObserver.mockClear()
  })
  it('is a Vue instance', () => {
    const wrapper = mount(SelectableDropdown)
    expect(wrapper.vm).toBeTruthy()
  })

  it('has a list of items', async () => {
    const propsData = {
      items: ['Lesotho', 'Senegal', 'Djibouti'],
      hide: false
    }
    const wrapper = mount(SelectableDropdown, { propsData })
    await flushPromises()
    expect(wrapper.findAll('.dropdown-item')).toHaveLength(3)
  })

  it('has a list of items written in upper case', async () => {
    const propsData = {
      items: ['Lesotho', 'Senegal', 'Djibouti'],
      serializer: (c) => c.toUpperCase()
    }
    const wrapper = mount(SelectableDropdown, { propsData })
    await flushPromises()

    expect(wrapper.findAll('.dropdown-item').at(0).text()).toBe('LESOTHO')
    expect(wrapper.findAll('.dropdown-item').at(1).text()).toBe('SENEGAL')
    expect(wrapper.findAll('.dropdown-item').at(2).text()).toBe('DJIBOUTI')
  })

  it('has a list a `list` class', () => {
    const propsData = {
      items: ['Lesotho', 'Senegal', 'Djibouti'],
      listClass: 'list'
    }
    const wrapper = mount(SelectableDropdown, { propsData })
    expect(wrapper.find('.list').exists()).toBeTruthy()
  })

  it('has a list of items with a `item` class', async () => {
    const propsData = {
      items: ['Lesotho', 'Senegal', 'Djibouti'],
      itemClass: 'item'
    }
    const wrapper = mount(SelectableDropdown, { propsData })
    await flushPromises()

    expect(wrapper.findAll('.item').at(0).text()).toBe('Lesotho')
    expect(wrapper.findAll('.item').at(1).text()).toBe('Senegal')
    expect(wrapper.findAll('.item').at(2).text()).toBe('Djibouti')
  })

  it('updates active indexes when hitting arrow down', async () => {
    const propsData = {
      items: ['Lesotho', 'Senegal', 'Djibouti'],
      modelValue: 'Lesotho'
    }
    const wrapper = mount(SelectableDropdown, { propsData })
    await flushPromises()

    expect(wrapper.vm.activeItems).toContain('Lesotho')
    KEY_MAP.keydown({ keyCode: KEY_DOWN_CODE })
    expect(wrapper.vm.activeItems).toContain('Senegal')
    KEY_MAP.keydown({ keyCode: KEY_DOWN_CODE })
    expect(wrapper.vm.activeItems).toContain('Djibouti')
  })

  it('updates active indexes when hitting arrow up', async () => {
    const propsData = {
      items: ['Lesotho', 'Senegal', 'Djibouti'],
      modelValue: 'Djibouti'
    }
    const wrapper = mount(SelectableDropdown, { propsData })
    await flushPromises()

    expect(wrapper.vm.activeItems).toContain('Djibouti')
    KEY_MAP.keydown({ keyCode: KEY_UP_CODE })
    expect(wrapper.vm.activeItems).toContain('Senegal')
    KEY_MAP.keydown({ keyCode: KEY_UP_CODE })
    expect(wrapper.vm.activeItems).toContain('Lesotho')
  })

  it('emits a `update:modelValue` event when a value is selected', async () => {
    const propsData = {
      items: ['Lesotho', 'Senegal', 'Djibouti'],
      modelValue: 'Djibouti'
    }
    const wrapper = mount(SelectableDropdown, { propsData })
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')[0]).toContain('Djibouti')

    await wrapper.find('#dropdown-item-lesotho').trigger('click')
    expect(wrapper.emitted('update:modelValue')[1]).toContain('Lesotho')

    await wrapper.find('#dropdown-item-senegal').trigger('click')
    expect(wrapper.emitted('update:modelValue')[2]).toContain('Senegal')
  })

  it('emits a `click` event when user click on an item', async () => {
    const propsData = { items: ['Lesotho', 'Senegal', 'Djibouti'] }
    const wrapper = mount(SelectableDropdown, { propsData })
    await flushPromises()

    const findAll = wrapper.findAll('.dropdown-item')
    await findAll.at(0).trigger('click') //TODO fix me
    expect(wrapper.emitted('click')[0]).toContain('Lesotho')
    await findAll.at(1).trigger('click') //TODO fix me
    expect(wrapper.emitted('click')[1]).toContain('Senegal')
    await findAll.at(0).trigger('click') //TODO fix me
    expect(wrapper.emitted('click')[2]).toContain('Lesotho')
  })

  it('emits a `click` event when using `clickToSelectItem` method', () => {
    const propsData = { items: ['Lesotho', 'Senegal', 'Djibouti'] }
    const wrapper = mount(SelectableDropdown, { propsData })

    wrapper.vm.clickToSelectItem('Lesotho')
    expect(wrapper.emitted().click[0]).toContain('Lesotho')
    wrapper.vm.clickToSelectItem('Senegal')
    expect(wrapper.emitted().click[1]).toContain('Senegal')
    wrapper.vm.clickToSelectItem('Lesotho')
    expect(wrapper.emitted().click[2]).toContain('Lesotho')
  })

  describe('itemActivated', () => {
    it('set item as activated for multiple and items is an array of string', () => {
      const propsData = {
        items: ['Lesotho', 'Senegal', 'Djibouti'],
        modelValue: ['Lesotho'],
        multiple: true
      }
      const wrapper = mount(SelectableDropdown, { propsData })

      expect(wrapper.vm.itemActivated('Lesotho')).toBeTruthy()
      expect(wrapper.vm.itemActivated('Senegal')).toBeFalsy()
    })

    it('set item as activated for multiple and items is an array of objects', () => {
      const eq = (item, other) => item.label === other.label
      const propsData = {
        items: [
          { label: 'Lesotho' },
          { label: 'Senegal' },
          { label: 'Djibouti' }
        ],
        modelValue: [{ label: 'Lesotho' }],
        multiple: true,
        eq
      }
      const wrapper = mount(SelectableDropdown, { propsData })

      expect(wrapper.vm.itemActivated({ label: 'Lesotho' })).toBeTruthy()
      expect(wrapper.vm.itemActivated({ label: 'Senegal' })).toBeFalsy()
    })
  })

  describe('Large number of selectable options', () => {
    it('it displays only 7 items in the DOM on the 20 items given', async () => {
      const twentyItems = Array.from(Array(20).keys())
      const propsData = { items: twentyItems }
      const wrapper = mount(SelectableDropdown, { propsData })
      await flushPromises()

      expect(wrapper.findAll('.dropdown-item')).toHaveLength(7)
    })
  })
})
