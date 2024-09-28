import { PublicViewportTransformer } from "../../components/public-viewport-transformer/public-viewport-transformer";
import { CenterFn } from "../center/center-fn";
import { ConnectionControllerFactory } from "./connection-controller-factory";
import { LayersMode } from "./layers-mode";

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
