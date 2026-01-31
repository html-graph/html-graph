import { Identifier } from "@/identifier";
import { MutablePoint } from "@/point";
import { CoordsTransformationMatrix } from "./transformation-matrix";

export const applyCoordsTransform = (
  coords: ReadonlyMap<Identifier, MutablePoint>,
  transform: CoordsTransformationMatrix,
): void => {
  const { a, b, c, d, e, f } = transform;

  coords.forEach((coord) => {
    const { x, y } = coord;
    const newX = a * x + b * y + c;
    const newY = d * x + e * y + f;

    coord.x = newX;
    coord.y = newY;
  });
};
