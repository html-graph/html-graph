import { ConnectionControllerFactory } from "@/connections";

export interface CustomConnectionOptions {
  readonly type: "custom";
  readonly controllerFactory: ConnectionControllerFactory;
}
