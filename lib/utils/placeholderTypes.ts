import type { StyleValue } from 'vue'

export interface BoxStyle {
  style: StyleValue
  subClass?: string
}

export type ContentPlaceholderRowBoxes = Array<Array<number | string>>

export interface ContentPlaceholderRow {
  height: number | string
  boxes: ContentPlaceholderRowBoxes
}

export interface ContentPlaceholderStyledRow {
  height: number | string
  boxes: Array<BoxStyle>
}

export type ContentPlaceholderStyledRows = Array<ContentPlaceholderStyledRow>
export type ContentPlaceholderRows = Array<ContentPlaceholderRow>
