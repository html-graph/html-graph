import { Identifier } from "@/identifier";
import { Point } from "@/point";

export interface QuadTreeNode {
  readonly nodeId: Identifier | null;
  readonly position: Point;
  readonly areaContainingRadius: {
    readonly horizontal: number;
    readonly vertical: number;
  } | null;
  mass: number;
  parent: QuadTreeNode | null;
  lt: QuadTreeNode | null;
  lb: QuadTreeNode | null;
  rt: QuadTreeNode | null;
  rb: QuadTreeNode | null;
}
