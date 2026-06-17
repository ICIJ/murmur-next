import { ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { useAppIcon } from '@/composables/useAppIcon'
import type { UseAppIconOptions } from '@/composables/useAppIcon'

// Builds a fully-populated options object so each test only overrides what it needs.
function buildOptions(overrides: Partial<UseAppIconOptions> = {}): UseAppIconOptions {
  return {
    size: ref(undefined),
    scale: ref(1),
    variant: ref(undefined),
    hoverVariant: ref(undefined),
    hover: ref(undefined),
    spinDuration: ref('1s'),
    beatDuration: ref('1s'),
    fadeDuration: ref('1s'),
    spin: ref(undefined),
    spinReverse: ref(undefined),
    beat: ref(undefined),
    fade: ref(undefined),
    ...overrides
  }
}

describe('useAppIcon', () => {
  describe('size classification', () => {
    const presetSizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']

    presetSizes.forEach((size) => {
      it(`flags "${size}" as a preset size`, () => {
        const { hasSize, isRawSize, isPercentSize } = useAppIcon(buildOptions({ size: ref(size) }))
        expect(hasSize.value).toBe(true)
        expect(isRawSize.value).toBe(false)
        expect(isPercentSize.value).toBe(false)
      })
    })

    it('flags a pixel value as a raw size', () => {
      const { isRawSize, hasSize, isPercentSize } = useAppIcon(buildOptions({ size: ref('24px') }))
      expect(isRawSize.value).toBe(true)
      expect(hasSize.value).toBe(false)
      expect(isPercentSize.value).toBe(false)
    })

    it('flags a percentage value as a percent size, not a raw size', () => {
      const { isPercentSize, isRawSize } = useAppIcon(buildOptions({ size: ref('50%') }))
      expect(isPercentSize.value).toBe(true)
      expect(isRawSize.value).toBe(false)
    })

    it('treats an undefined size as neither raw nor preset', () => {
      const { isRawSize, hasSize, isPercentSize } = useAppIcon(buildOptions({ size: ref(undefined) }))
      expect(isRawSize.value).toBe(false)
      expect(hasSize.value).toBe(false)
      expect(isPercentSize.value).toBe(false)
    })
  })

  describe('color resolution', () => {
    it('defaults to currentColor with no variant', () => {
      const { color } = useAppIcon(buildOptions())
      expect(color.value).toBe('currentColor')
    })

    it('resolves the Bootstrap variable for a variant', () => {
      const { color } = useAppIcon(buildOptions({ variant: ref('primary') }))
      expect(color.value).toBe('var(--bs-primary, currentColor)')
    })

    it('layers the hover variant over the base variant while hovered', () => {
      const { color } = useAppIcon(buildOptions({ variant: ref('primary'), hoverVariant: ref('danger'), hover: ref(true) }))
      expect(color.value).toBe('var(--bs-danger, var(--bs-primary, currentColor))')
    })

    it('ignores the hover variant when not hovered', () => {
      const { color } = useAppIcon(buildOptions({ variant: ref('primary'), hoverVariant: ref('danger') }))
      expect(color.value).toBe('var(--bs-primary, currentColor)')
    })
  })

  describe('hover state', () => {
    it('seeds currentHover from the hover option', () => {
      const { currentHover } = useAppIcon(buildOptions({ hover: ref(true) }))
      expect(currentHover.value).toBe(true)
    })

    it('reflects hover option changes', async () => {
      const hover = ref(false)
      const { currentHover } = useAppIcon(buildOptions({ hover }))
      expect(currentHover.value).toBe(false)
      hover.value = true
      await Promise.resolve()
      expect(currentHover.value).toBe(true)
    })
  })

  describe('style and classList bindings', () => {
    it('exposes the raw size and scale custom properties', () => {
      const { style } = useAppIcon(buildOptions({ size: ref('24px'), scale: ref(2) }))
      expect(style.value['--app-icon-raw-size']).toBe('24px')
      expect(style.value['--app-icon-scale']).toBe(2)
    })

    it('toggles animation classes from their flags', () => {
      const { classList } = useAppIcon(buildOptions({ spin: ref(true), beat: ref(true) }))
      expect(classList.value['app-icon--spin']).toBe(true)
      expect(classList.value['app-icon--beat']).toBe(true)
      expect(classList.value['app-icon--fade']).toBeFalsy()
    })
  })
})
