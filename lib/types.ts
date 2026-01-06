import type { Component, DefineComponent, PropType, StyleValue } from 'vue'

import { AccordionKey, ParentKey } from '@/keys'
import { ComputedRef } from 'vue'
import { Ref } from 'vue'
import { TextColorVariant } from 'bootstrap-vue-next'
import type { ButtonVariant, PopoverPlacement, Size } from 'bootstrap-vue-next'
import type { GeoProjection } from 'd3-geo'

export type Step = symbol | string

interface IconPhosphorProps {
  weight: {
    type: PropType<IconWeight>
  }
  size: {
    type: PropType<string | number>
  }
  color: {
    type: PropType<string>
  }
  mirrored: {
    type: PropType<boolean>
    default: false
  }
}

export type IconPhosphor = DefineComponent<IconPhosphorProps, object, any>
export type IconWeight = 'bold' | 'fill' | 'thin' | 'light' | 'regular' | 'duotone'
export type IconSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface Accordion {
  emitAccordionNextStepEvent: () => void
  emitAccordionPreviousStepEvent: () => void
  isActiveStep: (step: Step) => boolean
  isPreviousStep: (step: Step) => boolean
  isFirstStep: (step: Step) => boolean
  isLastStep: (step: Step) => boolean
  step: Step
  steps: Step[]
}

export interface AccordionProvide {
  [AccordionKey]: Accordion
}

export type BrandStyle = StyleValue & {
  '--monochrome-color': string
  'color': string
  'background': string
  'width': string
}

export type BrandExpansionStyle = Pick<
  BrandStyle,
  '--monochrome-color' | 'background'
>

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

export interface ButtonIconProps {
  id?: string
  iconLeft?: string | Component
  iconLeftVariant?: TextColorVariant
  iconLeftHoverVariant?: TextColorVariant
  iconLeftSize?: string
  iconLeftLabel?: string
  iconLeftLabelOffset?: number
  iconRight?: string | Component
  iconRightVariant?: TextColorVariant
  iconRightHoverVariant?: TextColorVariant
  iconRightSize?: string
  iconRightLabel?: string
  iconRightLabelOffset?: number
  iconSpinner?: string | Component
  hideLabel?: boolean
  hideTooltip?: boolean
  label?: string
  square?: boolean
  to?: any
  variant?: ButtonVariant
  size?: Size
  block?: boolean
  pill?: boolean
  pressed?: boolean
  tag?: string
  type?: string
  loading?: boolean
  loadingDuration?: string
  loadingText?: string
  tooltipLabel?: string
  tooltipPlacement?: PopoverPlacement
  tooltipDelay?: { show: number, hide: number }
  showTooltipForce?: boolean
  hover?: boolean
  truncate?: boolean
  counter?: number
  counterVariant?: TextColorVariant
  counterStyle?: string | object
}
export interface AppIconProps {
  name?: string | Component
  size?: IconSize | string
  scale?: number
  variant?: TextColorVariant
  hoverVariant?: TextColorVariant
  beat?: boolean
  beatDuration?: string
  fade?: boolean
  fadeDuration?: string
  spin?: boolean
  spinReverse?: boolean
  spinDuration?: string
  hover?: boolean
}

/** @deprecated Use AppIconProps instead */
export interface PhosphorIconProps {
  name: string | string[] | IconPhosphor
  size?: IconSize | string
  scale?: number
  variant?: TextColorVariant
  hoverVariant?: TextColorVariant
  fill?: boolean
  weight?: IconWeight
  hoverWeight?: IconWeight
  beat?: boolean
  beatDuration?: string
  fade?: boolean
  fadeDuration?: string
  spin?: boolean
  spinReverse?: boolean
  spinDuration?: string
  hover?: boolean
}
