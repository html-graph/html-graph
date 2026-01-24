import { Identifier } from "@/identifier";

export interface MutableTreeNode {
  readonly nodeId: Identifier;
  readonly children: Set<MutableTreeNode>;
}
