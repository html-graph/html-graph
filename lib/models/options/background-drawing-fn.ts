import { PublicViewportTransformer } from "../../components/public-viewport-transformer/public-viewport-transformer";

export type BackgroundDrawingFn = (
  ctx: CanvasRenderingContext2D,
  transformer: PublicViewportTransformer,
) => void;
