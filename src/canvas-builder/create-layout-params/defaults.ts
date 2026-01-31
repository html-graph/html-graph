import { Point } from "@/point";

export const defaults = Object.freeze({
  staticNodeResolver: (): boolean => false,
  onBeforeApplied: (): void => {},
  onAfterApplied: (): void => {},
  hierarchicalLayout: {
    layerWidth: 300,
    layerSpace: 300,
  },
  transformFn: (point: Point): Point => point,
});
