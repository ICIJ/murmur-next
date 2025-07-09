import type { StyleValue } from 'vue'

import { AccordionKey, ParentKey } from '@/keys'
import { ComputedRef } from 'vue'
import type { GeoProjection } from 'd3-geo'
import { Ref } from 'vue'

export type Step = symbol | string

export type Accordion = {
  emitAccordionNextStepEvent: () => void
  emitAccordionPreviousStepEvent: () => void
  isActiveStep: (step: Step) => boolean
  isPreviousStep: (step: Step) => boolean
  isFirstStep: (step: Step) => boolean
  isLastStep: (step: Step) => boolean
  step: Step
  steps: Step[]
}

export type AccordionProvide = {
  [AccordionKey]: Accordion
}

export type BrandStyle = StyleValue & {
  '--monochrome-color': string
  color: string
  background: string
  width: string
}

export type BrandExpansionStyle = Pick<
  BrandStyle,
  '--monochrome-color' | 'background'
>

export type Variant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'info'
  | 'warning'
  | 'success'
  | 'dark'
  | 'light'

export type MapTransform = {
  k: number,
  x: number,
  y: number,
  rotateX: number,
  rotateY: number
}

export type ParentMap = {
  mapRect: Ref<DOMRect>
  mapTransform: Ref<MapTransform>
  rotatingMapProjection: ComputedRef<GeoProjection | (()=>number[])>
}
export type ParentMapProvide = {
  [ParentKey]: ParentMap
}
export interface ButtonIconProps{
  id?: string,
  iconLeft?: string|string[]|any,
  iconLeftVariant?: string,
  iconLeftHoverVariant?: string,
  iconLeftWeight?: string,
  iconLeftHoverWeight?: string,
  iconLeftSize?: string,
  iconLeftLabel?: string,
  iconLeftLabelOffset?:number, //
  iconRight?: string|string[]|any,
  iconRightVariant?: string,
  iconRightHoverVariant?: string,
  iconRightWeight?: string,
  iconRightHoverWeight?: string,
  iconRightSize?: string,
  iconRightLabel?: string,
  iconRightLabelOffset?: number,
  iconSpinner?: string| any,
  hideLabel?: boolean,
  hideTooltip?: boolean,
  label?: string,
  square?: boolean,
  to?: any,
  variant: string,
  size?: string,
  block?: boolean,
  pill?: boolean,
  pressed?: boolean,
  tag?: string,
  type?: string,
  loading?: boolean,
  loadingDuration?: string,
  loadingText?: string,
  tooltipLabel?: string,
  tooltipPlacement?: PopoverPlacement,
  tooltipDelay?:{show: number, hide: number},
  showTooltipForce?: boolean,
  hover?: boolean,
  truncate?: boolean
}
