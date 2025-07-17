import type {DefineComponent, PropType, StyleValue} from 'vue'

import { AccordionKey, ParentKey } from '@/keys'
import { ComputedRef } from 'vue'
import type { GeoProjection } from 'd3-geo'
import { Ref } from 'vue'
import type { ButtonVariant, PopoverPlacement, Size} from "bootstrap-vue-next";
import {TextColorVariant} from "bootstrap-vue-next";

export type Step = symbol | string
 type IconPhosphorProps = {
  weight: {
    type: PropType<IconWeight>;
  }
  size: {
    type: PropType<string | number>;
  }
  color: {
    type: PropType<string>;
  }
  mirrored: {
    type: PropType<boolean>;
    default: false;
  }
}
export type IconPhosphor = DefineComponent<IconPhosphorProps, {}, any>;
export type IconWeight = "bold" | "fill" | "thin" | "light" | "regular" | "duotone";
export type IconSize = '2xs'| 'xs'| 'sm'| 'md'| 'lg'| 'xl'| '2xl'

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
  iconLeft?: string|string[]|IconPhosphor,
  iconLeftVariant?: TextColorVariant,
  iconLeftHoverVariant?: TextColorVariant,
  iconLeftWeight?: IconWeight,
  iconLeftHoverWeight?: IconWeight,
  iconLeftSize?: string,
  iconLeftLabel?: string,
  iconLeftLabelOffset?:number, //
  iconRight?: string|string[]|any,
  iconRightVariant?: TextColorVariant,
  iconRightHoverVariant?: TextColorVariant,
  iconRightWeight?: IconWeight,
  iconRightHoverWeight?: IconWeight,
  iconRightSize?: string,
  iconRightLabel?: string,
  iconRightLabelOffset?: number,
  iconSpinner?: string| any,
  hideLabel?: boolean,
  hideTooltip?: boolean,
  label?: string,
  square?: boolean,
  to?: any,
  variant?: ButtonVariant,
  size?: Size,
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
export interface PhosphorIconProps {
  name: string|string[]|IconPhosphor,
  size?: IconSize | string,
  scale?: number,
  variant?: TextColorVariant,
  hoverVariant?: TextColorVariant,
  fill?: boolean,
  weight?:IconWeight,
  hoverWeight?:IconWeight,
  beat?:boolean,
  beatDuration?:string,
  fade?: boolean,
  fadeDuration?:string,
  spin?: boolean,
  spinReverse?: boolean,
  spinDuration?:string,
  hover?: boolean,
}
