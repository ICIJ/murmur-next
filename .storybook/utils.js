import { BUTTON_SIZES, BREAKPOINT_SIZES } from "@/enums/sizes"
import { ICON_WEIGHTS } from "@/enums/iconWeights"
import { VARIANTS } from "../lib/enums/variants";
export const variantsArgType = {
  control: 'select',
  options: VARIANTS
}
export const buttonSizesArgType = {
  control: 'inline-radio',
  options: BUTTON_SIZES
}
export const breakpointSizeArgType = {
  control: 'select',
  options: BREAKPOINT_SIZES
}

export const iconWeightsArgType = {
  control: 'select',
  options: ICON_WEIGHTS
}

export const inputTypeArgType = {
  control: 'select',
  options: [
    'text',
    'number',
    'email',
    'password',
    'search',
    'url',
    'tel',
    'date',
    'time',
    'range',
    'color',
    'datetime',
    'datetime-local',
    'month',
    'week'
  ]
}
