import {
  BarnesHutApproximationNodeForcesApplicationStrategy,
  DirectSumNodeForcesApplicationStrategy,
  NodeForcesApplicationStrategy,
} from "../node-forces-application-strategy";
import { ResolveNodeForcesApplicationStrategyParams } from "./resolve-node-forces-application-strategy-params";

export const resolveNodeForcesApplicationStrategy = (
  params: ResolveNodeForcesApplicationStrategyParams,
): NodeForcesApplicationStrategy => {
  if (params.theta !== 0) {
    return new BarnesHutApproximationNodeForcesApplicationStrategy({
      nodeCharge: params.nodeCharge,
      nodeForceCoefficient: params.nodeForceCoefficient,
      distance: params.distance,
      maxForce: params.maxForce,
      theta: params.theta,
      nodeMass: params.nodeMass,
      minAreaSize: params.minAreaSize,
    });
  }

  return new DirectSumNodeForcesApplicationStrategy({
    nodeCharge: params.nodeCharge,
    nodeForceCoefficient: params.nodeForceCoefficient,
    distance: params.distance,
    effectiveDistance: params.effectiveDistance,
    maxForce: params.maxForce,
  });
};
