import { Point } from "@/point";

export type CoordsTransformDeclaration =
  | {
      readonly a?: number | undefined;
      readonly b?: number | undefined;
      readonly c?: number | undefined;
      readonly d?: number | undefined;
      readonly e?: number | undefined;
      readonly f?: number | undefined;
    }
  | {
      readonly scale: number;
      readonly center?: Point;
    };
