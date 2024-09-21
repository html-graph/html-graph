import { ConnectionControllerFactory } from "./connection-controller-factory";

export type ConnectionOptions =
  | {
      readonly type: "bezier";
      readonly color?: string;
      readonly width?: number;
      readonly curvature?: number;
      readonly arowLength?: number;
      readonly arowWidth?: number;
      readonly hasSourceArrow?: boolean;
      readonly hasTargetArrow?: boolean;
    }
  | {
      readonly type: "custom";
      readonly controllerFactory: ConnectionControllerFactory;
    }
  | {
      readonly type: "straight";
      readonly color?: string;
      readonly width?: number;
      readonly arowLength?: number;
      readonly arowWidth?: number;
      readonly hasSourceArrow?: boolean;
      readonly hasTargetArrow?: boolean;
    };
