import { CenterFn } from "@/center-fn";
import { EdgeControllerFactory } from "@/edges";
import { PublicViewportTransformer } from "@/viewport-transformer";

export interface Options {
  readonly background: {
    readonly drawingFn: (
      ctx: CanvasRenderingContext2D,
      transformer: PublicViewportTransformer,
    ) => void;
  };
  readonly nodes: {
    readonly centerFn: CenterFn;
  };
  readonly ports: {
    readonly centerFn: CenterFn;
    readonly direction: number;
  };
  readonly edges: {
    readonly controllerFactory: EdgeControllerFactory;
  };
}
