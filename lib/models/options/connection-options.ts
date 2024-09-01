import { ConnectionController } from "../connection/connection-controller";

export type ConnectionOptions =
  | {
      readonly type: "bezier-arrow";
      readonly color?: string;
    }
  | {
      readonly type: "custom";
      readonly controller: ConnectionController;
    };
