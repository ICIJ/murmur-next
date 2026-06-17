import { ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { useFormAdvancedLink } from '@/composables/useFormAdvancedLink'
import { AdvancedLinkTab } from '@/enums'

// Mirrors the metadata the form component builds, kept i18n-free for the test.
function buildTab(type: AdvancedLinkTab): { title: string, id: string } {
  return { title: `title-${type}`, id: `tab-${type}` }
}

describe('useFormAdvancedLink', () => {
  it('keeps the canonical tab order regardless of the requested order', () => {
    const { tabs } = useFormAdvancedLink({
      forms: [AdvancedLinkTab.html, AdvancedLinkTab.raw, AdvancedLinkTab.markdown, AdvancedLinkTab.rich],
      buildTab,
      index: ref<number | undefined>(undefined)
    })
    expect(tabs.value.map(tab => tab.type)).toEqual([
      AdvancedLinkTab.raw,
      AdvancedLinkTab.rich,
      AdvancedLinkTab.markdown,
      AdvancedLinkTab.html
    ])
  })

  it('filters out the formats that are not requested', () => {
    const { tabs } = useFormAdvancedLink({
      forms: [AdvancedLinkTab.raw, AdvancedLinkTab.markdown, AdvancedLinkTab.html],
      buildTab,
      index: ref<number | undefined>(undefined)
    })
    expect(tabs.value.map(tab => tab.type)).toEqual([
      AdvancedLinkTab.raw,
      AdvancedLinkTab.markdown,
      AdvancedLinkTab.html
    ])
  })

  it('builds the title and id through the provided mapper', () => {
    const { tabs } = useFormAdvancedLink({
      forms: [AdvancedLinkTab.raw],
      buildTab,
      index: ref<number | undefined>(undefined)
    })
    expect(tabs.value[0]).toEqual({ type: AdvancedLinkTab.raw, title: 'title-raw', id: 'tab-raw' })
  })

  it('defaults the active tab to the first one when no index is set', () => {
    const { activeForm } = useFormAdvancedLink({
      forms: [AdvancedLinkTab.raw, AdvancedLinkTab.rich],
      buildTab,
      index: ref<number | undefined>(undefined)
    })
    expect(activeForm.value).toBe('tab-raw')
  })

  it('resolves the active tab id from an in-range index', () => {
    const { activeForm } = useFormAdvancedLink({
      forms: [AdvancedLinkTab.raw, AdvancedLinkTab.rich, AdvancedLinkTab.markdown],
      buildTab,
      index: ref<number | undefined>(2)
    })
    expect(activeForm.value).toBe('tab-markdown')
  })

  it('falls back to the first tab when the index is out of range', () => {
    const { activeForm } = useFormAdvancedLink({
      forms: [AdvancedLinkTab.raw, AdvancedLinkTab.rich],
      buildTab,
      index: ref<number | undefined>(5)
    })
    expect(activeForm.value).toBe('tab-raw')
  })

  it('writes the matching index back when a known tab id is selected', () => {
    const index = ref<number | undefined>(0)
    const { onUpdate } = useFormAdvancedLink({
      forms: [AdvancedLinkTab.raw, AdvancedLinkTab.rich, AdvancedLinkTab.markdown],
      buildTab,
      index
    })
    onUpdate('tab-markdown')
    expect(index.value).toBe(2)
  })

  it('resets the index to zero when an unknown tab id is selected', () => {
    const index = ref<number | undefined>(2)
    const { onUpdate } = useFormAdvancedLink({
      forms: [AdvancedLinkTab.raw, AdvancedLinkTab.rich, AdvancedLinkTab.markdown],
      buildTab,
      index
    })
    onUpdate('tab-unknown')
    expect(index.value).toBe(0)
  })
})
