import { PublicViewportTransformer } from "../viewport-transformer";

export type BackgroundDrawingFn = (
  ctx: CanvasRenderingContext2D,
  transformer: PublicViewportTransformer,
) => void;
