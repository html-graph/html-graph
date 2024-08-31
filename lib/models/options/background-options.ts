import { PublicViewportTransformer } from "../../components/public-viewport-transformer/public-viewport-transformer";

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
      readonly drawingFn: (
        ctx: CanvasRenderingContext2D,
        transformer: PublicViewportTransformer,
      ) => void;
    };
