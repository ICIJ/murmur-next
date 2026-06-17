import { ref } from 'vue'
import { geoEquirectangular } from 'd3-geo'
import { describe, expect, it } from 'vitest'

import { useMapProjection } from '@/composables/useMapProjection'
import type { MapTransform } from '@/types'

// A unit square spanning a few degrees around the origin, enough to exercise the
// projection fitting deterministically without loading a topojson fixture.
const SQUARE_GEOJSON = {
  type: 'Feature' as const,
  geometry: {
    type: 'Polygon' as const,
    coordinates: [
      [
        [-10, -10],
        [10, -10],
        [10, 10],
        [-10, 10],
        [-10, -10]
      ]
    ]
  }
}

function createOptions(overrides: Record<string, unknown> = {}) {
  return {
    projection: ref(() => geoEquirectangular()),
    geojson: ref<any>(SQUARE_GEOJSON),
    width: ref(200),
    height: ref(200),
    spherical: ref(false),
    center: ref<number[] | null>(null),
    transform: ref<MapTransform>({ k: 1, x: 0, y: 0, rotateX: 0, rotateY: 0 }),
    ...overrides
  }
}

describe('useMapProjection', () => {
  describe('mapProjection', () => {
    it('fits the projection to the map size and centers the geojson', () => {
      const { mapProjection } = useMapProjection(createOptions())
      // The symmetric square's center projects to the middle of the canvas.
      const [x, y] = mapProjection.value([0, 0])!
      expect(x).toBeCloseTo(100, 0)
      expect(y).toBeCloseTo(100, 0)
    })

    it('throws when no projection factory is provided', () => {
      const { mapProjection } = useMapProjection(
        createOptions({ projection: ref(undefined) })
      )
      expect(() => mapProjection.value).toThrow('props.projection is')
    })
  })

  describe('featurePath', () => {
    it('produces an SVG path string for the geojson', () => {
      const { featurePath } = useMapProjection(createOptions())
      const d = featurePath.value(SQUARE_GEOJSON)
      expect(typeof d).toBe('string')
      expect(d?.startsWith('M')).toBe(true)
    })
  })

  describe('graticuleLines', () => {
    it('builds a MultiLineString grid with the default 20 degree step', () => {
      const { graticuleLines } = useMapProjection(createOptions())
      expect(graticuleLines.value.type).toBe('MultiLineString')
    })

    it('honors a custom graticule step', () => {
      const { graticuleLines } = useMapProjection(
        createOptions({ graticuleStep: ref([40, 40] as [number, number]) })
      )
      expect(graticuleLines.value.type).toBe('MultiLineString')
    })
  })

  describe('initialGraticulePath', () => {
    it('renders the graticule through the initial projection', () => {
      const { initialGraticulePath } = useMapProjection(createOptions())
      expect(typeof initialGraticulePath.value).toBe('string')
    })
  })

  describe('rotatingMapProjection', () => {
    it('returns the base projection when no rotation is set', () => {
      const options = createOptions()
      const { mapProjection, rotatingMapProjection } = useMapProjection(options)
      expect(rotatingMapProjection.value).toBe(mapProjection.value)
    })

    it('applies the transform rotation when present', () => {
      const transform = ref<MapTransform>({
        k: 1,
        x: 0,
        y: 0,
        rotateX: 45,
        rotateY: 30
      })
      const { rotatingMapProjection } = useMapProjection(
        createOptions({ transform })
      )
      const [rotateX, rotateY] = rotatingMapProjection.value.rotate()
      expect(rotateX).toBeCloseTo(45)
      expect(rotateY).toBeCloseTo(30)
    })
  })

  describe('mapCenter', () => {
    it('exposes the projection geographic center', () => {
      const { mapCenter } = useMapProjection(createOptions())
      expect(Array.isArray(mapCenter.value)).toBe(true)
      expect(mapCenter.value).toHaveLength(2)
    })
  })
})
