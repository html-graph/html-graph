import { ConnectionController } from "../connection/connection-controller";

export type ConnectionOptions =
  | {
      readonly type: "default";
    }
  | {
      readonly type: "custom";
      readonly controller: ConnectionController;
    };
