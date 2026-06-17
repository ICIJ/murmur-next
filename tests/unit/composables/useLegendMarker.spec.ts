import { ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { useLegendMarker } from '@/composables/useLegendMarker'
import type { LegendMarkerDatum } from '@/composables/useLegendMarker'

const datum: LegendMarkerDatum = {
  id: 'paris',
  color: '#6e40aa',
  label: 'Paris, France'
}

describe('useLegendMarker', () => {
  describe('markerPathFunction', () => {
    it('returns the constant path string regardless of the datum', () => {
      const { markerPathFunction } = useLegendMarker(ref('M0 0 L1 1'))
      expect(markerPathFunction()).toBe('M0 0 L1 1')
      expect(markerPathFunction(datum)).toBe('M0 0 L1 1')
    })

    it('applies the per-datum path function when a datum is given', () => {
      const { markerPathFunction } = useLegendMarker(
        ref((d: LegendMarkerDatum) => `path-for-${d.id}`)
      )
      expect(markerPathFunction(datum)).toBe('path-for-paris')
    })

    it('returns the function itself (not its result) when no datum is given', () => {
      // Preserved behaviour: a path function with no datum falls through to the
      // `as string` branch and is returned as-is rather than invoked.
      const pathFn = (d: LegendMarkerDatum) => `path-for-${d.id}`
      const { markerPathFunction } = useLegendMarker(ref(pathFn))
      expect(markerPathFunction()).toBe(pathFn)
    })
  })

  describe('markerViewbox', () => {
    it('builds a viewBox string from the measured marker box', () => {
      const { markerViewbox } = useLegendMarker(ref('M0 0 L10 10'))
      // jsdom returns a zero-sized bounding box, so the viewBox falls back to 0s.
      expect(markerViewbox.value).toMatch(/^0 0 \d+ \d+$/)
    })
  })
})
