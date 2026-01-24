import { Identifier } from "@/identifier";
import { Tree } from "../tree";
import { ChildrenOffsetsGeneratorParams } from "./children-offsets-generator-params";

export class ChildrenOffsetsGenerator {
  private readonly offsets = new Map<Identifier, number>();

  private readonly radii = new Map<Identifier, number>();

  private readonly spaceAroundRadius: number;

  public constructor(
    private readonly tree: Tree,
    params: ChildrenOffsetsGeneratorParams,
  ) {
    this.spaceAroundRadius = params.spaceAroundRadius;
    this.offsets.set(this.tree.root.nodeId, 0);

    const reverseSequence = [...this.tree.sequence].reverse();

    reverseSequence.forEach((treeNode) => {
      if (treeNode.children.size === 0) {
        this.radii.set(treeNode.nodeId, this.spaceAroundRadius);
      } else {
        let totalRadius = 0;

        treeNode.children.forEach((childNode) => {
          const radius = this.radii.get(childNode.nodeId)!;

          totalRadius += radius;
        });

        this.radii.set(treeNode.nodeId, totalRadius);

        let currentOffset = -totalRadius;

        treeNode.children.forEach((childNode) => {
          const radius = this.radii.get(childNode.nodeId)!;
          currentOffset += radius;

          this.offsets.set(childNode.nodeId, currentOffset);

          currentOffset += radius;
        });
      }
    });
  }

  public generate(): ReadonlyMap<Identifier, number> {
    return this.offsets;
  }
}
