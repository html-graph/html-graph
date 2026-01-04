import { Identifier } from "@/identifier";
import { AreaBox } from "./area-box";
import { MutablePoint } from "@/point";

export interface QuadTreeNode {
  readonly nodeIds: Set<Identifier>;
  totalMass: number;
  totalCharge: number;
  massCenter: MutablePoint;
  readonly box: AreaBox;
  parent: QuadTreeNode | null;
  lt: QuadTreeNode | null;
  lb: QuadTreeNode | null;
  rt: QuadTreeNode | null;
  rb: QuadTreeNode | null;
}
