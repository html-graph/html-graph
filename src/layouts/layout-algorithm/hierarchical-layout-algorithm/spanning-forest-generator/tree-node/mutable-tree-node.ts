import { Identifier } from "@/identifier";

export interface MutableTreeNode {
  parent: MutableTreeNode | null;
  readonly nodeId: Identifier;
  readonly children: Set<MutableTreeNode>;
}
