import { Identifier } from "@/identifier";
import { AreaBox } from "./area-box";

export interface QuadTreeNode {
  nodeIds: Set<Identifier>;
  box: AreaBox;
  parent: QuadTreeNode | null;
  lt: QuadTreeNode | null;
  lb: QuadTreeNode | null;
  rt: QuadTreeNode | null;
  rb: QuadTreeNode | null;
}
