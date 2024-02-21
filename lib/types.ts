import type { StyleValue } from 'vue/types/jsx'

import { AccordionKey } from '@/keys'

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

export type BrandExpansionStyle = Pick<BrandStyle, '--monochrome-color' | 'background'>

export type Variant = 'primary' | 'secondary' | 'danger' | 'info' | 'warning' | 'success' | 'dark' | 'light'


