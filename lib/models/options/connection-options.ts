import { ConnectionController } from "../connection/connection-controller";

export type ConnectionOptions =
  | {
      readonly type: "bezier-adaptive-arrow";
      readonly color?: string;
      readonly curvature?: number;
      readonly adaptiveCurvature?: number;
      readonly arowLength?: number;
      readonly arowWidth?: number;
    }
  | {
      readonly type: "custom";
      readonly controller: ConnectionController;
    }
  | {
      readonly type: "arc-adaptive-arrow";
      readonly color?: string;
    };
