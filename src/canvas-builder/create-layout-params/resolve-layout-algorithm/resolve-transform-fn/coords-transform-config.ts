import { CoordsTransformFn } from "@/layouts";
import { TransformDeclaration } from "./transform-declaration";

export type CoordsTransformConfig =
  | CoordsTransformFn
  | TransformDeclaration
  | readonly TransformDeclaration[];
