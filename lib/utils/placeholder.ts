import {
  BoxStyle,
  ContentPlaceholderStyledRow,
  ContentPlaceholderRow,
  ContentPlaceholderRowBoxes,
  ContentPlaceholderStyledRows,
  ContentPlaceholderRows,
} from "@/utils/placeholderTypes";

export function isFlexBasis(value: string | number): boolean {
  return Number(value).toString() === value.toString();
}

export function isWidth(value: string | number): boolean {
  const valueAsStr = String(value);
  const cssSuffix = ["px", "%", "em", "rem"];
  let checkState = false;
  cssSuffix.forEach((suffix) => {
    if (
      Number(valueAsStr.split(suffix)[0]) &&
      valueAsStr.split(suffix)[1] === "" &&
      valueAsStr.split(suffix).length === 2
    ) {
      checkState = true;
    }
  });
  return checkState;
}

export function getBoxStyle(
  left: number,
  width: number,
  isLast: boolean,
  subClass: string = "box",
): BoxStyle[] {
  const arr: BoxStyle[] = [];

  if (left !== 0) {
    if (isFlexBasis(left)) {
      arr.push({
        style: `flex-grow: ${left}; flex-shrink: 0; flex-basis: 0;`,
        subClass,
      });
    } else if (isWidth(left)) {
      arr.push({
        style: `flex-grow: 0; flex-shrink: 0; flex-basis: ${left};`,
        subClass,
      });
    }
  }
  if (isFlexBasis(width)) {
    arr.push({ style: `flex-grow: ${width}; flex-shrink: 0; flex-basis: 0;` });
  } else if (isWidth(width)) {
    arr.push({ style: `flex-grow: 0; flex-shrink: 0; flex-basis: ${width};` });
  }
  if (isLast) {
    arr.push({
      style: "flex-grow: 1; flex-shrink: 0; flex-basis: 0;",
      subClass,
    });
  }
  return arr;
}

export function formatRows(
  rows: ContentPlaceholderRows,
  subClass: string = "box",
): ContentPlaceholderStyledRows {
  const rowArr: ContentPlaceholderStyledRows = rows.map(
    (row: ContentPlaceholderRow) => {
      // Will contain all boxes in
      const rowBoxes: Array<BoxStyle> = [];
      // Create placeholder row with initial height
      const rowObj: ContentPlaceholderStyledRow = {
        height: row.height,
        boxes: [],
      };
      // Add style
      row.boxes.forEach((box: Array<any>, index: number) => {
        const isLast: boolean = index === row.boxes.length - 1;
        // Merge the box styles
        rowBoxes.push(...getBoxStyle(box[0], box[1], isLast, subClass));
      });
      rowObj.boxes = rowBoxes;
      return rowObj;
    },
  );

  return rowArr;
}

export default {
  isFlexBasis,
  isWidth,
  getBoxStyle,
  formatRows,
};
