import { BackgroundOptions } from "../../models/options/background-options";
import {
  createColorBackgroundDrawingFn,
  createDotsBackgroundDrawingFn,
  createNoopBackgroundDrawingFn,
} from "../create-background-drawing-fn/create-background-drawing-fn";

export const resolveBackgroundDrawingFn = (
  options: BackgroundOptions | undefined,
) => {
  switch (options?.type) {
    case "custom":
      return options.drawingFn;
    case "dots":
      return createDotsBackgroundDrawingFn(
        options.dotColor ?? "#d8d8d8",
        options.dotGap ?? 25,
        options.dotRadius ?? 1.5,
        options.color ?? "#ffffff",
      );
    case "color":
      return createColorBackgroundDrawingFn(options.color ?? "#ffffff");
    default:
      return createNoopBackgroundDrawingFn();
  }
};
