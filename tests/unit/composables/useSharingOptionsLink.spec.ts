import { defineComponent, h, shallowRef } from 'vue'
import { mount } from '@vue/test-utils'

import {
  useSharingOptionsLink,
  networks,
  type SharingValues
} from '@/composables/useSharingOptionsLink'
import { SharingPlatform } from '@/enums'

type LinkApi = ReturnType<typeof useSharingOptionsLink>

// onUnmounted requires an active component instance, so the composable is
// exercised through a tiny host component.
function mountLink(network: SharingPlatform, values: SharingValues = {}) {
  const api = shallowRef<LinkApi>()
  const Host = defineComponent({
    setup() {
      api.value = useSharingOptionsLink(network, values)
      return () => h('div')
    }
  })
  const wrapper = mount(Host)
  return { wrapper, api: api.value as LinkApi }
}

describe('useSharingOptionsLink', () => {
  it('resolves the base URL per network', () => {
    expect(mountLink(SharingPlatform.facebook).api.base.value).toBe(
      networks.facebook.base
    )
    expect(mountLink(SharingPlatform.bluesky).api.base.value).toBe(
      networks.bluesky.base
    )
  })

  it('maps share values onto the network query parameters', () => {
    const { api } = mountLink(SharingPlatform.facebook, {
      url: 'https://icij.org',
      title: 'Foo'
    })
    expect(api.query.value.u).toBe('https://icij.org')
    expect(api.query.value.title).toBe('Foo')
  })

  it('renames the shared url for Bluesky', () => {
    const { api } = mountLink(SharingPlatform.bluesky, {
      url: 'https://icij.org',
      title: 'Foo'
    })
    expect(api.query.value.url).toBe('https://icij.org')
    expect(api.query.value.text).toBe('Foo')
  })

  it('skips empty share values', () => {
    const { api } = mountLink(SharingPlatform.facebook, { url: 'https://icij.org' })
    expect(api.query.value).not.toHaveProperty('title')
  })

  it('builds the full href from base and query', () => {
    const { api } = mountLink(SharingPlatform.linkedin, {
      url: 'https://icij.org',
      description: 'Foo'
    })
    expect(api.href.value).toBe(
      `${networks.linkedin.base}url=https%3A%2F%2Ficij.org&summary=Foo`
    )
  })

  it('reports a popup for every network but email', () => {
    expect(mountLink(SharingPlatform.facebook).api.hasPopup()).toBe(true)
    expect(mountLink(SharingPlatform.email).api.hasPopup()).toBe(false)
  })
})
