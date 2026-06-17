import { ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { useEmbedForm } from '@/composables/useEmbedForm'

describe('useEmbedForm', () => {
  const url = 'https://projects.icij.org/the-implant-files/graphics/'

  it('resolves currentUrl from the provided url', () => {
    const { currentUrl } = useEmbedForm({
      url,
      width: '100%',
      height: 480,
      minWidth: 0,
      minHeight: 0
    })
    expect(currentUrl.value).toBe(url)
  })

  it('falls back to the window location when no url is given', () => {
    const { currentUrl } = useEmbedForm({
      url: null,
      width: '100%',
      height: 480,
      minWidth: 0,
      minHeight: 0
    })
    expect(currentUrl.value).toBe(window.location.href)
  })

  it('builds a plain iframe snippet by default', () => {
    const { embedCode } = useEmbedForm({
      url,
      width: '100%',
      height: 480,
      minWidth: 0,
      minHeight: 0
    })
    expect(embedCode()).toBe(
      `<iframe width="100%" height="480" src="${url}" frameborder="0" allowfullscreen></iframe>`
    )
  })

  it('strips Pym parameters from the embedded url', () => {
    const { embedCode } = useEmbedForm({
      url: `${url}?initialWidth=720&childId=example-graphic`,
      width: 720,
      height: 480,
      minWidth: 0,
      minHeight: 0
    })
    expect(embedCode()).toBe(
      `<iframe width="720" height="480" src="${url}" frameborder="0" allowfullscreen></iframe>`
    )
  })

  it('uses a string width verbatim', () => {
    const { embedCode } = useEmbedForm({
      url,
      width: '50%',
      height: 480,
      minWidth: 1000,
      minHeight: 0
    })
    expect(embedCode()).toContain('width="50%"')
  })

  it('clamps a numeric width to minWidth', () => {
    const { embedCode } = useEmbedForm({
      url,
      width: 200,
      height: 480,
      minWidth: 500,
      minHeight: 0
    })
    expect(embedCode()).toContain('width="500"')
  })

  it('clamps height to minHeight', () => {
    const { embedCode } = useEmbedForm({
      url,
      width: '100%',
      height: 100,
      minWidth: 0,
      minHeight: 300
    })
    expect(embedCode()).toContain('height="300"')
  })

  it('builds the responsive Pym snippet when requested', () => {
    const { embedCode } = useEmbedForm({
      url,
      width: '100%',
      height: 480,
      minWidth: 0,
      minHeight: 0
    })
    const snippet = embedCode(true)
    expect(snippet.startsWith('<script ')).toBe(true)
    expect(snippet).toContain(url)
  })

  it('tracks reactive sizing inputs', () => {
    const height = ref(100)
    const { embedCode } = useEmbedForm({
      url,
      width: '100%',
      height,
      minWidth: 0,
      minHeight: 0
    })
    expect(embedCode()).toContain('height="100"')
    height.value = 750
    expect(embedCode()).toContain('height="750"')
  })
})
