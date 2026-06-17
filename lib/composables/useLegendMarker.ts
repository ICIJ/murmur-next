import { isFunction } from 'lodash'
import * as d3 from 'd3'
import { computed, toValue } from 'vue'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'

/**
 * A single legend entry. Mirrors the `Datum` shape consumed by the
 * `LegendOrdinal` component.
 */
export interface LegendMarkerDatum {
  id?: string | number
  color: string
  path?: string
  label: string
}

/**
 * Resolves the SVG path for a marker, either a constant path string or a
 * per-datum path function.
 */
export type MarkerPath = string | ((d: LegendMarkerDatum) => string)

/**
 * Reactive API returned by {@link useLegendMarker}.
 */
export interface UseLegendMarker {
  /**
   * SVG `viewBox` string sized to the default marker path, measured by
   * rendering it once off-screen.
   */
  markerViewbox: ComputedRef<string>
  /**
   * Resolves the marker path for a given datum. When `markerPath` is a
   * function it is only applied if a datum is provided; otherwise the constant
   * path string is returned.
   *
   * @param d - The datum to resolve the path for, when `markerPath` is a function.
   * @returns The SVG path data string.
   */
  markerPathFunction: (d?: LegendMarkerDatum) => string
}

/**
 * Owns the marker geometry derivation of the `LegendOrdinal` component: it
 * resolves the per-datum SVG path and measures the default marker to build the
 * shared `viewBox`. The measurement renders an off-screen SVG to read the
 * marker bounding box, so it depends on a DOM being available.
 *
 * @param markerPath - The marker path, as a constant string or a per-datum
 *   function (see {@link MarkerPath}), accepted as a plain value, ref or getter.
 * @returns The {@link UseLegendMarker} API: the shared `markerViewbox` and the
 *   `markerPathFunction` resolver.
 * @example
 * // Internal building block of the `LegendOrdinal` component; not exported
 * // from the package root. Inside a `<script setup>` block:
 * import { toRef } from 'vue'
 * import { useLegendMarker } from '@/composables/useLegendMarker'
 *
 * const props = defineProps<{ markerPath?: string }>()
 * const { markerViewbox, markerPathFunction } = useLegendMarker(
 *   toRef(() => props.markerPath)
 * )
 */
export function useLegendMarker(
  markerPath: MaybeRefOrGetter<MarkerPath>
): UseLegendMarker {
  function markerPathFunction(d?: LegendMarkerDatum): string {
    const path = toValue(markerPath)
    return isFunction(path) && d ? path(d) : (path as string)
  }

  // Measure the default marker by rendering it once in a detached SVG, then
  // remove it; the resulting box drives the shared `viewBox` for every marker.
  const markerBoundingClientRect = computed((): DOMRect | undefined => {
    const svg = d3
      .select('body')
      .append('svg')
      .attr('width', 2046)
      .attr('height', 2046)
    const marker = svg.append('path').attr('d', markerPathFunction())
    const rect: DOMRect | undefined = marker.node()?.getBoundingClientRect()
    svg.remove()
    return rect
  })

  const markerViewbox = computed((): string => {
    const { width, height } = markerBoundingClientRect.value ?? {
      width: 0,
      height: 0
    }
    return `0 0 ${width} ${height}`
  })

  return { markerViewbox, markerPathFunction }
}

export default useLegendMarker
