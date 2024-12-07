import { ConnectionController } from "@/connections";

export interface ConnectionPayload {
  from: string;
  to: string;
  controller: ConnectionController;
}
