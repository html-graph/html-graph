import { DistanceVectorGenerator } from "../distance-vector-generator";
import {
  BarnesHutApproximationNodeForcesApplicationStrategy,
  DirectSumNodeForcesApplicationStrategy,
} from "../node-forces-application-strategy";
import { resolveNodeForcesApplicationStrategy } from "./resolve-node-forces-application-strategy";

describe("resolveNodeForcesApplicationStrategy", () => {
  it("should return direct sum strategy when theta is 0", () => {
    const strategy = resolveNodeForcesApplicationStrategy({
      theta: 0,
      nodeCharge: 100,
      nodeForceCoefficient: 1,
      distanceVectorGenerator: new DistanceVectorGenerator(() => 0),
      effectiveDistance: 1000,
      maxForce: 1e9,
      nodeMass: 1,
      areaRadiusThreshold: 1e-2,
    });

    expect(strategy instanceof DirectSumNodeForcesApplicationStrategy).toBe(
      true,
    );
  });

  it("should return barnes-hut strategy when theta is not 0", () => {
    const strategy = resolveNodeForcesApplicationStrategy({
      theta: 1,
      nodeCharge: 100,
      nodeForceCoefficient: 1,
      distanceVectorGenerator: new DistanceVectorGenerator(() => 0),
      effectiveDistance: 1000,
      maxForce: 1e9,
      nodeMass: 1,
      areaRadiusThreshold: 1e-2,
    });

    expect(
      strategy instanceof BarnesHutApproximationNodeForcesApplicationStrategy,
    ).toBe(true);
  });
});
