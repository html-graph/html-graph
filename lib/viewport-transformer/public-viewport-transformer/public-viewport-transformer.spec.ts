import { TransformState } from "../transform-state";
import { ViewportTransformer } from "../viewport-transformer";
import { Viewport } from "./public-viewport-transformer";

describe("Viewport", () => {
  it("should return initial viewport matrix", () => {
    const transformer = new ViewportTransformer();
    jest
      .spyOn(transformer, "getViewportMatrix")
      .mockReturnValue({ scale: 2, x: 1, y: 1 });

    const publicTransformer = new Viewport(transformer);

    const viewportMatrix = publicTransformer.getViewportMatrix();

    const expected: TransformState = {
      scale: 2,
      x: 1,
      y: 1,
    };

    expect(viewportMatrix).toEqual(expected);
  });

  it("should return initial content matrix", () => {
    const transformer = new ViewportTransformer();
    jest
      .spyOn(transformer, "getContentMatrix")
      .mockReturnValue({ scale: 2, x: 1, y: 1 });

    const publicTransformer = new Viewport(transformer);

    const viewportMatrix = publicTransformer.getContentMatrix();

    const expected: TransformState = {
      scale: 2,
      x: 1,
      y: 1,
    };

    expect(viewportMatrix).toEqual(expected);
  });

  it("should return viewport matrix as a new object", () => {
    const transformer = new ViewportTransformer();
    const matrix: TransformState = {
      scale: 2,
      x: 1,
      y: 1,
    };

    jest.spyOn(transformer, "getViewportMatrix").mockReturnValue(matrix);

    const publicTransformer = new Viewport(transformer);

    const viewportMatrix = publicTransformer.getViewportMatrix();

    expect(viewportMatrix).not.toBe(matrix);
  });

  it("should return content matrix as a new object", () => {
    const transformer = new ViewportTransformer();
    const matrix: TransformState = {
      scale: 2,
      x: 1,
      y: 1,
    };

    jest.spyOn(transformer, "getContentMatrix").mockReturnValue(matrix);

    const publicTransformer = new Viewport(transformer);

    const viewportMatrix = publicTransformer.getContentMatrix();

    expect(viewportMatrix).not.toBe(matrix);
  });
});
