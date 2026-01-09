import { Identifier } from "@/identifier";
import { AreaBox } from "./area-box";
import { MutablePoint } from "@/point";

export interface MutableQuadTreeNode {
  readonly nodeIds: Set<Identifier>;
  totalMass: number;
  totalCharge: number;
  chargeCenter: MutablePoint;
  readonly box: AreaBox;
  parent: MutableQuadTreeNode | null;
  lt: MutableQuadTreeNode | null;
  lb: MutableQuadTreeNode | null;
  rt: MutableQuadTreeNode | null;
  rb: MutableQuadTreeNode | null;
}
