import { ConnectionControllerFactory } from "./connection-controller-factory";

export interface CustomConnectionOptions {
  readonly type: "custom";
  readonly controllerFactory: ConnectionControllerFactory;
}
