import { CoordsTransformFn } from "@/layouts";
import { CoordsTransformDeclaration } from "./coords-transform-declaration";

export type CoordsTransformConfig =
  | CoordsTransformFn
  | CoordsTransformDeclaration
  | readonly CoordsTransformDeclaration[];
