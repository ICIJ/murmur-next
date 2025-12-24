import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import EmbeddableFooter from '@/components/EmbeddableFooter/EmbeddableFooter.vue'

describe('EmbeddableFooter.vue', () => {
  it('is a Vue instance', () => {
    const wrapper = shallowMount(EmbeddableFooter)
    expect(wrapper.vm).toBeTruthy()
  })
})
