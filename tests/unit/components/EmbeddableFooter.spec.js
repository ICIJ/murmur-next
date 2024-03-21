import { shallowMount } from '@vue/test-utils'
import EmbeddableFooter from '@/components/EmbeddableFooter.vue'

describe('EmbeddableFooter.vue', () => {
  it('is a Vue instance', () => {
    const wrapper = shallowMount(EmbeddableFooter)
    expect(wrapper.vm).toBeTruthy()
  })
})
