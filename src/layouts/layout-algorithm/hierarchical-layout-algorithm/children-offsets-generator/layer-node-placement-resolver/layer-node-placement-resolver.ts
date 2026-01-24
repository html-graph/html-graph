import { LayerNodePlacementResolverParams } from "./layer-node-placement-resolver-params";

export class LayerNodePlacementResolver {
  private readonly baseRadius: number;

  public constructor(params: LayerNodePlacementResolverParams) {
    this.baseRadius = params.radius;
  }

  public resolve(childRadii: readonly (number | null)[]): readonly number[] {
    let totalRadii = 0;

    childRadii.forEach((radius) => {
      if (radius !== null) {
        totalRadii += radius;
      } else {
        totalRadii += this.baseRadius;
      }
    });

    let current = -totalRadii;

    const result: number[] = [];

    childRadii.forEach((radius) => {
      if (radius !== null) {
        current += radius;
      } else {
        current += this.baseRadius;
      }

      result.push(current);

      if (radius !== null) {
        current += radius;
      } else {
        current += this.baseRadius;
      }
    });

    return result;
  }
}
