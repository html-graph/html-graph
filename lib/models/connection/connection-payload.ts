import { ConnectionController } from "../connection/connection-controller";

export interface ConnectionPayload {
  from: string;
  to: string;
  svgController: ConnectionController;
}
