import { MutablePoint, Point } from "@/point";
import { QuadTreeNode } from "./quad-tree";
import { Identifier } from "@/identifier";

export interface ApplyNearForceParams {
  readonly totalForce: MutablePoint;
  readonly targetCoords: Point;
  readonly target: QuadTreeNode | null;
  readonly current: QuadTreeNode;
  readonly nodesCoords: ReadonlyMap<Identifier, Point>;
}
