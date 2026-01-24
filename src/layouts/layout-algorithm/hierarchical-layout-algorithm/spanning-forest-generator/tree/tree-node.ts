import { Identifier } from "@/identifier";

export interface TreeNode {
  readonly nodeId: Identifier;
  readonly children: Set<TreeNode>;
}
