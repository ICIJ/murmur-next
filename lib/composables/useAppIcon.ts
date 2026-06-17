import { computed, ref, toValue, watch } from 'vue'
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'

import type { IconSize, TextColorVariant } from '@/types'

// Preset size keys shared by the icon components. Any other string size is
// treated as a raw CSS value (or a percentage, handled separately).
const PRESET_SIZES: readonly string[] = Object.freeze([
  '2xs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl'
])

/**
 * Reactive options for {@link useAppIcon}. They mirror the `AppIcon` component
 * props that drive its color, sizing and hover state.
 */
export interface UseAppIconOptions {
  /**
   * Requested icon size: a preset key, a raw CSS value or a percentage.
   */
  size: MaybeRefOrGetter<IconSize | string | undefined>
  /**
   * Scale factor applied to the icon size through a CSS custom property.
   */
  scale: MaybeRefOrGetter<number>
  /**
   * Bootstrap color variant for the icon.
   */
  variant: MaybeRefOrGetter<TextColorVariant | undefined>
  /**
   * Bootstrap color variant applied while hovered.
   */
  hoverVariant: MaybeRefOrGetter<TextColorVariant | undefined>
  /**
   * Forces the icon into its hover state when true.
   */
  hover: MaybeRefOrGetter<boolean | undefined>
  /**
   * Duration of the spin animation.
   */
  spinDuration: MaybeRefOrGetter<string>
  /**
   * Duration of the beat animation.
   */
  beatDuration: MaybeRefOrGetter<string>
  /**
   * Duration of the fade animation.
   */
  fadeDuration: MaybeRefOrGetter<string>
  /**
   * Enable spinning animation.
   */
  spin: MaybeRefOrGetter<boolean | undefined>
  /**
   * Reverse the direction of the spin animation.
   */
  spinReverse: MaybeRefOrGetter<boolean | undefined>
  /**
   * Enable pulsing beat animation.
   */
  beat: MaybeRefOrGetter<boolean | undefined>
  /**
   * Enable fade in/out animation.
   */
  fade: MaybeRefOrGetter<boolean | undefined>
}

/**
 * Reactive API returned by {@link useAppIcon}.
 */
export interface UseAppIcon {
  currentHover: Ref<boolean>
  color: ComputedRef<string>
  isPercentSize: ComputedRef<boolean>
  isRawSize: ComputedRef<boolean>
  hasSize: ComputedRef<boolean>
  style: ComputedRef<Record<string, string | number | undefined>>
  classList: ComputedRef<Record<string, boolean | undefined>>
}

/**
 * Derives the inline style and class list for the `AppIcon` component: tracks
 * the hover state (driven by both the `hover` prop and mouse events),
 * classifies the requested size (preset / raw CSS / percentage) and resolves
 * the active color variant.
 *
 * Internal building block for `AppIcon`; not exported from `@icij/murmur-next`.
 *
 * @param options - Reactive icon options (see {@link UseAppIconOptions}).
 * @returns The {@link UseAppIcon} API: the mutable `currentHover` flag plus the
 *   `style` and `classList` bindings (and the size predicates they rely on).
 * @example
 * import { toRef } from 'vue'
 * import { useAppIcon } from '@/composables/useAppIcon'
 *
 * const { currentHover, style, classList } = useAppIcon({
 *   size: toRef(props, 'size'),
 *   scale: toRef(props, 'scale'),
 *   variant: toRef(props, 'variant'),
 *   hoverVariant: toRef(props, 'hoverVariant'),
 *   hover: toRef(props, 'hover'),
 *   spinDuration: toRef(props, 'spinDuration'),
 *   beatDuration: toRef(props, 'beatDuration'),
 *   fadeDuration: toRef(props, 'fadeDuration'),
 *   spin: toRef(props, 'spin'),
 *   spinReverse: toRef(props, 'spinReverse'),
 *   beat: toRef(props, 'beat'),
 *   fade: toRef(props, 'fade')
 * })
 */
export function useAppIcon(options: UseAppIconOptions): UseAppIcon {
  const {
    size,
    scale,
    variant,
    hoverVariant,
    hover,
    spinDuration,
    beatDuration,
    fadeDuration,
    spin,
    spinReverse,
    beat,
    fade
  } = options

  // Hover state is seeded from the `hover` prop and then driven by mouse events;
  // the immediate watcher keeps it in sync when the prop changes.
  const currentHover = ref(false)
  watch(() => toValue(hover), () => (currentHover.value = toValue(hover) as boolean), { immediate: true })

  const color = computed((): string => {
    let colorVariant = 'currentColor'

    if (toValue(variant)) {
      colorVariant = `var(--bs-${toValue(variant)}, currentColor)`
    }

    if (currentHover.value && toValue(hoverVariant)) {
      colorVariant = `var(--bs-${toValue(hoverVariant)}, ${colorVariant})`
    }

    return colorVariant
  })

  const isPercentSize = computed((): boolean => {
    const value = toValue(size)
    return typeof value === 'string' && value.endsWith('%')
  })

  const isRawSize = computed((): boolean => {
    const value = toValue(size)
    return !PRESET_SIZES.includes(value as string) && value !== undefined && !isPercentSize.value
  })

  const hasSize = computed((): boolean => {
    return PRESET_SIZES.includes(toValue(size) ?? '')
  })

  const style = computed(() => {
    return {
      '--app-icon-color': color.value,
      '--app-icon-raw-size': isRawSize.value ? toValue(size) : undefined,
      '--app-icon-percent-size': isPercentSize.value ? toValue(size) : undefined,
      '--app-icon-size': hasSize.value ? toValue(size) : undefined,
      '--app-icon-scale': toValue(scale) ?? 1,
      '--app-icon-spin-duration': toValue(spinDuration),
      '--app-icon-beat-duration': toValue(beatDuration),
      '--app-icon-fade-duration': toValue(fadeDuration)
    }
  })

  const classList = computed(() => {
    return {
      [`app-icon--size-${toValue(size)}`]: hasSize.value,
      [`app-icon--has-size`]: hasSize.value,
      [`app-icon--raw-size`]: isRawSize.value,
      [`app-icon--percent-size`]: isPercentSize.value,
      [`app-icon--hover`]: currentHover.value,
      [`app-icon--spin`]: toValue(spin),
      [`app-icon--spin-reverse`]: toValue(spinReverse),
      [`app-icon--beat`]: toValue(beat),
      [`app-icon--fade`]: toValue(fade)
    }
  })

  return { currentHover, color, isPercentSize, isRawSize, hasSize, style, classList }
}

export default useAppIcon
