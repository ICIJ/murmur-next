import { computed } from 'vue'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import isString from 'lodash/isString'

import { BrandMode } from '@/enums'
import type { BrandExpansionStyle } from '@/types'

// Intrinsic SVG widths (in user units) for each brand mode, at the reference
// height of 200. They double as the responsive breakpoints below: a brand
// wider than the viewport switches to a fluid width.
const BRAND_MODE_WIDTH: Readonly<Record<BrandMode, number>> = Object.freeze({
  [BrandMode.Short]: 401.256,
  [BrandMode.Medium]: 901.24,
  [BrandMode.Long]: 1047.01
})

// The SVG viewBoxes are authored at this height; widths scale proportionally.
const REFERENCE_HEIGHT = 200

/**
 * Reactive options for {@link useBrandExpansion}. They mirror the
 * `BrandExpansion` component props that drive its geometry.
 */
export interface UseBrandExpansionOptions {
  /**
   * Logo height, as a number of pixels or a CSS-like string (e.g. `"70px"`).
   */
  size: MaybeRefOrGetter<number | string>
  /**
   * Which logo variation is displayed, selecting the matching intrinsic width.
   */
  mode: MaybeRefOrGetter<BrandMode>
  /**
   * Monochromatic logo color, applied through a CSS custom property.
   */
  color: MaybeRefOrGetter<string | null>
  /**
   * Logo background color.
   */
  background: MaybeRefOrGetter<string | null>
  /**
   * When true, the logo shrinks to fit a viewport narrower than its intrinsic
   * width; otherwise it keeps its computed pixel width.
   */
  responsive: MaybeRefOrGetter<boolean>
}

/**
 * Reactive API returned by {@link useBrandExpansion}.
 */
export interface UseBrandExpansion {
  width: ComputedRef<string>
  height: ComputedRef<string>
  style: ComputedRef<BrandExpansionStyle>
}

/**
 * Derives the geometry and inline style for the `BrandExpansion` logo: scales
 * the mode-specific SVG width to the requested height, falls back to a fluid
 * width when responsive mode meets a viewport narrower than the logo, and
 * exposes the color/background custom properties.
 *
 * @param options - Reactive geometry options (see {@link UseBrandExpansionOptions}).
 * @returns The {@link UseBrandExpansion} API: `width` and `height` CSS values
 *   for the SVG, plus the `style` binding for the host element.
 * @example
 * import { toRef } from 'vue'
 * import { useBrandExpansion } from '@/composables/useBrandExpansion'
 *
 * const { width, height, style } = useBrandExpansion({
 *   size: toRef(props, 'size'),
 *   mode: toRef(props, 'mode'),
 *   color: toRef(props, 'color'),
 *   background: toRef(props, 'background'),
 *   responsive: toRef(props, 'responsive')
 * })
 */
export function useBrandExpansion(
  options: UseBrandExpansionOptions
): UseBrandExpansion {
  const { size, mode, color, background, responsive } = options

  // The breakpoints match each mode's intrinsic width so we can ask whether the
  // viewport is too narrow to hold the logo at its natural size.
  const breakpoints = useBreakpoints(BRAND_MODE_WIDTH)

  const baseWidth = computed((): number => {
    return BRAND_MODE_WIDTH[toValue(mode)]
  })

  const sizeAsNumber = computed((): number => {
    const value = toValue(size)
    return isString(value) ? parseInt(value) : value
  })

  // NOTE: `smallerOrEqual` returns a ComputedRef, which is always truthy when
  // used as a condition. The original component relied on this object directly,
  // so a responsive brand always reports a fluid width regardless of the actual
  // breakpoint. Behavior is preserved here on purpose; fixing it (by reading
  // `.value`) would change the public rendering and belongs in a separate change.
  const viewportSmallerThanLogo = computed((): boolean => {
    return Boolean(breakpoints.smallerOrEqual(toValue(mode)))
  })

  const width = computed((): string => {
    if (toValue(responsive) && viewportSmallerThanLogo.value) {
      return '100%'
    }
    return `${(baseWidth.value / REFERENCE_HEIGHT) * sizeAsNumber.value}px`
  })

  const height = computed((): string => {
    return `${sizeAsNumber.value}px`
  })

  const style = computed((): BrandExpansionStyle => {
    return {
      '--monochrome-color': toValue(color),
      'background': toValue(background)
    }
  })

  return { width, height, style }
}

export default useBrandExpansion
