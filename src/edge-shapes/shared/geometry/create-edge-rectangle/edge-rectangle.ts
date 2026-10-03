import { Point } from "@/point";
import { EdgeBox } from "../../edge-box";

export interface EdgeRectangle {
  readonly box: EdgeBox;
  readonly from: Point;
  readonly to: Point;
}
