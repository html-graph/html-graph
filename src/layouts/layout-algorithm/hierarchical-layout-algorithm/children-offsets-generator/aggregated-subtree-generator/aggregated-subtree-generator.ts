import { MutableSpan } from "../mutable-span";
import { TreeSpans } from "../tree-spans";
import { AggregatedSubtreeGeneratorParams } from "./aggregated-subtree-generator-params";
import { AggregatedSubtreeResult } from "./aggregated-subtree-result";

export class AggregatedSubtreeGenerator {
  public constructor(
    private readonly params: AggregatedSubtreeGeneratorParams,
  ) {}

  public generate(
    absoluteSubtreeLayers: readonly TreeSpans[],
  ): AggregatedSubtreeResult {
    let current = 0;
    const result: number[] = [];

    const last = absoluteSubtreeLayers.length - 1;

    const absoluteSpans: MutableSpan[] = [];

    absoluteSubtreeLayers.forEach((subtree, index) => {
      current += this.params.spaceAroundRadius;

      subtree.forEach((span, i) => {
        if (absoluteSpans[i] === undefined) {
          absoluteSpans[i] = {
            start: current + span.start,
            end: current + span.end,
          };
        } else {
          absoluteSpans[i].end = current + span.end;
        }
      });

      result.push(current);
      current += this.params.spaceAroundRadius;

      if (index !== last) {
        const nextSubtree = absoluteSubtreeLayers[index + 1];

        current += this.calculateMaxDiff(subtree, nextSubtree);
      }
    });

    const half = current / 2;

    return {
      childOffsets: result.map((offset) => offset - half),
      subtreeSpans: absoluteSpans.map((span) => ({
        start: span.start - half,
        end: span.end - half,
      })),
    };
  }

  private calculateMaxDiff(
    leftLayers: TreeSpans,
    rightLayers: TreeSpans,
  ): number {
    let maxDiff = 0;

    const layersCnt = Math.min(leftLayers.length, rightLayers.length);

    for (let i = 0; i < layersCnt; i++) {
      const diff = rightLayers[i].end - leftLayers[i].start;

      maxDiff = Math.max(maxDiff, diff);
    }

    return maxDiff - 2 * this.params.spaceAroundRadius;
  }
}
