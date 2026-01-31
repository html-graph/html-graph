import { Matrix } from "../matrix";

export const multiplyTransformationMatrices = (
  m1: Matrix,
  m2: Matrix,
): Matrix => {
  return {
    a: m1.a * m2.a + m1.b * m2.d,
    b: m1.a * m2.b + m1.b * m2.e,
    c: m1.a * m2.c + m1.b * m2.f + m1.c,
    d: m1.d * m2.a + m1.e * m2.d,
    e: m1.d * m2.b + m1.e * m2.e,
    f: m1.d * m2.c + m1.e * m2.f + m1.f,
  };
};
