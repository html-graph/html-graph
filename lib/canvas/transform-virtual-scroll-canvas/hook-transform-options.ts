import { EventSubject } from "@/event-subject";
import { TransformOptions } from "../user-transformable-viewport-canvas";
import { RenderingBox } from "@/html-view";

export const hookTransformOptions = (
  options: TransformOptions | undefined,
  trigger: EventSubject<RenderingBox>,
): TransformOptions => {
  console.log(trigger);

  return options ?? {};
};
