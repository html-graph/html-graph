import { EdgeControllerFactory } from "@/edges";

export interface CustomEdgeShape {
  readonly type: "custom";
  readonly controllerFactory: EdgeControllerFactory;
}
