import { ConnectionController } from "../connection/connection-controller";

export interface ConnectionPayload {
  from: string;
  to: string;
  controller: ConnectionController;
}
