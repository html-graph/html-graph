import { CenterFn } from "@/center-fn";
import { EdgeControllerFactory } from "@/edges";
import { LayersMode } from "@/layers";
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
  };
  readonly edges: {
    readonly controllerFactory: EdgeControllerFactory;
  };
  readonly layers: {
    readonly mode: LayersMode;
  };
}
