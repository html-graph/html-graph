import { BackgroundDrawingFn } from "@/background";

export type BackgroundOptions =
  | {
      readonly type: "none";
    }
  | {
      readonly type: "dots";
      readonly dotColor?: string;
      readonly dotGap?: number;
      readonly dotRadius?: number;
      readonly color?: string;
      readonly limit?: number;
    }
  | {
      readonly type: "custom";
      readonly drawingFn: BackgroundDrawingFn;
    };
