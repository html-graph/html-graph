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
      if (treeNode.children.size === 0) {
        const span: ChildrenSpan = { start: 0, end: 0 };

        this.childrenSpans.set(treeNode.nodeId, span);
      } else if (treeNode.children.size === 1) {
        const span: ChildrenSpan = { start: 0, end: 0 };

        this.childrenSpans.set(treeNode.nodeId, span);
      }
    });
  }

  public generate(): ReadonlyMap<Identifier, ChildrenSpan> {
    return this.childrenSpans;
  }
}
