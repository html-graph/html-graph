import { Identifier } from "@/identifier";
import { MutableQuadTreeNode } from "./mutable-quad-tree-node";
import { Point } from "@/point";
import { AreaBox } from "./area-box";

export interface QuadTreeNode {
  readonly nodeIds: ReadonlySet<Identifier>;
  totalMass: number;
  totalCharge: number;
  massCenter: Point;
  readonly box: AreaBox;
  parent: MutableQuadTreeNode | null;
  lt: MutableQuadTreeNode | null;
  lb: MutableQuadTreeNode | null;
  rt: MutableQuadTreeNode | null;
  rb: MutableQuadTreeNode | null;
}
