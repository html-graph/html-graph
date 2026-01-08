import { CalculateNodeRepulsiveForceParams } from "./calculate-node-repulsive-force-params";

export const calculateNodeRepulsiveForce = (
  params: CalculateNodeRepulsiveForceParams,
): number => {
  if (params.distance === 0) {
    return params.maxForce;
  }

  const f =
    params.coefficient *
    ((params.charge1 * params.charge2) / (params.distance * params.distance));

  return Math.min(f, params.maxForce);
};
