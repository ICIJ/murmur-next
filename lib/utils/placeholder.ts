import type {
  BoxStyle,
  ContentPlaceholderRow,
  ContentPlaceholderRows,
  ContentPlaceholderStyledRow,
  ContentPlaceholderStyledRows
} from '@/types'

const CSS_WIDTH_SUFFIXES = ['px', '%', 'em', 'rem']

/**
 * Tell whether a value is a unitless flex-basis number (e.g. `2` or `'2'`).
 *
 * @param value - The candidate box size.
 * @returns `true` when the value is purely numeric.
 * @example
 * isFlexBasis(2) // true
 * isFlexBasis('20px') // false
 */
function isFlexBasis(value: string | number): boolean {
  return Number(value).toString() === value.toString()
}

/**
 * Tell whether a value is a CSS width with a supported unit (px, %, em, rem).
 *
 * @param value - The candidate box size.
 * @returns `true` when the value is a number followed by a supported unit.
 * @example
 * isWidth('20px') // true
 * isWidth(20) // false
 */
function isWidth(value: string | number): boolean {
  const valueAsStr = String(value)
  return CSS_WIDTH_SUFFIXES.some((suffix) => {
    const segments = valueAsStr.split(suffix)
    return (
      Number(segments[0])
      && segments[1] === ''
      && segments.length === 2
    )
  })
}

/**
 * Build the flexbox style declarations for a single placeholder box.
 *
 * @param left - The leading spacer size; `0` means no spacer.
 * @param width - The box size, either a flex-grow factor or a CSS width.
 * @param isLast - Whether this box is the last in its row.
 * @param subClass - The CSS sub-class applied to spacer boxes.
 * @returns The ordered list of box styles for the spacer, the box, and the trailing filler.
 */
function getBoxStyle(
  left: number,
  width: number,
  isLast: boolean,
  subClass = 'box'
): BoxStyle[] {
  const boxStyles: BoxStyle[] = []

  // Prepend a leading spacer when the box does not start at the row's edge.
  if (left !== 0) {
    if (isFlexBasis(left)) {
      boxStyles.push({
        style: `flex-grow: ${left}; flex-shrink: 0; flex-basis: 0;`,
        subClass
      })
    }
    else if (isWidth(left)) {
      boxStyles.push({
        style: `flex-grow: 0; flex-shrink: 0; flex-basis: ${left};`,
        subClass
      })
    }
  }
  if (isFlexBasis(width)) {
    boxStyles.push({ style: `flex-grow: ${width}; flex-shrink: 0; flex-basis: 0;` })
  }
  else if (isWidth(width)) {
    boxStyles.push({ style: `flex-grow: 0; flex-shrink: 0; flex-basis: ${width};` })
  }
  // Fill the remaining row space after the last box.
  if (isLast) {
    boxStyles.push({
      style: 'flex-grow: 1; flex-shrink: 0; flex-basis: 0;',
      subClass
    })
  }
  return boxStyles
}

/**
 * Turn placeholder rows of raw box sizes into rows of computed flexbox styles.
 *
 * @param rows - The placeholder rows, each box expressed as `[left, width]`.
 * @param subClass - The CSS sub-class applied to spacer boxes.
 * @returns The rows with their boxes converted to style declarations.
 */
function formatRows(
  rows: ContentPlaceholderRows,
  subClass = 'box'
): ContentPlaceholderStyledRows {
  return rows.map((row: ContentPlaceholderRow) => {
    const rowBoxes: BoxStyle[] = []
    const styledRow: ContentPlaceholderStyledRow = {
      height: row.height,
      boxes: []
    }
    row.boxes.forEach((box: (number | string)[], index: number) => {
      const isLast: boolean = index === row.boxes.length - 1
      rowBoxes.push(...getBoxStyle(box[0] as number, box[1] as number, isLast, subClass))
    })
    styledRow.boxes = rowBoxes
    return styledRow
  })
}

export {
  isFlexBasis,
  isWidth,
  getBoxStyle,
  formatRows
}
