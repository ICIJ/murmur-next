/**
 * Utility types used across the library
 */
import type { StyleValue } from 'vue'

/**
 * Generic step type for accordion and wizard components
 */
export type Step = symbol | string

/**
 * ContentPlaceholder component types
 */
export interface BoxStyle {
  style: StyleValue
  subClass?: string
}

export type ContentPlaceholderRowBoxes = (number | string)[][]

export interface ContentPlaceholderRow {
  height: number | string
  boxes: ContentPlaceholderRowBoxes
}

export interface ContentPlaceholderStyledRow {
  height: number | string
  boxes: BoxStyle[]
}

export type ContentPlaceholderStyledRows = ContentPlaceholderStyledRow[]
export type ContentPlaceholderRows = ContentPlaceholderRow[]
