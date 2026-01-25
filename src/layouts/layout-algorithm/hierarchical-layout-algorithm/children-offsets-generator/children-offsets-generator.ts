import { Identifier } from "@/identifier";
import { Tree } from "../tree";
import { ChildrenOffsetsGeneratorParams } from "./children-offsets-generator-params";

export class ChildrenOffsetsGenerator {
  private readonly offsets = new Map<Identifier, number>();

  private readonly spaceAroundRadius: number;

  public constructor(
    private readonly tree: Tree,
    params: ChildrenOffsetsGeneratorParams,
  ) {
    this.spaceAroundRadius = params.spaceAroundRadius;
    console.log(this.spaceAroundRadius);
    this.offsets.set(this.tree.root.nodeId, 0);

    this.tree.sequence.forEach((treeNode) => {
      this.offsets.set(treeNode.nodeId, 0);
    });
  }

  public generate(): ReadonlyMap<Identifier, number> {
    return this.offsets;
  }
}
