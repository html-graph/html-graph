import { Identifier } from "@/identifier";
import { AreaBox } from "./area-box";
import { MutablePoint } from "../mutable-point";

export interface QuadTreeNode {
  nodeIds: Set<Identifier>;
  totalMass: number;
  massCenter: MutablePoint | null;
  box: AreaBox;
  parent: QuadTreeNode | null;
  lt: QuadTreeNode | null;
  lb: QuadTreeNode | null;
  rt: QuadTreeNode | null;
  rb: QuadTreeNode | null;
}
