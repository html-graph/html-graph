import { Identifier } from "@/identifier";
import { ChildrenOffsetsGeneratorParams } from "./children-offsets-generator-params";
import { Tree } from "../tree";
import { TreeSpans } from "./tree-spans";
import { AggregatedSubtreeGenerator } from "./aggregated-subtree-generator";

export class ChildrenOffsetsGenerator {
  private readonly offsets = new Map<Identifier, number>();

  private readonly treeSpans = new Map<Identifier, TreeSpans>();

  public constructor(
    private readonly tree: Tree,
    params: ChildrenOffsetsGeneratorParams,
  ) {
    const radius = params.spaceAroundRadius;

    const generator = new AggregatedSubtreeGenerator({
      spaceAroundRadius: radius,
    });

    [...this.tree.sequence].reverse().forEach((treeNode) => {
      if (treeNode.children.size === 0) {
        this.offsets.set(treeNode.nodeId, 0);
        this.treeSpans.set(treeNode.nodeId, [{ start: -radius, end: radius }]);
      } else {
        const subtreeLayers = Array.from(treeNode.children).map(
          (childNode) => this.treeSpans.get(childNode.nodeId)!,
        );

        const aggregatedTree = generator.generate(subtreeLayers);

        let index = 0;

        treeNode.children.forEach((childNode) => {
          this.offsets.set(
            childNode.nodeId,
            aggregatedTree.childOffsets[index],
          );
          index++;
        });

        this.treeSpans.set(treeNode.nodeId, [
          { start: -radius, end: radius },
          ...aggregatedTree.subtreeSpans,
        ]);
      }

      treeNode.children.forEach((childNode) => {
        this.treeSpans.delete(childNode.nodeId);
      });
    });

    this.offsets.set(this.tree.root.nodeId, 0);
  }

  public generate(): ReadonlyMap<Identifier, number> {
    return this.offsets;
  }
}
