import { ConnectionController } from "../connection/connection-controller";

export type ConnectionOptions =
  | {
      readonly type: "bezier";
      readonly color?: string;
      readonly curvature?: number;
      readonly adaptiveCurvature?: number;
      readonly arowLength?: number;
      readonly arowWidth?: number;
      readonly hasSourceArrow?: boolean;
      readonly hasTargetArrow?: boolean;
    }
  | {
      readonly type: "custom";
      readonly controller: ConnectionController;
    }
  | {
      readonly type: "arc";
      readonly color?: string;
      readonly arowLength?: number;
      readonly arowWidth?: number;
      readonly hasSourceArrow?: boolean;
      readonly hasTargetArrow?: boolean;
    }
  | {
      readonly type: "line";
      readonly color?: string;
      readonly arowLength?: number;
      readonly arowWidth?: number;
      readonly hasSourceArrow?: boolean;
      readonly hasTargetArrow?: boolean;
    };
