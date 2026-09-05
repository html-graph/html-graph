import { RectangularSelectionParams } from "@/configurators";
import { RectangularSelectionConfig } from "./rectangular-selection-config";
import { noopFn } from "../shared";
import { createDefaultRectangleElement } from "./create-default-rectangle-element";
import { defaultMouseDownEventVerifier } from "./default-mouse-down-event-verifier";
import { defaultMouseUpEventVerifier } from "./default-mouse-up-event-verifier";

export const createRectangularSelectionParams = (
  config: RectangularSelectionConfig,
): RectangularSelectionParams => {
  return {
    rectangleElement:
      config.rectangleElement ?? createDefaultRectangleElement(),
    mouseDownEventVerifier: defaultMouseDownEventVerifier,
    mouseUpEventVerifier: defaultMouseUpEventVerifier,
    onSelectionStarted: config.onSelectionStarted ?? noopFn,
    onSelectionChange: config.onSelectionChange ?? noopFn,
    onSelectionInterrupted: config.onSelectionInterrupted ?? noopFn,
    onSelectionFinished: config.onSelectionFinished ?? noopFn,
  };
};
