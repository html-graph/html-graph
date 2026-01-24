import { Identifier } from "@/identifier";
import { Tree } from "../tree";
import { ChildrenOffsetsGeneratorParams } from "./children-offsets-generator-params";

export class ChildrenOffsetsGenerator {
  private readonly deltas = new Map<Identifier, number>();

  private readonly sparsityRadius: number;

  private readonly sparsityDiameter: number;

  public constructor(
    private readonly tree: Tree,
    params: ChildrenOffsetsGeneratorParams,
  ) {
    this.sparsityRadius = params.sparsityRadius;
    this.sparsityDiameter = 2 * this.sparsityRadius;

    [...this.tree.sequence].reverse().forEach((treeNode) => {
      if (treeNode.children.size > 0) {
        let currentDelta = (1 - treeNode.children.size) * this.sparsityRadius;

        treeNode.children.forEach((childNode) => {
          this.deltas.set(childNode.nodeId, currentDelta);

          currentDelta += this.sparsityDiameter;
        });
      }
    });

    this.deltas.set(this.tree.root.nodeId, 0);
  }

  public generate(): ReadonlyMap<Identifier, number> {
    return this.deltas;
  }
}
