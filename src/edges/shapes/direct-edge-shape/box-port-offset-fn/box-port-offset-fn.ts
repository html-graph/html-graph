import { Point } from "@/point";
import { PortOffsetFn } from "../resolve-port-offset-fn";
import { Dimensions } from "@/dimensions";

export const boxPortOffsetFn: PortOffsetFn = (
  direction: Point,
  dimensions: Dimensions,
): number => {
  const { x, y } = direction;
  const { width, height } = dimensions;
  const tg = y / x;

  const horX = Math.abs(height / tg);
  const vertY = Math.abs(width * tg);

  const minX = Math.min(width, horX);
  const minY = Math.min(height, vertY);

  return Math.sqrt(minX * minX + minY * minY);
};
