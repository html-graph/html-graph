import { Matrix } from "../../matrix";

export const calculateReverseMartix = (matrix: Matrix): Matrix => {
  const { a, b, c, d, e, f } = matrix;
  const delta = a * e - b * d;

  return {
    a: e / delta,
    b: -b / delta,
    c: (b * f - c * e) / delta,
    d: -d / delta,
    e: a / delta,
    f: (c * d - a * f) / delta,
  };
};
