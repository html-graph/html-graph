import { TransformState } from "../transform-state";
import { ViewportTransformerMock } from "../viewport-transformer";
import { PublicViewportTransformer } from "./public-viewport-transformer";

describe("PublicViewportTransformer", () => {
  it("should return initial viewport matrix", () => {
    const transformer = new ViewportTransformerMock();
    jest
      .spyOn(transformer, "getViewportMatrix")
      .mockReturnValue({ scale: 2, dx: 1, dy: 1 });

    const publicTransformer = new PublicViewportTransformer(transformer);

    const viewportMatrix = publicTransformer.getViewportMatrix();

    expect(viewportMatrix).toEqual({ scale: 2, dx: 1, dy: 1 });
  });

  it("should return initial content matrix", () => {
    const transformer = new ViewportTransformerMock();
    jest
      .spyOn(transformer, "getContentMatrix")
      .mockReturnValue({ scale: 2, dx: 1, dy: 1 });

    const publicTransformer = new PublicViewportTransformer(transformer);

    const viewportMatrix = publicTransformer.getContentMatrix();

    expect(viewportMatrix).toEqual({ scale: 2, dx: 1, dy: 1 });
  });

  it("should return viewport matrix as a new object", () => {
    const transformer = new ViewportTransformerMock();
    const matrix: TransformState = {
      scale: 2,
      dx: 1,
      dy: 1,
    };

    jest.spyOn(transformer, "getViewportMatrix").mockReturnValue(matrix);

    const publicTransformer = new PublicViewportTransformer(transformer);

    const viewportMatrix = publicTransformer.getViewportMatrix();

    expect(viewportMatrix).not.toBe(matrix);
  });

  it("should return content matrix as a new object", () => {
    const transformer = new ViewportTransformerMock();
    const matrix: TransformState = {
      scale: 2,
      dx: 1,
      dy: 1,
    };

    jest.spyOn(transformer, "getContentMatrix").mockReturnValue(matrix);

    const publicTransformer = new PublicViewportTransformer(transformer);

    const viewportMatrix = publicTransformer.getContentMatrix();

    expect(viewportMatrix).not.toBe(matrix);
  });
});
