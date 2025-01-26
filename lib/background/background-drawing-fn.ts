import { AbstractPublicViewportTransformer } from "@/viewport-transformer";

export type BackgroundDrawingFn = (
  ctx: CanvasRenderingContext2D,
  transformer: AbstractPublicViewportTransformer,
) => void;
