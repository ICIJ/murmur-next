import type { StyleValue } from "vue";

import { AccordionKey, ParentKey } from "@/keys";
import { ComputedRef } from "vue";
import type { GeoProjection } from "d3-geo";
import { Ref } from "vue";

export type Step = symbol | string;

export type Accordion = {
  emitAccordionNextStepEvent: () => void;
  emitAccordionPreviousStepEvent: () => void;
  isActiveStep: (step: Step) => boolean;
  isPreviousStep: (step: Step) => boolean;
  isFirstStep: (step: Step) => boolean;
  isLastStep: (step: Step) => boolean;
  step: Step;
  steps: Step[];
};

export type AccordionProvide = {
  [AccordionKey]: Accordion;
};

export type BrandStyle = StyleValue & {
  "--monochrome-color": string;
  color: string;
  background: string;
  width: string;
};

export type BrandExpansionStyle = Pick<
  BrandStyle,
  "--monochrome-color" | "background"
>;

export type Variant =
  | "primary"
  | "secondary"
  | "danger"
  | "info"
  | "warning"
  | "success"
  | "dark"
  | "light";

export type MapTransform = {
  k: number;
  x: number;
  y: number;
  rotateX: number;
  rotateY: number;
};

export type ParentMap = {
  mapRect: Ref<DOMRect>;
  mapTransform: Ref<MapTransform>;
  rotatingMapProjection: ComputedRef<GeoProjection | Function>;
};
export type ParentMapProvide = {
  [ParentKey]: ParentMap;
};
