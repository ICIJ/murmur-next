import * as d3 from 'd3'
import { geoGraticule } from 'd3-geo'
import type { GeoPath, GeoProjection } from 'd3-geo'
import { computed, toValue } from 'vue'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'

import type { MapTransform } from '@/types'

/**
 * Reactive inputs driving {@link useMapProjection}. Everything that affects the
 * projection geometry is passed in as a plain value, ref or getter so the
 * composable adapts to how the caller wires its state. The composable holds no
 * DOM state: the measured `width`/`height` and the parsed `geojson` come from
 * the component.
 */
export interface UseMapProjectionOptions {
  /**
   * The d3-geo projection factory (for example `geoRobinson`). Called once per
   * recomputation to obtain a fresh, mutable projection.
   */
  projection: MaybeRefOrGetter<(() => GeoProjection) | undefined>
  /**
   * The GeoJSON object the projection is fitted to (typically the topojson
   * features collection, or the markers bounds for a symbol map).
   */
  geojson: MaybeRefOrGetter<any>
  /**
   * Measured outer width of the map, in pixels.
   */
  width: MaybeRefOrGetter<number>
  /**
   * Measured outer height of the map, in pixels.
   */
  height: MaybeRefOrGetter<number>
  /**
   * Whether the projection is spherical (a globe). Spherical maps rotate to
   * their center and fit by height; planar maps recenter in place.
   */
  spherical?: MaybeRefOrGetter<boolean>
  /**
   * Initial center of the map as `[longitude, latitude]`, or `null` for the
   * world origin.
   */
  center?: MaybeRefOrGetter<number[] | null>
  /**
   * The live zoom/pan transform, whose `rotateX`/`rotateY` drive the rotating
   * projection used while a spherical map is dragged.
   */
  transform?: MaybeRefOrGetter<MapTransform>
  /**
   * Step, in degrees, of the graticule grid (parallels and meridians).
   */
  graticuleStep?: MaybeRefOrGetter<[number, number]>
}

/**
 * Reactive API returned by {@link useMapProjection}.
 */
export interface UseMapProjection {
  /**
   * The base projection, fitted to the map size and the geojson bounds.
   */
  mapProjection: ComputedRef<GeoProjection>
  /**
   * The geo path generator bound to {@link mapProjection}.
   */
  featurePath: ComputedRef<GeoPath>
  /**
   * The projection used for the first render: spherical maps are rotated to
   * their center, fitted by height and translated to the middle; planar maps
   * are recentered on their planar center.
   */
  initialMapProjection: ComputedRef<GeoProjection>
  /**
   * The geo path generator bound to {@link initialMapProjection}.
   */
  initialFeaturePath: ComputedRef<GeoPath>
  /**
   * The rendered graticule grid path, drawn through {@link initialFeaturePath}.
   */
  initialGraticulePath: ComputedRef<string | null>
  /**
   * The base projection rotated by the transform's `rotateX`/`rotateY`, used
   * while a spherical map is dragged. Falls back to {@link mapProjection} when
   * no rotation is set.
   */
  rotatingMapProjection: ComputedRef<GeoProjection>
  /**
   * The raw graticule GeoJSON (a MultiLineString of parallels and meridians).
   */
  graticuleLines: ComputedRef<any>
  /**
   * The projection's geographic center as `[longitude, latitude]`.
   */
  mapCenter: ComputedRef<[number, number]>
}

/**
 * Owns the pure d3-geo projection geometry shared by the map components: it
 * fits a projection to the map size and the geojson bounds, derives the geo
 * path generators, and handles the spherical/planar centering and rotation
 * variants. It holds no DOM state — the measured size and parsed geojson are
 * passed in, and rendering stays in the component.
 *
 * @param options - Reactive projection options (see {@link UseMapProjectionOptions}).
 * @returns The {@link UseMapProjection} API of derived projection geometry.
 * @example
 * // Internal building block of the map components; not exported from the
 * // package root. Inside a `<script setup>` block:
 * import { toRef } from 'vue'
 * import { useMapProjection } from '@/composables/useMapProjection'
 *
 * const { featurePath, initialFeaturePath } = useMapProjection({
 *   projection: toRef(() => props.projection),
 *   geojson,
 *   width: mapWidth,
 *   height: mapHeight,
 *   spherical: toRef(() => props.spherical),
 *   center: toRef(() => props.center),
 *   transform: mapTransform
 * })
 */
export function useMapProjection(
  options: UseMapProjectionOptions
): UseMapProjection {
  const {
    projection,
    geojson,
    width,
    height,
    spherical,
    center,
    transform,
    graticuleStep
  } = options

  // Spherical projections rotate the globe to face the requested center, so the
  // rotation is the negated longitude/latitude.
  const sphericalCenter = computed((): [number, number] => {
    const [lng = 0, lat = 0] = toValue(center) ?? [0, 0]
    return [-lng, -lat]
  })

  const planarCenter = computed((): [number, number] => {
    const [lng = 0, lat = 0] = toValue(center) ?? [0, 0]
    return [lng, lat]
  })

  const graticuleLines = computed(() => {
    return geoGraticule().step(toValue(graticuleStep) ?? [20, 20])()
  })

  const mapProjection = computed((): GeoProjection => {
    const projectionFactory = toValue(projection)
    if (!projectionFactory) {
      throw new Error('props.projection is ' + projectionFactory)
    }
    return projectionFactory().fitSize(
      [toValue(width), toValue(height)],
      toValue(geojson)
    ) as GeoProjection
  })

  const featurePath = computed((): GeoPath => {
    return d3.geoPath().projection(mapProjection.value)
  })

  const initialMapProjection = computed((): GeoProjection => {
    if (toValue(spherical)) {
      return mapProjection.value
        .rotate(sphericalCenter.value)
        .fitHeight(toValue(height), toValue(geojson))
        .translate([toValue(width) / 2, toValue(height) / 2])
    }
    return mapProjection.value.center(planarCenter.value)
  })

  const initialFeaturePath = computed((): GeoPath => {
    return featurePath.value.projection(initialMapProjection.value)
  })

  const initialGraticulePath = computed((): string | null => {
    return initialFeaturePath.value(graticuleLines.value)
  })

  const rotatingMapProjection = computed((): GeoProjection => {
    const { rotateX = null, rotateY = null } = toValue(transform) ?? {}
    if (rotateX !== null && rotateY !== null) {
      return mapProjection.value.rotate([rotateX, rotateY]) ?? null
    }
    return mapProjection.value
  })

  const mapCenter = computed((): [number, number] => {
    return mapProjection.value.center()
  })

  return {
    mapProjection,
    featurePath,
    initialMapProjection,
    initialFeaturePath,
    initialGraticulePath,
    rotatingMapProjection,
    graticuleLines,
    mapCenter
  }
}

export default useMapProjection
