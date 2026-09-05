import { RectangularSelectionParams } from "@/configurators";
import { RectangularSelectionConfig } from "./rectangular-selection-config";
import { noopFn } from "../shared";

export const createRectangularSelectionParams = (
  config: RectangularSelectionConfig,
): RectangularSelectionParams => {
  return {
    onSelectionStarted: config.onSelectionStarted ?? noopFn,
    onSelectionChange: config.onSelectionChange ?? noopFn,
    onSelectionInterrupted: config.onSelectionInterrupted ?? noopFn,
    onSelectionFinished: config.onSelectionFinished ?? noopFn,
  };
};
