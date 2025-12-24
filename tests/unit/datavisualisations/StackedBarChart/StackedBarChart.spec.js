import { mount } from '@vue/test-utils'
import StackedBarChart from '@/datavisualisations/StackedBarChart/StackedBarChart.vue'

// Mock HTML element offset so the size of the chart can be calculated
// dynamicly using JSDOM and tests
Object.defineProperties(window.HTMLElement.prototype, {
  offsetWidth: {
    get() {
      return parseFloat(this.style.width) || 0
    }
  },
  offsetHeight: {
    get() {
      return parseFloat(this.style.height) || 0
    }
  }
})

describe('StackedBarChart.vue', () => {
  describe('a stacked-bars chart with two bars in four groups', () => {
    let wrapper

    beforeEach(async () => {
      vi.useFakeTimers()

      const propsData = {
        data: [
          { label: 'Avatar', budget: 237, box_office: 2784 },
          { label: 'ET: The Extra-Terrestrial', budget: 11, box_office: 793 },
          { label: 'Finding Nemo', budget: 94, box_office: 940 },
          { label: 'Ghostbusters', budget: 14, box_office: 229 }
        ]
      }

      wrapper = mount(StackedBarChart, { propsData })
    })

    afterEach(async () => {
      await vi.runAllTimersAsync()
      vi.useRealTimers()
    })

    it('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    it('creates four bars', async () => {
      expect(wrapper.findAll('.stacked-bar-chart__groups__item')).toHaveLength(4)
    })

    it('creates the first group of bars with maximum width', () => {
      const firstGroup = wrapper.findAll('.stacked-bar-chart__groups__item').at(0)
      const budgetBar = firstGroup.find('.stacked-bar-chart__groups__item__bars__item--budget')
      const boxOfficeBar = firstGroup.find('.stacked-bar-chart__groups__item__bars__item--box-office')
      const totalWidth = budgetBar.element.offsetWidth + boxOfficeBar.element.offsetWidth
      expect(totalWidth).toBe(100)
    })

    it('creates the second group of bars with ~27% width', () => {
      const secondGroup = wrapper.findAll('.stacked-bar-chart__groups__item').at(1)
      const budgetBar = secondGroup.find('.stacked-bar-chart__groups__item__bars__item--budget')
      const boxOfficeBar = secondGroup.find('.stacked-bar-chart__groups__item__bars__item--box-office')
      const totalWidth = Math.round(budgetBar.element.offsetWidth + boxOfficeBar.element.offsetWidth)
      expect(totalWidth).toBe(27)
    })

    it('creates the third group of bars with ~34% width', () => {
      const secondGroup = wrapper.findAll('.stacked-bar-chart__groups__item').at(2)
      const budgetBar = secondGroup.find('.stacked-bar-chart__groups__item__bars__item--budget')
      const boxOfficeBar = secondGroup.find('.stacked-bar-chart__groups__item__bars__item--box-office')
      const totalWidth = Math.round(budgetBar.element.offsetWidth + boxOfficeBar.element.offsetWidth)
      expect(totalWidth).toBe(34)
    })

    it('creates the first group of bars with budget taking ~8% width', () => {
      const firstGroup = wrapper.findAll('.stacked-bar-chart__groups__item').at(0)
      const budgetBar = firstGroup.find('.stacked-bar-chart__groups__item__bars__item--budget')
      const width = Math.round(budgetBar.element.offsetWidth)
      expect(width).toBe(8)
    })

    it('creates the first group of bars with box_office taking ~92% width', () => {
      const firstGroup = wrapper.findAll('.stacked-bar-chart__groups__item').at(0)
      const boxOfficeBar = firstGroup.find('.stacked-bar-chart__groups__item__bars__item--box-office')
      const width = Math.round(boxOfficeBar.element.offsetWidth)
      expect(width).toBe(92)
    })

    it('creates the first group with "Avatar" as label', () => {
      const firstGroup = wrapper.findAll('.stacked-bar-chart__groups__item').at(0)
      const label = firstGroup.find('.stacked-bar-chart__groups__item__label')
      expect(label.text()).toBe('Avatar')
    })

    it('creates the second group with "ET: The Extra-Terrestrial" as label', () => {
      const firstGroup = wrapper.findAll('.stacked-bar-chart__groups__item').at(1)
      const label = firstGroup.find('.stacked-bar-chart__groups__item__label')
      expect(label.text()).toBe('ET: The Extra-Terrestrial')
    })

    it('creates the first group with "Avatar" as label when ordered by "budget"', async () => {
      await wrapper.setProps({ sortBy: 'budget' })
      const firstGroup = wrapper.findAll('.stacked-bar-chart__groups__item').at(0)
      const label = firstGroup.find('.stacked-bar-chart__groups__item__label')
      expect(label.text()).toBe('ET: The Extra-Terrestrial')
    })

    it('creates a legend with "budget" and "box_office" items', () => {
      const budgetLegend = wrapper.findAll('.stacked-bar-chart__legend__item').at(0)
      const boxOfficeLegend = wrapper.findAll('.stacked-bar-chart__legend__item').at(1)
      expect(budgetLegend.text()).toBe('budget')
      expect(boxOfficeLegend.text()).toBe('box_office')
    })

    it('highlights the legend "budget"', async () => {
      const budgetLegend = wrapper.findAll('.stacked-bar-chart__legend__item').at(0)
      expect(budgetLegend.classes('stacked-bar-chart__legend__item--highlighted')).toBeFalsy()
      await budgetLegend.trigger('mouseover')
      await vi.advanceTimersByTimeAsync(wrapper.vm.highlightDelay)
      expect(budgetLegend.classes('stacked-bar-chart__legend__item--highlighted')).toBeTruthy()
    })

    it('highlights the bars for "budget"', async () => {
      const budgetLegend = wrapper.findAll('.stacked-bar-chart__legend__item').at(0)
      await budgetLegend.trigger('mouseover')
      await vi.advanceTimersByTimeAsync(wrapper.vm.highlightDelay)
      const budgetBars = wrapper.findAll('.stacked-bar-chart__groups__item__bars__item--budget')
      expect(budgetBars.at(0).classes('stacked-bar-chart__groups__item__bars__item--highlighted')).toBeTruthy()
      expect(budgetBars.at(1).classes('stacked-bar-chart__groups__item__bars__item--highlighted')).toBeTruthy()
      expect(budgetBars.at(2).classes('stacked-bar-chart__groups__item__bars__item--highlighted')).toBeTruthy()
      expect(budgetBars.at(3).classes('stacked-bar-chart__groups__item__bars__item--highlighted')).toBeTruthy()
    })

    it('highlights the bars for "box_office"', async () => {
      const boxOfficeLegend = wrapper.findAll('.stacked-bar-chart__legend__item').at(1)
      await boxOfficeLegend.trigger('mouseover')
      await vi.advanceTimersByTimeAsync(wrapper.vm.highlightDelay)
      const budgetBars = wrapper.findAll('.stacked-bar-chart__groups__item__bars__item--box-office')
      expect(budgetBars.at(0).classes('stacked-bar-chart__groups__item__bars__item--highlighted')).toBeTruthy()
      expect(budgetBars.at(1).classes('stacked-bar-chart__groups__item__bars__item--highlighted')).toBeTruthy()
      expect(budgetBars.at(2).classes('stacked-bar-chart__groups__item__bars__item--highlighted')).toBeTruthy()
      expect(budgetBars.at(3).classes('stacked-bar-chart__groups__item__bars__item--highlighted')).toBeTruthy()
    })

    it('highlights the legend "budget" on mouseover and "box_office" by default', async () => {
      await wrapper.setProps({ highlights: ['box_office'] })
      const budgetLegend = wrapper.findAll('.stacked-bar-chart__legend__item').at(0)
      const boxOfficeLegend = wrapper.findAll('.stacked-bar-chart__legend__item').at(1)
      expect(budgetLegend.classes('stacked-bar-chart__legend__item--highlighted')).toBeFalsy()
      expect(boxOfficeLegend.classes('stacked-bar-chart__legend__item--highlighted')).toBeTruthy()
      await budgetLegend.trigger('mouseover')
      await vi.advanceTimersByTimeAsync(wrapper.vm.highlightDelay)
      expect(budgetLegend.classes('stacked-bar-chart__legend__item--highlighted')).toBeTruthy()
      expect(boxOfficeLegend.classes('stacked-bar-chart__legend__item--highlighted')).toBeFalsy()
    })

    it('highlights the bars for "box_office" after a while', async () => {
      const boxOfficeLegend = wrapper.findAll('.stacked-bar-chart__legend__item').at(1)
      await boxOfficeLegend.trigger('mouseover')
      expect(boxOfficeLegend.classes('stacked-bar-chart__legend__item--highlighted')).toBeFalsy()
      await vi.advanceTimersByTimeAsync(wrapper.vm.highlightDelay / 2)
      expect(boxOfficeLegend.classes('stacked-bar-chart__legend__item--highlighted')).toBeFalsy()
      await vi.advanceTimersByTimeAsync(wrapper.vm.highlightDelay * 2)
      expect(boxOfficeLegend.classes('stacked-bar-chart__legend__item--highlighted')).toBeTruthy()
    })

    it('highlights the whole "Avatar" row', async () => {
      await wrapper.setProps({ rowHighlights: ['Avatar'] })
      const boxOffice = wrapper.findAll('.stacked-bar-chart__groups__item__bars__item').at(0)
      const budget = wrapper.findAll('.stacked-bar-chart__groups__item__bars__item').at(1)
      expect(boxOffice.classes('stacked-bar-chart__groups__item__bars__item--highlighted')).toBeTruthy()
      expect(budget.classes('stacked-bar-chart__groups__item__bars__item--highlighted')).toBeTruthy()
    })

    it('highlights the whole "Ghostbusters" row', async () => {
      await wrapper.setProps({ rowHighlights: ['Ghostbusters'] })
      const boxOffice = wrapper.findAll('.stacked-bar-chart__groups__item__bars__item').at(6)
      const budget = wrapper.findAll('.stacked-bar-chart__groups__item__bars__item').at(7)
      expect(boxOffice.classes('stacked-bar-chart__groups__item__bars__item--highlighted')).toBeTruthy()
      expect(budget.classes('stacked-bar-chart__groups__item__bars__item--highlighted')).toBeTruthy()
    })

    it('creates bars with specific colors', async () => {
      await wrapper.setProps({ barColors: ['#000', '#444'] })
      const firstGroup = wrapper.findAll('.stacked-bar-chart__groups__item').at(0)
      const budgetBar = firstGroup.find('.stacked-bar-chart__groups__item__bars__item--budget')
      const boxOfficeBar = firstGroup.find('.stacked-bar-chart__groups__item__bars__item--box-office')
      expect(budgetBar.element.style['background-color']).toBe('rgb(0, 0, 0)')
      expect(boxOfficeBar.element.style['background-color']).toBe('rgb(68, 68, 68)')
    })

    it('creates legend with specific colors', async () => {
      await wrapper.setProps({ barColors: ['#000', '#444'] })
      const legendBoxes = wrapper.findAll('.stacked-bar-chart__legend__item__box')
      const budgetBox = legendBoxes.at(0)
      const boxOfficeBox = legendBoxes.at(1)
      expect(budgetBox.element.style['background-color']).toBe('rgb(0, 0, 0)')
      expect(boxOfficeBox.element.style['background-color']).toBe('rgb(68, 68, 68)')
    })

    it('creates one legend when using explicit keys', async () => {
      await wrapper.setProps({ keys: ['box_office'] })
      const legendItems = wrapper.findAll('.stacked-bar-chart__legend__item')
      expect(legendItems).toHaveLength(1)
    })

    it('creates one bar when using explicit keys', async () => {
      await wrapper.setProps({ keys: ['box_office'] })
      const firstGroup = wrapper.findAll('.stacked-bar-chart__groups__item').at(0)
      const bars = firstGroup.findAll('.stacked-bar-chart__groups__item__bars__item')
      expect(bars).toHaveLength(1)
    })

    it('creates legend with custom group names', async () => {
      await wrapper.setProps({ groups: ['Budget', 'Box Office'] })
      const legendItems = wrapper.findAll('.stacked-bar-chart__legend__item')
      expect(legendItems.at(0).text()).toBe('Budget')
      expect(legendItems.at(1).text()).toBe('Box Office')
    })

    it('creates bar direct labeling without formatting', async () => {
      const firstGroup = wrapper.findAll('.stacked-bar-chart__groups__item').at(0)
      const values = firstGroup.findAll('.stacked-bar-chart__groups__item__bars__item__value')
      expect(values.at(0).text()).toBe('237')
      expect(values.at(1).text()).toBe('2784')
    })

    it('creates bar direct labeling without with currency formatting', async () => {
      await wrapper.setProps({ xAxisTickFormat: '$,' })
      const firstGroup = wrapper.findAll('.stacked-bar-chart__groups__item').at(0)
      const values = firstGroup.findAll('.stacked-bar-chart__groups__item__bars__item__value')
      expect(values.at(0).text()).toBe('$237')
      expect(values.at(1).text()).toBe('$2,784')
    })
  })

  describe('a stacked-bars chart with 3 bars in 3 groups with empty values', () => {
    let wrapper

    beforeEach(async () => {
      const propsData = {
        labelField: 'label',
        fixedHeight: 500,
        hideEmptyValues: true,
        highlightDelay: 0,
        data: [
          { 'label': 'today', 'foo': 90, 'baz 1': 5, 'baz 2': 5 },
          { 'label': 'tomorrow', 'foo': 40, 'baz 1': 10, 'baz 2': 0 },
          { 'label': 'next week', 'foo': 0, 'baz 1': 20, 'baz 2': 0 }
        ]
      }

      const attrs = {
        style: 'width: 600px'
      }

      wrapper = mount(StackedBarChart, { propsData, attrs })
    })

    it('is a Vue instance', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    it('creates 3 bars', async () => {
      expect(wrapper.findAll('.stacked-bar-chart__groups__item')).toHaveLength(3)
    })

    it('creates the first bar with no hidden bars', () => {
      const group = wrapper.findAll('.stacked-bar-chart__groups__item').at(0)
      const hiddenBars = group.findAll('.stacked-bar-chart__groups__item__bars__item--hidden')
      expect(hiddenBars).toHaveLength(0)
    })

    it('creates the first bar with normalized classes on bar', () => {
      const group = wrapper.findAll('.stacked-bar-chart__groups__item').at(0)
      const items = group.findAll('.stacked-bar-chart__groups__item__bars__item')
      expect(items.at(0).classes('stacked-bar-chart__groups__item__bars__item--foo')).toBeTruthy()
      expect(items.at(1).classes('stacked-bar-chart__groups__item__bars__item--baz-1')).toBeTruthy()
      expect(items.at(2).classes('stacked-bar-chart__groups__item__bars__item--baz-2')).toBeTruthy()
    })

    it('creates the second bar with one hidden bar', () => {
      const group = wrapper.findAll('.stacked-bar-chart__groups__item').at(1)
      const hiddenBars = group.findAll('.stacked-bar-chart__groups__item__bars__item--hidden')
      expect(hiddenBars).toHaveLength(1)
    })

    it('creates the third bar with two hidden bars', () => {
      const group = wrapper.findAll('.stacked-bar-chart__groups__item').at(2)
      const hiddenBars = group.findAll('.stacked-bar-chart__groups__item__bars__item--hidden')
      expect(hiddenBars).toHaveLength(2)
    })
  })
})
