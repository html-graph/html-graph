import { LayerNodePlacementResolverParams } from "./layer-node-placement-resolver-params";
import { LayerNodePlacementResult } from "./layer-node-placement-result";

export class LayerNodePlacementResolver {
  private readonly baseRadius: number;

  public constructor(params: LayerNodePlacementResolverParams) {
    this.baseRadius = params.radius;
  }

  public resolve(
    childRadii: readonly (number | null)[],
  ): LayerNodePlacementResult {
    let parentFillGauge = 0;
    let childFillGauge = -Infinity;
    const parentOffsets: number[] = [];

    childRadii.forEach((radius) => {
      if (radius === null) {
        parentFillGauge += this.baseRadius;
        parentOffsets.push(parentFillGauge);
        parentFillGauge += this.baseRadius;
      } else {
        const lowerBound = parentFillGauge + this.baseRadius - radius;

        if (lowerBound < childFillGauge) {
          childFillGauge += radius;
          parentOffsets.push(childFillGauge);
          parentFillGauge = childFillGauge + this.baseRadius;

          childFillGauge += radius;
        } else {
          parentFillGauge += this.baseRadius;
          parentOffsets.push(parentFillGauge);
          childFillGauge = parentFillGauge + radius;
          parentFillGauge += this.baseRadius;
        }
      }
    });

    const parentRadius = parentFillGauge / 2;

    let childOverflow = 0;

    if (childRadii.length > 0) {
      const lastChildRadius = childRadii[childRadii.length - 1] ?? 0;
      const lastOffset = parentOffsets[parentOffsets.length - 1];

      childOverflow = Math.max(
        childOverflow,
        lastOffset + lastChildRadius - parentFillGauge,
      );

      const firstChildRadius = childRadii[0] ?? 0;
      const firstOffset = parentOffsets[0];

      childOverflow = Math.max(childOverflow, firstChildRadius - firstOffset);
    }

    return {
      offsets: parentOffsets.map((offset) => offset - parentRadius),
      radius: parentRadius + childOverflow,
    };
  }
}
