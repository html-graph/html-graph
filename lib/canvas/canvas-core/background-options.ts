import { BackgroundDrawingFn } from "@/background";

export type BackgroundOptions =
  | {
      readonly type: "none";
    }
  | {
      readonly type: "color";
      readonly color?: string;
    }
  | {
      readonly type: "dots";
      readonly dotColor?: string;
      readonly dotGap?: number;
      readonly dotRadius?: number;
      readonly color?: string;
    }
  | {
      readonly type: "custom";
      readonly drawingFn: BackgroundDrawingFn;
    };
