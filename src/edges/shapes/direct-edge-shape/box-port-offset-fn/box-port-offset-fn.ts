import { PortOffsetFn, PortOffsetFnParams } from "../resolve-port-offset-fn";

export const boxPortOffsetFn: PortOffsetFn = (
  params: PortOffsetFnParams,
): number => {
  const { direction, radius } = params;
  const { x, y } = direction;
  const { horizontal: horizonal, vertical } = radius;
  const tg = y / x;

  const horX = Math.abs(vertical / tg);
  const vertY = Math.abs(horizonal * tg);

  const minX = Math.min(horizonal, horX);
  const minY = Math.min(vertical, vertY);

  return Math.sqrt(minX * minX + minY * minY);
};
