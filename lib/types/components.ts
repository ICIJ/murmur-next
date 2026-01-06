/**
 * Shared component interfaces for provide/inject patterns
 */
import type { StyleValue } from 'vue'

import type { Step } from './utils'
import { AccordionKey } from '@/keys'

// Re-export commonly used bootstrap-vue-next types for convenience
export type { TextColorVariant, ButtonVariant, PopoverPlacement, Size } from 'bootstrap-vue-next'

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
