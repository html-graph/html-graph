import { PortOffsetFn, PortOffsetFnParams } from "../resolve-port-offset-fn";

export const boxPortOffsetFn: PortOffsetFn = (
  params: PortOffsetFnParams,
): number => {
  const { direction, dimensions } = params;
  const { x, y } = direction;
  const { width, height } = dimensions;
  const tg = y / x;

  const horX = Math.abs(height / tg);
  const vertY = Math.abs(width * tg);

  const minX = Math.min(width, horX);
  const minY = Math.min(height, vertY);

  return Math.sqrt(minX * minX + minY * minY);
};
