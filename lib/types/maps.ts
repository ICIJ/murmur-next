/**
 * Map-related types for choropleth and symbol map components
 */
import type { ComputedRef, Ref } from 'vue'
import type { GeoProjection } from 'd3-geo'
import type { PopoverPlacement } from 'bootstrap-vue-next'

import { ParentKey } from '@/keys'
import { PLACEMENTS } from '@/enums'

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

/**
 * ChoroplethMap component props
 */
export interface ChoroplethMapProps {
  /**
   * Covers the empty values with a hatched pattern.
   */
  hatchEmpty?: boolean
  /**
   * Hide the legend of the map.
   */
  hideLegend?: boolean
  /**
   * Change the scale function used to get calculate a feature color.
   */
  featureColorScale?: ((v: any) => string) | null
  /**
   * Change the color of the outline.
   */
  outlineColor?: string
  /**
   * Change the color of the graticule.
   */
  graticuleColor?: string
  /**
   * Maximum value to use in the color scale.
   */
  max?: number | null
  /**
   * Minimum value to use in the color scale.
   */
  min?: number | null
  /**
   * If true the map should be clickable (and zoom on a given feature).
   */
  clickable?: boolean
  /**
   * Field in the topojson containing all the feature objects.
   */
  topojsonObjects?: string
  /**
   * Field in the topojson objects containing the id of a feature. This field supports dot notation for nested values.
   */
  topojsonObjectsPath?: string | string[]
  /**
   * URL of the topojson.
   */
  topojsonUrl?: string
  /**
   * Duration of the transitions.
   */
  transitionDuration?: number
  /**
   * If true the user will be able to navigate in the map with drag and mouse wheel.
   */
  zoomable?: boolean
  /**
   * Set to true if your projection is spherical.
   */
  spherical?: boolean
  /**
   * Minimum zoom value.
   */
  zoomMin?: number
  /**
   * Maximum zoom value.
   */
  zoomMax?: number
  /**
   * Initial zoom value.
   */
  zoom?: number | null
  /**
   * Initial center of the map.
   */
  center?: number[] | null
  /**
   * Projection object from d3 to draw the features.
   * @see https://d3js.org/d3-geo/projection
   */
  projection?: () => GeoProjection
  /**
   * If true the map will display a sphere outline around the world.
   */
  outline?: boolean
  /**
   * If true the map will display a graticule grid (representing parallels and meridians).
   */
  graticule?: boolean
  /**
   * Maximum height used by the map.
   */
  height?: string
  /**
   * Neutral color of the map's features.
   */
  color?: string
  /**
   * Neutral color of the map s features in social mode.
   */
  socialColor?: string
  /**
   * Data to display, either as a URL string to fetch or an object.
   */
  data?: string | object[] | Record<string, number> | null
  /**
   * Type of data file when fetching from URL.
   */
  dataUrlType?: 'json' | 'csv' | 'tsv'
  /**
   * Aspect ratio (height/width) for the chart.
   */
  chartHeightRatio?: number
  /**
   * Enable social mode for optimal display when sharing on social media.
   */
  socialMode?: boolean
  /**
   * Aspect ratio to use in social mode.
   */
  socialModeRatio?: number
}

/**
 * ChoroplethMapAnnotation component props
 */
export interface ChoroplethMapAnnotationProps {
  /**
   * Latitude of the annotation.
   */
  latitude: number
  /**
   * Longitude of the annotation.
   */
  longitude: number
  /**
   * Maximum height of the annotation container.
   */
  height?: number
  /**
   * Maximum width of the annotation container.
   */
  width?: number
  /**
   * If true, the annotation will scale with the map zoom.
   */
  scale?: boolean
  /**
   * Text color of the annotation.
   */
  color?: string
  /**
   * Override the default drop-shadow filter applied to the annotation.
   */
  dropShadow?: string
  /**
   * Radian distance from the center of the Earth after which the annotation is hidden.
   * The Earth's circumference can be divided into 360 degrees, or 2π radians.
   * Therefore, 1.57 radians is approximately a quarter of π (since π≈3.14), which corresponds to
   * a quarter of the Earth's circumference.
   */
  geoDistanceThreshold?: number
  /**
   * Placement of the annotation. Can be: top, topleft, topright, right,
   * righttop, rightbottom, bottom, bottomleft, bottomright, left, lefttop,
   * and leftbottom. If `null`, the annotation will be centered.
   */
  placement?: PLACEMENTS | null
}

/**
 * SymbolMap component props
 */
export interface SymbolMapProps {
  /**
   * Path in data objects to the category value for grouping markers.
   */
  categoryObjectsPath?: string | string[]
  /**
   * Enable click-to-zoom on map features.
   */
  clickable?: boolean
  /**
   * Hide the legend.
   */
  hideLegend?: boolean
  /**
   * Hide tooltips on marker hover.
   */
  hideTooltip?: boolean
  /**
   * Display legend items horizontally instead of vertically.
   */
  horizontalLegend?: boolean
  /**
   * Color for map features, or function returning color based on feature data.
   */
  featureColor?: string | ((d: any) => string)
  /**
   * Fit map projection to marker bounds instead of feature bounds.
   */
  fitToMarkers?: boolean
  /**
   * Path in data objects to the label value for tooltips.
   */
  labelObjectsPath?: string | string[]
  /**
   * Padding around the map in pixels.
   */
  mapPadding?: number
  /**
   * Path in data objects to the unique identifier for each marker.
   */
  markerObjectsPath?: string | string[]
  /**
   * SVG path data for marker shape, or function returning path based on marker data.
   */
  markerPath?: string | ((d: any) => string)
  /**
   * Color for markers. Falls back to category colors if not set.
   */
  markerColor?: string | null
  /**
   * Width of markers in pixels, or function returning width based on marker data.
   */
  markerWidth?: number | ((d: any) => number)
  /**
   * Disable marker scaling when zooming the map.
   */
  noMarkersScale?: boolean
  /**
   * Custom CSS class to apply to tooltips.
   */
  tooltipCustomClass?: string | null
  /**
   * Placement of tooltips relative to markers.
   */
  tooltipPlacement?: PopoverPlacement
  /**
   * Fallback placement(s) for tooltips when preferred placement is not available.
   */
  tooltipFallbackPlacement?: string[] | string
  /**
   * Name of the TopoJSON objects collection to render as map features.
   */
  topojsonObjects?: string
  /**
   * Path in TopoJSON feature properties to the identifier.
   */
  topojsonObjectsPath?: string | string[]
  /**
   * URL to fetch TopoJSON data from.
   */
  topojsonUrl?: string
  /**
   * Duration of zoom transitions in milliseconds.
   */
  transitionDuration?: number
  /**
   * Enable zoom and pan interactions on the map.
   */
  zoomable?: boolean
  /**
   * Minimum zoom level.
   */
  zoomMin?: number
  /**
   * Maximum zoom level.
   */
  zoomMax?: number
  /**
   * Data to display, either as a URL string to fetch or an array of objects.
   */
  data?: string | object[] | null
  /**
   * Type of data file when fetching from URL.
   */
  dataUrlType?: 'json' | 'csv' | 'tsv'
  /**
   * Aspect ratio (height/width) for the chart.
   */
  chartHeightRatio?: number
  /**
   * Enable social mode for optimal display when sharing on social media.
   */
  socialMode?: boolean
  /**
   * Aspect ratio to use in social mode.
   */
  socialModeRatio?: number
}
