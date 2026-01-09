import { MutablePoint, Point } from "@/point";
import { QuadTreeNode } from "./quad-tree";

export interface ApplyFarForceParams {
  readonly totalForce: MutablePoint;
  readonly targetCoords: Point;
  readonly target: QuadTreeNode | null;
  readonly current: QuadTreeNode;
}
