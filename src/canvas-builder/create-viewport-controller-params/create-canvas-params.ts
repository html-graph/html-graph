import { CanvasDefaults } from "../shared";
import { ViewportControllerParams } from "@/viewport-controller";

export const createViewportControllerParams = (
  canvasDefaults: CanvasDefaults,
): ViewportControllerParams => {
  return {
    focus: {
      contentOffset: canvasDefaults.focus?.contentOffset ?? 100,
      minContentScale: canvasDefaults.focus?.minContentScale ?? 0,
    },
  };
};
