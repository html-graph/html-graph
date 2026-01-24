import { Identifier } from "@/identifier";
import { Tree } from "../tree";
import { ChildrenSpansGeneratorParams } from "./children-spans-generator-params";
import { ChildrenSpan } from "./children-span";

export class ChildrenSpansGenerator {
  private readonly childrenSpans = new Map<Identifier, ChildrenSpan>();

  public constructor(
    private readonly tree: Tree,
    private readonly params: ChildrenSpansGeneratorParams,
  ) {
    console.log(this.params);

    const reverseSequence = [...this.tree.sequence].reverse();

    reverseSequence.forEach((treeNode) => {
      let start = 0;
      let end = 0;

      if (treeNode.children.size === 2) {
        const diameter =
          (treeNode.children.size - 1) * this.params.layerSparsity;
        const radius = diameter / 2;

        start = -radius;
        end = radius;
      }

      const span: ChildrenSpan = { start, end };
      this.childrenSpans.set(treeNode.nodeId, span);
    });
  }

  public generate(): ReadonlyMap<Identifier, ChildrenSpan> {
    return this.childrenSpans;
  }
}
