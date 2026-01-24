import { TreeNode } from "./tree-node";

export interface Tree {
  readonly root: TreeNode;
  readonly sequence: readonly TreeNode[];
}
