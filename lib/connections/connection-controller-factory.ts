import { ConnectionController } from "./connection-controller";
import { ConnectionType } from "./connection-type";

export type ConnectionControllerFactory = (
  type: ConnectionType,
) => ConnectionController;
