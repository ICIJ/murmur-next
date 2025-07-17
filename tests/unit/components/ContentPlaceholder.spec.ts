import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ContentPlaceholder from '@/components/ContentPlaceholder.vue'

describe('ContentPlaceholder.vue', () => {
  it('is a Vue instance', () => {
    const wrapper = shallowMount(ContentPlaceholder)
    expect(wrapper.vm).toBeTruthy()
  })

  it('renders props.rows when passed', () => {
    const rows = [
      {
        height: '1em',
        boxes: [
          [0, 10],
          [0, 20]
        ]
      },
      {
        height: '1em',
        boxes: [[0, 10]]
      }
    ]

    const wrapper = shallowMount(ContentPlaceholder, {
      propsData: { rows }
    })

    expect(wrapper.findAll('.content-placeholder__wrapper__row').length).toBe(2)
  })
})
