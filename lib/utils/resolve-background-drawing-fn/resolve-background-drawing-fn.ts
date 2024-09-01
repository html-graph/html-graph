import { BackgroundDrawingFn } from "../../models/options/background-drawing-fn";
import { BackgroundOptions } from "../../models/options/background-options";
import {
  createColorBackgroundDrawingFn,
  createDotsBackgroundDrawingFn,
  createNoopBackgroundDrawingFn,
} from "../create-background-drawing-fn/create-background-drawing-fn";

export const resolveBackgroundDrawingFn = (
  options: BackgroundOptions | undefined,
) => {
  let drawingFn: BackgroundDrawingFn = createNoopBackgroundDrawingFn();

  switch (options?.type) {
    case "custom":
      drawingFn = options.drawingFn;
      break;

    case "dots":
      drawingFn = createDotsBackgroundDrawingFn(
        options.dotColor ?? "#d8d8d8",
        options.dotGap ?? 25,
        options.dotRadius ?? 1.5,
        options.color ?? "#ffffff",
      );
      break;
    case "color":
      drawingFn = createColorBackgroundDrawingFn(options.color ?? "#ffffff");
      break;
    default:
      break;
  }

  return drawingFn;
};
