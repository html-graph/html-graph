import {
  BackgroundDrawingFn,
  createColorBackgroundDrawingFn,
  createDotsBackgroundDrawingFn,
  createNoopBackgroundDrawingFn,
} from "@/background";
import { BackgroundOptions } from "./background-options";

export const resolveBackgroundDrawingFn: (
  options: BackgroundOptions,
) => BackgroundDrawingFn = (options: BackgroundOptions) => {
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
