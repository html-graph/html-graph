import { CenterFn } from "../../center-fn";
import { ConnectionControllerFactory } from "../../connections";
import { LayersMode } from "../../layers/layers-mode";
import { PublicViewportTransformer } from "../../viewport-transformer";

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
  readonly connections: {
    readonly controllerFactory: ConnectionControllerFactory;
  };
  readonly layers: {
    readonly mode: LayersMode;
  };
}
