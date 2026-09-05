import { RectangularSelectionParams } from "@/configurators";
import { RectangularSelectionConfig } from "./rectangular-selection-config";
import { lmbCtrlMouseEventVerifier, noopFn } from "../shared";
import { createDefaultRectangleElement } from "./create-default-rectangle-element";
import { lmbMouseEventVerifier } from "../shared";

export const createRectangularSelectionParams = (
  config: RectangularSelectionConfig,
): RectangularSelectionParams => {
  return {
    rectangleElement:
      config.rectangleElement ?? createDefaultRectangleElement(),
    mouseDownEventVerifier:
      config.mouseDownEventVerifier ?? lmbCtrlMouseEventVerifier,
    mouseUpEventVerifier:
      config.mouseUpEventVerifier ?? lmbMouseEventVerifier,
    onSelectionStarted: config.onSelectionStarted ?? noopFn,
    onSelectionChange: config.onSelectionChange ?? noopFn,
    onSelectionInterrupted: config.onSelectionInterrupted ?? noopFn,
    onSelectionFinished: config.onSelectionFinished ?? noopFn,
  };
};
