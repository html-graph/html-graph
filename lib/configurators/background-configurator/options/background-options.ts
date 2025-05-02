import { DotsRenderer } from "./dots-renderer";

export interface BackgroundOptions {
  readonly tileDimensions?: {
    readonly width?: number;
    readonly height?: number;
  };
  readonly renderer?: DotsRenderer | SVGElement;
  readonly maxViewportScale?: number;
}
