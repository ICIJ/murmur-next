import { ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { useSymbolMap } from '@/composables/useSymbolMap'

// A minimal topology with a single triangular feature, enough to fit the
// projection deterministically without loading a real topojson fixture.
const TOPOLOGY = {
  type: 'Topology' as const,
  arcs: [
    [
      [0, 0],
      [100, 0],
      [0, 100],
      [-100, -100]
    ]
  ],
  objects: {
    countries1: {
      type: 'GeometryCollection' as const,
      geometries: [{ type: 'Polygon' as const, arcs: [[0]] }]
    }
  }
}

const MARKERS = [
  { longitude: -10, latitude: 5, category: 'TECH' },
  { longitude: 20, latitude: -15, category: 'FINANCE' },
  { longitude: 0, latitude: 0, category: 'TECH' }
]

function createOptions(overrides: Record<string, unknown> = {}) {
  return {
    topojson: ref<any>(TOPOLOGY),
    loadedData: ref<any[]>(MARKERS),
    width: ref(400),
    height: ref(300),
    padding: ref(15),
    topojsonObjects: ref('countries1'),
    categoryObjectsPath: ref('category'),
    fitToMarkers: ref(false),
    ...overrides
  }
}

describe('useSymbolMap', () => {
  describe('geojson selection', () => {
    it('fits to the feature collection by default', () => {
      const { geojson, featuresGeojson } = useSymbolMap(createOptions())
      expect(geojson.value).toBe(featuresGeojson.value)
    })

    it('fits to the markers polygon when fitToMarkers is set', () => {
      const { geojson, markersGeojson } = useSymbolMap(
        createOptions({ fitToMarkers: ref(true) })
      )
      expect(geojson.value).toBe(markersGeojson.value)
    })
  })

  describe('coordinates and markersGeojson', () => {
    it('maps each marker to a [longitude, latitude] pair', () => {
      const { coordinates } = useSymbolMap(createOptions())
      expect(coordinates.value).toEqual([
        [-10, 5],
        [20, -15],
        [0, 0]
      ])
    })

    it('wraps the coordinates in a single polygon feature', () => {
      const { markersGeojson } = useSymbolMap(createOptions())
      expect(markersGeojson.value.type).toBe('Feature')
      expect(markersGeojson.value.geometry.type).toBe('Polygon')
      expect(markersGeojson.value.geometry.coordinates[0]).toHaveLength(3)
    })
  })

  describe('mapProjection', () => {
    it('keeps the fitted geometry within the padded extent', () => {
      const padding = 15
      const width = 400
      const height = 300
      const { featurePath, geojson } = useSymbolMap(
        createOptions({
          padding: ref(padding),
          width: ref(width),
          height: ref(height)
        })
      )
      // The path bounds reflect the fitted projection; every corner must sit
      // inside the inset box [padding, size - padding], proving fitExtent (not
      // fitSize) framing with edge padding (allowing a 1px rounding slack).
      const [[x0, y0], [x1, y1]] = featurePath.value.bounds(geojson.value as any)
      expect(x0).toBeGreaterThanOrEqual(padding - 1)
      expect(y0).toBeGreaterThanOrEqual(padding - 1)
      expect(x1).toBeLessThanOrEqual(width - padding + 1)
      expect(y1).toBeLessThanOrEqual(height - padding + 1)
    })
  })

  describe('featurePath', () => {
    it('produces an SVG path string for the geojson', () => {
      const { featurePath, geojson } = useSymbolMap(createOptions())
      const d = featurePath.value(geojson.value as any)
      expect(typeof d).toBe('string')
      expect(d?.startsWith('M')).toBe(true)
    })
  })

  describe('categories and categoryIndexByName', () => {
    it('lists the distinct categories as strings in first-seen order', () => {
      const { categories } = useSymbolMap(createOptions())
      expect(categories.value).toEqual(['TECH', 'FINANCE'])
    })

    it('indexes each category to its position', () => {
      const { categoryIndexByName } = useSymbolMap(createOptions())
      expect(categoryIndexByName.value.get('TECH')).toBe(0)
      expect(categoryIndexByName.value.get('FINANCE')).toBe(1)
      expect(categoryIndexByName.value.get('MISSING')).toBeUndefined()
    })
  })

  describe('markerTransformValue', () => {
    it('centers the marker on the projected point and scales to the width', () => {
      const { markerTransformValue } = useSymbolMap(createOptions())
      // width 20 over a 40px box yields scale 0.5; the shape is offset by half
      // its scaled size so its center lands on the projected point.
      const transform = markerTransformValue(
        [100, 80],
        { width: 40, height: 60 },
        20
      )
      expect(transform).toBe('translate(90, 65) scale(0.5)')
    })

    it('guards against a zero-width bounding box', () => {
      const { markerTransformValue } = useSymbolMap(createOptions())
      // Dividing by max(1, width) avoids an infinite scale when the box has no
      // measurable width.
      const transform = markerTransformValue([0, 0], { width: 0, height: 0 }, 10)
      expect(transform).toBe('translate(0, 0) scale(10)')
    })
  })
})
