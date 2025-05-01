import { createContent } from "../utils";
import { DotsRenderer } from "./dots-renderer";

export const resolveRenderer = (
  rendererOption: DotsRenderer | SVGElement,
): SVGElement => {
  if (rendererOption instanceof SVGElement) {
    return rendererOption;
  } else {
    return createContent(
      rendererOption?.radius ?? 1.5,
      rendererOption?.color ?? "#d8d8d8",
    );
  }
};
