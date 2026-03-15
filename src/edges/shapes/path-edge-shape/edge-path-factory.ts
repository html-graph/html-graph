import { Point } from "@/point";
import { EdgePath } from "../../paths";

export type EdgePathFactory = (
  from: Point,
  to: Point,
  fromDir: Point,
  toDir: Point,
) => EdgePath;
