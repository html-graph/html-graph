import { createRotatedPoint } from "../../../shared";
import { Point } from "@/point";
import { CreateArrowPointParams } from "./create-arrow-point-params";

export const createArrowPoint = (params: CreateArrowPointParams): Point => {
  const { origin, arrowLength, direction } = params;

  return params.hasArrow
    ? createRotatedPoint(
        { x: origin.x + arrowLength, y: origin.y },
        direction,
        origin,
      )
    : origin;
};
