import { ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { useTexturedDeck } from '@/composables/useTexturedDeck'
import { DeckTexture } from '@/enums'

// Builds the composable with sensible defaults, letting each test override only
// the option it exercises.
function buildTexturedDeck(overrides = {}) {
  const options = {
    modelValue: ref<DeckTexture | number>(DeckTexture.Brick),
    size: ref('cover'),
    black: ref(false),
    backgroundBaseUrl: ref('https://example.com'),
    ...overrides
  }
  return { ...useTexturedDeck(options), options }
}

describe('useTexturedDeck', () => {
  it('resolves the texture name from a name value', () => {
    const { textureName } = buildTexturedDeck({ modelValue: ref(DeckTexture.Rock) })
    expect(textureName.value).toBe('rock')
  })

  it('resolves the texture name from a numeric index', () => {
    // Index 0 is the first texture in the enumeration order (silk).
    const { textureName } = buildTexturedDeck({ modelValue: ref(0) })
    expect(textureName.value).toBe('silk')
  })

  it('clamps an unknown texture name back to the first texture', () => {
    const { textureName } = buildTexturedDeck({
      modelValue: ref('unknown' as unknown as DeckTexture)
    })
    expect(textureName.value).toBe('silk')
  })

  it('builds the default texture file name', () => {
    const { filename } = buildTexturedDeck({ modelValue: ref(DeckTexture.Sand) })
    expect(filename.value).toBe('texture-sand.jpg')
  })

  it('builds the black variant file name when black is enabled', () => {
    const { filename } = buildTexturedDeck({
      modelValue: ref(DeckTexture.Sand),
      black: ref(true)
    })
    expect(filename.value).toBe('texture-sand-black.jpg')
  })

  it('builds the absolute background URL from the base URL', () => {
    const { backgroundUrl } = buildTexturedDeck({
      modelValue: ref(DeckTexture.Carbon),
      backgroundBaseUrl: ref('https://cdn.example.com')
    })
    expect(backgroundUrl.value).toBe(
      'https://cdn.example.com/assets/img/texture-carbon.jpg'
    )
  })

  it('exposes the inline style with background size and image', () => {
    const { style } = buildTexturedDeck({
      modelValue: ref(DeckTexture.Crack),
      size: ref('contain'),
      backgroundBaseUrl: ref('https://example.com')
    })
    expect(style.value).toEqual({
      backgroundSize: 'contain',
      backgroundImage: 'url("https://example.com/assets/img/texture-crack.jpg")'
    })
  })

  it('returns an undefined texture name / texture-undefined.jpg for an out-of-range numeric index', () => {
    // A numeric index is intentionally not clamped; an out-of-range number
    // yields an undefined texture name (latent edge preserved).
    const { style } = buildTexturedDeck({
      modelValue: ref(99),
      backgroundBaseUrl: ref('https://example.com')
    })
    expect(style.value.backgroundImage).toContain('texture-undefined.jpg')
  })

  it('reacts to a change of the model value', () => {
    const modelValue = ref<DeckTexture | number>(DeckTexture.Brick)
    const { textureName } = buildTexturedDeck({ modelValue })
    expect(textureName.value).toBe('brick')
    modelValue.value = DeckTexture.Rock
    expect(textureName.value).toBe('rock')
  })
})
