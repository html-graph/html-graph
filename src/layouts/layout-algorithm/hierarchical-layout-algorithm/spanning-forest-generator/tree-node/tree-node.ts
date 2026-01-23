import { Identifier } from "@/identifier";

export interface TreeNode {
  readonly parent: TreeNode | null;
  readonly nodeId: Identifier;
  readonly children: Set<TreeNode>;
}
