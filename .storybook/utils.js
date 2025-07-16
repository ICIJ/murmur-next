import { VARIANT } from "@/enums"
export const variantsArgType = {
  control: 'select',
  options: Object.values(VARIANT)
}
export const buttonSizesArgType = {
  control: 'inline-radio',
  options: ['sm', 'md', 'lg']
}
export const breakpointSizeArgType = {
  control: 'select',
  options: ['xs','sm','md','lg','xl','xxl']
}

export const iconWeightsArgType = {
  control: 'select',
  options: ["thin" , "light" , "regular" , "bold" , "fill" , "duotone"]
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
