import * as d3 from 'd3'
import get from 'lodash/get'
import maxFn from 'lodash/max'
import minFn from 'lodash/min'
import values from 'lodash/values'
import { computed, toValue } from 'vue'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'

import type { LoadedData } from '@/composables/useChart'

/**
 * Reactive inputs driving {@link useChoropleth}. They mirror the
 * `ChoroplethMap` component's loaded data, the color-scale bounds and the
 * endpoint colors, accepted as plain values, refs or getters so the composable
 * adapts to how the caller wires its state.
 */
export interface UseChoroplethOptions {
  /**
   * The map's loaded data, keyed by feature identifier, as exposed by `useChart`.
   */
  loadedData: MaybeRefOrGetter<LoadedData>
  /**
   * Path (dot notation supported) to a feature's identifier inside the geojson
   * datum, used to look its value up in `loadedData`.
   */
  topojsonObjectsPath: MaybeRefOrGetter<string | string[]>
  /**
   * Forced maximum value for the color scale, or `null` to derive it from the data.
   */
  max: MaybeRefOrGetter<number | null>
  /**
   * Forced minimum value for the color scale, or `null` to derive it from the data.
   */
  min: MaybeRefOrGetter<number | null>
  /**
   * A custom scale function overriding the default sequential scale, or `null`
   * to use the default.
   */
  featureColorScale: MaybeRefOrGetter<((v: any) => string) | null>
  /**
   * Color mapped to the scale's low end.
   */
  colorScaleStart: MaybeRefOrGetter<string>
  /**
   * Color mapped to the scale's high end.
   */
  colorScaleEnd: MaybeRefOrGetter<string>
}

/**
 * Reactive API returned by {@link useChoropleth}.
 */
export interface UseChoropleth {
  /**
   * The maximum value used by the color scale (forced or derived).
   */
  maxValue: ComputedRef<number>
  /**
   * The minimum value used by the color scale (forced or derived).
   */
  minValue: ComputedRef<number>
  /**
   * The default sequential scale, from the start color to the end color.
   */
  defaultFeatureColorScale: ComputedRef<d3.ScaleSequential<string>>
  /**
   * The active scale function: the custom one when provided, the default otherwise.
   */
  featureColorScaleFunction: ComputedRef<(v: any) => string>
  /**
   * Maps a geojson datum to its color, or `undefined` when the feature has no data.
   */
  featureColor: ComputedRef<(d: any) => string | undefined>
}

/**
 * Owns the pure color-scale logic of the `ChoroplethMap` component: it derives
 * the value bounds, builds the default sequential scale between the two
 * endpoint colors, and resolves a per-feature color from the loaded data. It
 * holds no DOM state — the endpoint colors are measured by the component and
 * passed in.
 *
 * @param options - Reactive color-scale options (see {@link UseChoroplethOptions}).
 * @returns The {@link UseChoropleth} API of derived color logic.
 * @example
 * // Internal building block of the `ChoroplethMap` component; not exported
 * // from the package root. Inside a `<script setup>` block:
 * import { toRef } from 'vue'
 * import { useChoropleth } from '@/composables/useChoropleth'
 *
 * const { featureColor, maxValue } = useChoropleth({
 *   loadedData,
 *   topojsonObjectsPath: toRef(() => props.topojsonObjectsPath),
 *   max: toRef(() => props.max),
 *   min: toRef(() => props.min),
 *   featureColorScale: toRef(() => props.featureColorScale),
 *   colorScaleStart: featureColorScaleStart,
 *   colorScaleEnd: featureColorScaleEnd
 * })
 */
export function useChoropleth(options: UseChoroplethOptions): UseChoropleth {
  const {
    loadedData,
    topojsonObjectsPath,
    max,
    min,
    featureColorScale,
    colorScaleStart,
    colorScaleEnd
  } = options

  const maxValue = computed((): number => {
    const forced = toValue(max)
    if (forced !== null) {
      return forced
    }
    return maxFn<number>(values(toValue(loadedData))) || 0
  })

  const minValue = computed((): number => {
    const forced = toValue(min)
    if (forced !== null) {
      return forced
    }
    return minFn(values(toValue(loadedData))) || 0
  })

  const defaultFeatureColorScale = computed(() => {
    return d3
      .scaleSequential()
      .domain([Math.max(1, minValue.value), maxValue.value])
      .range([toValue(colorScaleStart), toValue(colorScaleEnd)] as any)
  })

  const featureColorScaleFunction = computed((): ((v: any) => string) => {
    const custom = toValue(featureColorScale)
    if (custom !== null) {
      return custom
    }
    return defaultFeatureColorScale.value
  })

  const featureColor = computed(() => {
    return (d: any): string | undefined => {
      const data = toValue(loadedData)
      const id = get(d, toValue(topojsonObjectsPath))
      const hasIdProp = data && (id in data)
      return hasIdProp
        ? featureColorScaleFunction.value(data[id])
        : undefined
    }
  })

  return {
    maxValue,
    minValue,
    defaultFeatureColorScale,
    featureColorScaleFunction,
    featureColor
  }
}

export default useChoropleth
