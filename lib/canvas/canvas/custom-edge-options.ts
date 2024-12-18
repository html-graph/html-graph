import { EdgeControllerFactory } from "@/edges";

export interface CustomEdgeOptions {
  readonly type: "custom";
  readonly controllerFactory: EdgeControllerFactory;
}
