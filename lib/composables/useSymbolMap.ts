import * as d3 from 'd3'
import { geoRobinson } from 'd3-geo-projection'
import type { GeoPath, GeoProjection } from 'd3-geo'
import { feature } from 'topojson'
import type { GeometryCollection, Topology } from 'topojson-specification'
import { get, uniq } from 'lodash'
import { computed, toValue } from 'vue'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'

/**
 * Reactive inputs driving {@link useSymbolMap}. Each input is a plain value, ref
 * or getter so the composable adapts to how the caller wires its state. The
 * composable holds no DOM state: the measured `width`/`height`, the parsed
 * topojson and the loaded marker data are passed in from the component.
 */
export interface UseSymbolMapOptions {
  /**
   * The parsed TopoJSON topology used to build the base map features.
   */
  topojson: MaybeRefOrGetter<Topology | null>
  /**
   * The marker rows to plot, each carrying at least `longitude`/`latitude`.
   */
  loadedData: MaybeRefOrGetter<any[] | null>
  /**
   * Measured outer width of the map, in pixels.
   */
  width: MaybeRefOrGetter<number>
  /**
   * Measured outer height of the map, in pixels.
   */
  height: MaybeRefOrGetter<number>
  /**
   * Padding, in pixels, kept between the fitted geometry and the map edges.
   */
  padding: MaybeRefOrGetter<number>
  /**
   * Name of the TopoJSON objects collection to render as map features.
   */
  topojsonObjects: MaybeRefOrGetter<string>
  /**
   * Path in the marker rows to the category value used for grouping/coloring.
   */
  categoryObjectsPath: MaybeRefOrGetter<string | string[]>
  /**
   * When true, fit the projection to the marker bounds instead of the feature
   * bounds.
   */
  fitToMarkers: MaybeRefOrGetter<boolean>
}

/**
 * Reactive API returned by {@link useSymbolMap}.
 */
export interface UseSymbolMap {
  /**
   * The GeoJSON the projection is fitted to: the markers polygon when
   * `fitToMarkers` is set, otherwise the topojson features collection.
   */
  geojson: ComputedRef<any>
  /**
   * The topojson features collection rendered as the base map layer.
   */
  featuresGeojson: ComputedRef<any>
  /**
   * A single polygon spanning the markers' coordinates, used to fit the
   * projection to the markers' bounds.
   */
  markersGeojson: ComputedRef<any>
  /**
   * The `[longitude, latitude]` pairs of every loaded marker.
   */
  coordinates: ComputedRef<number[][]>
  /**
   * The Robinson projection fitted to the map size and the geojson bounds,
   * inset by `padding` on every edge.
   */
  mapProjection: ComputedRef<GeoProjection>
  /**
   * The geo path generator bound to {@link mapProjection}.
   */
  featurePath: ComputedRef<GeoPath>
  /**
   * The distinct category values across the loaded markers, stringified.
   */
  categories: ComputedRef<string[]>
  /**
   * Category name to index lookup, so per-marker class assignment stays O(1)
   * instead of running an `indexOf` (O(n)) for every marker.
   */
  categoryIndexByName: ComputedRef<Map<string, number>>
  /**
   * Pure geometry helper that turns a projected point and the marker's measured
   * bounding box into the SVG `transform` that centers and scales the marker.
   */
  markerTransformValue: (
    point: [number, number],
    box: { width: number, height: number },
    markerWidth: number
  ) => string
}

/**
 * Owns the symbol-map-specific reactive geometry: it derives the GeoJSON to
 * render (features or marker bounds), fits a Robinson projection to the map size
 * with edge padding, exposes the matching geo path generator, indexes the marker
 * categories, and centers/scales each marker around its projected coordinate. It
 * holds no DOM state — the measured size, parsed topojson and marker rows are
 * passed in, and rendering stays in the component.
 *
 * @remarks The projection is fitted with `fitExtent` (inset by `padding`), NOT
 * `fitSize`, so it differs from the shared `useMapProjection` and is kept here
 * to preserve the symbol map's exact framing behavior.
 * @param options - Reactive options (see {@link UseSymbolMapOptions}).
 * @returns The {@link UseSymbolMap} API of derived symbol-map geometry.
 * @example
 * // Internal building block of SymbolMap; not exported from the package root.
 * // Inside a `<script setup>` block:
 * import { toRef } from 'vue'
 * import { useSymbolMap } from '@/composables/useSymbolMap'
 *
 * const { featurePath, mapProjection, categories } = useSymbolMap({
 *   topojson,
 *   loadedData,
 *   width: mapWidth,
 *   height: mapHeight,
 *   padding: toRef(() => props.mapPadding),
 *   topojsonObjects: toRef(() => props.topojsonObjects),
 *   categoryObjectsPath: toRef(() => props.categoryObjectsPath),
 *   fitToMarkers: toRef(() => props.fitToMarkers)
 * })
 */
export function useSymbolMap(options: UseSymbolMapOptions): UseSymbolMap {
  const {
    topojson,
    loadedData,
    width,
    height,
    padding,
    topojsonObjects,
    categoryObjectsPath,
    fitToMarkers
  } = options

  const featuresGeojson = computed(() => {
    const object = get(
      toValue(topojson),
      ['objects', toValue(topojsonObjects)],
      null
    )
    return feature(toValue(topojson), object as GeometryCollection)
  })

  const coordinates = computed((): number[][] => {
    return (toValue(loadedData) || []).map(({ longitude, latitude }: any) => {
      return [longitude, latitude]
    })
  })

  const markersGeojson = computed(() => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates.value]
      }
    }
  })

  const geojson = computed(() => {
    return toValue(fitToMarkers) ? markersGeojson.value : featuresGeojson.value
  })

  const mapProjection = computed((): GeoProjection => {
    const inset = toValue(padding)
    return geoRobinson().fitExtent(
      [
        [inset, inset],
        [toValue(width) - inset, toValue(height) - inset]
      ],
      geojson.value as any
    )
  })

  const featurePath = computed((): GeoPath => {
    return d3.geoPath().projection(mapProjection.value)
  })

  const categories = computed((): string[] => {
    const values = (toValue(loadedData) || []).map((d: any) => {
      return get(d, toValue(categoryObjectsPath))
    })
    return uniq(values).map(String)
  })

  const categoryIndexByName = computed((): Map<string, number> => {
    const index = new Map<string, number>()
    categories.value.forEach((category, i) => index.set(category, i))
    return index
  })

  // Markers are authored around their own origin, so center the shape on the
  // projected coordinate and scale it down to the requested pixel width.
  function markerTransformValue(
    [x, y]: [number, number],
    { width: boxWidth, height: boxHeight }: { width: number, height: number },
    markerWidth: number
  ): string {
    const scale = markerWidth / Math.max(1, boxWidth)
    const cx = x - (boxWidth / 2) * scale
    const cy = y - (boxHeight / 2) * scale
    return `translate(${cx}, ${cy}) scale(${scale})`
  }

  return {
    geojson,
    featuresGeojson,
    markersGeojson,
    coordinates,
    mapProjection,
    featurePath,
    categories,
    categoryIndexByName,
    markerTransformValue
  }
}

export default useSymbolMap
