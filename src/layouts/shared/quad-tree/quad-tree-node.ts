import { Identifier } from "@/identifier";
import { Point } from "@/point";

export interface QuadTreeNode {
  nodeId: Identifier | null;
  position: Point;
  mass: number;
  parent: QuadTreeNode | null;
  lt: QuadTreeNode | null;
  lb: QuadTreeNode | null;
  rt: QuadTreeNode | null;
  rb: QuadTreeNode | null;
}
