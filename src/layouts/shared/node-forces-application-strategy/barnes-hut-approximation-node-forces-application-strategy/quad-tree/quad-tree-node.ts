import { Identifier } from "@/identifier";
import { MutableQuadTreeNode } from "./mutable-quad-tree-node";
import { Point } from "@/point";
import { AreaBox } from "./area-box";

export interface QuadTreeNode {
  readonly nodeIds: ReadonlySet<Identifier>;
  readonly totalMass: number;
  readonly totalCharge: number;
  readonly chargeCenter: Point;
  readonly box: AreaBox;
  readonly parent: MutableQuadTreeNode | null;
  readonly lt: MutableQuadTreeNode | null;
  readonly lb: MutableQuadTreeNode | null;
  readonly rt: MutableQuadTreeNode | null;
  readonly rb: MutableQuadTreeNode | null;
}
