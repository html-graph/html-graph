import { TransformPreprocessorFn } from "../preprocessors";

export type TransformPreprocessorOption =
  | {
      readonly type: "scale-limit";
      readonly minContentScale?: number;
      readonly maxContentScale?: number;
    }
  | {
      readonly type: "shift-limit";
      readonly minX?: number;
      readonly maxX?: number;
      readonly minY?: number;
      readonly maxY?: number;
    }
  | {
      readonly type: "custom";
      readonly preprocessorFn: TransformPreprocessorFn;
    };
