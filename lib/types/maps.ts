/**
 * Map-related types for choropleth and symbol map components
 */
import type { ComputedRef, Ref } from 'vue'
import type { GeoProjection } from 'd3-geo'

import { ParentKey } from '@/keys'

export interface MapTransform {
  k: number
  x: number
  y: number
  rotateX: number
  rotateY: number
}

export interface ParentMap {
  mapRect: Ref<DOMRect>
  mapTransform: Ref<MapTransform>
  rotatingMapProjection: ComputedRef<GeoProjection | (() => number[])>
}

export interface ParentMapProvide {
  [ParentKey]: ParentMap
}
