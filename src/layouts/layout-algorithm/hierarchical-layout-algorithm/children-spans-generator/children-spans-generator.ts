import { Identifier } from "@/identifier";
import { Tree } from "../tree";
import { ChildrenSpansGeneratorParams } from "./children-spans-generator-params";

export class ChildrenSpansGenerator {
  private readonly radii = new Map<Identifier, number>();

  private readonly deltas = new Map<Identifier, number>();

  public constructor(
    private readonly tree: Tree,
    private readonly params: ChildrenSpansGeneratorParams,
  ) {
    const reverseSequence = [...this.tree.sequence].reverse();

    reverseSequence.forEach((treeNode) => {
      if (treeNode.children.size === 0) {
        this.radii.set(treeNode.nodeId, this.params.sparsityRadius);
      } else {
        let totalRadius = 0;

        treeNode.children.forEach((childNode) => {
          const childRadius = this.radii.get(childNode.nodeId)!;

          totalRadius += childRadius;
        });

        let currentDelta =
          (1 - treeNode.children.size) * this.params.sparsityRadius;

        treeNode.children.forEach((childNode) => {
          this.deltas.set(childNode.nodeId, currentDelta);

          currentDelta += 2 * this.params.sparsityRadius;
        });

        this.radii.set(treeNode.nodeId, totalRadius);
      }
    });

    this.deltas.set(this.tree.root.nodeId, 0);
  }

  public generate(): ReadonlyMap<Identifier, number> {
    return this.deltas;
  }
}
