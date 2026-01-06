/**
 * Complex component prop types and shared component interfaces
 */
import type { Component, StyleValue } from 'vue'
import type { TextColorVariant, ButtonVariant, PopoverPlacement, Size } from 'bootstrap-vue-next'

import type { Step } from './utils'
import { AccordionKey } from '@/keys'

// Re-export commonly used bootstrap-vue-next types for convenience
export type { TextColorVariant, ButtonVariant, PopoverPlacement, Size } from 'bootstrap-vue-next'

/**
 * ButtonIcon component props - complex component with 30+ properties
 */
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

/**
 * Accordion component state and methods (used with provide/inject)
 */
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

/**
 * Brand component style types
 */
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
