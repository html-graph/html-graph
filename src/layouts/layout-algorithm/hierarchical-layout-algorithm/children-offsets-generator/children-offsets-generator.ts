import { Identifier } from "@/identifier";
import { Tree } from "../tree";
import { ChildrenOffsetsGeneratorParams } from "./children-offsets-generator-params";
import { LayerNodePlacementResolver } from "./layer-node-placement-resolver";

export class ChildrenOffsetsGenerator {
  private readonly offsets = new Map<Identifier, number>();

  private readonly childrenRadii = new Map<Identifier, number | null>();

  private readonly layerNodePlacementResolver: LayerNodePlacementResolver;

  public constructor(
    private readonly tree: Tree,
    params: ChildrenOffsetsGeneratorParams,
  ) {
    this.layerNodePlacementResolver = new LayerNodePlacementResolver({
      radius: params.spaceAroundRadius,
    });

    [...this.tree.sequence].reverse().forEach((treeNode) => {
      if (treeNode.children.size === 0) {
        this.childrenRadii.set(treeNode.nodeId, null);
      } else {
        const childRadii: (number | null)[] = Array.from(treeNode.children).map(
          (child) => this.childrenRadii.get(child.nodeId)!,
        );

        const placement = this.layerNodePlacementResolver.resolve(childRadii);

        this.childrenRadii.set(treeNode.nodeId, placement.radius);
        let i = 0;

        treeNode.children.forEach((child) => {
          this.offsets.set(child.nodeId, placement.offsets[i]);
          i++;
        });
      }
    });

    this.offsets.set(this.tree.root.nodeId, 0);
  }

  public generate(): ReadonlyMap<Identifier, number> {
    return this.offsets;
  }
}
