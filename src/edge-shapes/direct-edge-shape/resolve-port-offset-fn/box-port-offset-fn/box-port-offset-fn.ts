import { PortOffsetFn } from "../port-offset-fn";
import { PortOffsetFnParams } from "../port-offset-fn-params";

export const boxPortOffsetFn: PortOffsetFn = (
  params: PortOffsetFnParams,
): number => {
  const { direction, radius } = params;
  const { x, y } = direction;
  const { horizontal, vertical } = radius;
  const tg = y / x;

  const horX = Math.abs(vertical / tg);
  const vertY = Math.abs(horizontal * tg);

  const minX = Math.min(horizontal, horX);
  const minY = Math.min(vertical, vertY);

  return Math.sqrt(minX * minX + minY * minY);
};
