import { Point } from "@/point";

export type TransformDeclaration =
  | {
      readonly a?: number | undefined;
      readonly b?: number | undefined;
      readonly c?: number | undefined;
      readonly d?: number | undefined;
      readonly e?: number | undefined;
      readonly f?: number | undefined;
    }
  | {
      readonly shift: Point;
    }
  | {
      readonly scale: number;
      readonly origin?: Point;
    }
  | {
      readonly rotate: number;
      readonly origin?: Point;
    }
  | {
      readonly mirror: number;
      readonly origin?: Point;
    };
