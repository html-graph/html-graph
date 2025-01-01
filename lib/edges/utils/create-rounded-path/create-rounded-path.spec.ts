import { Point } from "../../point";
import { createRoundedPath } from "./create-rounded-path";

describe("createRoundedPath", () => {
  it("should return empty string for path win no dots", () => {
    const res = createRoundedPath([], 0);

    expect(res).toEqual("");
  });

  it("should return dot for path with no lines", () => {
    const res = createRoundedPath([[0, 0]], 0);

    expect(res).toEqual("M 0 0");
  });

  it("should return line for path with no angles", () => {
    const path: Point[] = [
      [0, 0],
      [0, 15],
    ];

    const res = createRoundedPath(path, 0);

    expect(res).toEqual("M 0 0 L 0 15");
  });

  it("should return rounded line for three items array", () => {
    const path: Point[] = [
      [0, 0],
      [30, 0],
      [30, 30],
    ];

    const res = createRoundedPath(path, 10);

    expect(res).toEqual("M 0 0 L 20 0 C 30 0 30 0 30 10 L 30 30");
  });

  it("should limit roundness to available joint distance", () => {
    const path: Point[] = [
      [0, 0],
      [30, 0],
      [30, 30],
    ];

    const res = createRoundedPath(path, 100);

    expect(res).toEqual("M 0 0 L 0 0 C 30 0 30 0 30 30 L 30 30");
  });

  it("should erase gap limit near the start when roundness overflows", () => {
    const path: Point[] = [
      [0, 0],
      [30, 0],
      [30, 30],
    ];

    const res = createRoundedPath(path, 100);

    expect(res).toEqual("M 0 0 L 0 0 C 30 0 30 0 30 30 L 30 30");
  });
});
