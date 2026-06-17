import { ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { useBrandExpansion } from '@/composables/useBrandExpansion'
import { BrandMode } from '@/enums'

describe('useBrandExpansion', () => {
  it('scales the short-mode width proportionally to the height', () => {
    const { width, height } = useBrandExpansion({
      size: ref(200),
      mode: ref(BrandMode.Short),
      color: ref(null),
      background: ref(null),
      responsive: ref(false)
    })
    // At the reference height of 200 the width equals the intrinsic width.
    expect(width.value).toBe('401.256px')
    expect(height.value).toBe('200px')
  })

  it('selects the intrinsic width matching the brand mode', () => {
    const { width } = useBrandExpansion({
      size: ref(200),
      mode: ref(BrandMode.Long),
      color: ref(null),
      background: ref(null),
      responsive: ref(false)
    })
    expect(width.value).toBe('1047.01px')
  })

  it('parses a string size into a numeric height', () => {
    const { width, height } = useBrandExpansion({
      size: ref('100px'),
      mode: ref(BrandMode.Medium),
      color: ref(null),
      background: ref(null),
      responsive: ref(false)
    })
    expect(height.value).toBe('100px')
    // (901.24 / 200) * 100 = 450.62
    expect(width.value).toBe('450.62px')
  })

  it('reacts to a brand mode change', () => {
    const mode = ref(BrandMode.Short)
    const { width } = useBrandExpansion({
      size: ref(200),
      mode,
      color: ref(null),
      background: ref(null),
      responsive: ref(false)
    })
    expect(width.value).toBe('401.256px')
    mode.value = BrandMode.Medium
    expect(width.value).toBe('901.24px')
  })

  it('uses a fluid width in responsive mode', () => {
    const { width } = useBrandExpansion({
      size: ref(200),
      mode: ref(BrandMode.Short),
      color: ref(null),
      background: ref(null),
      responsive: ref(true)
    })
    expect(width.value).toBe('100%')
  })

  it('exposes color and background through the style binding', () => {
    const { style } = useBrandExpansion({
      size: ref(200),
      mode: ref(BrandMode.Short),
      color: ref('#ff0000'),
      background: ref('#000000'),
      responsive: ref(false)
    })
    expect(style.value['--monochrome-color']).toBe('#ff0000')
    expect(style.value.background).toBe('#000000')
  })
})
