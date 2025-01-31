import { TransformState } from "../transform-state";
import { ViewportTransformer } from "./viewport-transformer";

describe("ViewportTransformer", () => {
  it("should return initial viewport matrix", () => {
    const transformer = new ViewportTransformer();

    const viewportMatrix: TransformState = transformer.getViewportMatrix();

    expect(viewportMatrix).toEqual({ scale: 1, dx: 0, dy: 0 });
  });

  it("should return initial content matrix", () => {
    const transformer = new ViewportTransformer();

    const contentMatrix: TransformState = transformer.getContentMatrix();

    expect(contentMatrix).toEqual({ scale: 1, dx: 0, dy: 0 });
  });

  it("should patch viewport matrix scale", () => {
    const transformer = new ViewportTransformer();

    transformer.patchViewportMatrix({ scale: 2 });

    const viewportMatrix: TransformState = transformer.getViewportMatrix();

    expect(viewportMatrix).toEqual({ scale: 2, dx: 0, dy: 0 });
  });

  it("should patch viewport matrix dx", () => {
    const transformer = new ViewportTransformer();

    transformer.patchViewportMatrix({ dx: 1 });

    const viewportMatrix: TransformState = transformer.getViewportMatrix();

    expect(viewportMatrix).toEqual({ scale: 1, dx: 1, dy: 0 });
  });

  it("should patch viewport matrix dy", () => {
    const transformer = new ViewportTransformer();

    transformer.patchViewportMatrix({ dy: 1 });

    const viewportMatrix: TransformState = transformer.getViewportMatrix();

    expect(viewportMatrix).toEqual({ scale: 1, dx: 0, dy: 1 });
  });

  it("should patch content matrix scale", () => {
    const transformer = new ViewportTransformer();

    transformer.patchContentMatrix({ scale: 2 });

    const contentMatrix: TransformState = transformer.getContentMatrix();

    expect(contentMatrix).toEqual({ scale: 2, dx: 0, dy: 0 });
  });

  it("should patch content matrix dx", () => {
    const transformer = new ViewportTransformer();

    transformer.patchContentMatrix({ dx: 1 });

    const contentMatrix: TransformState = transformer.getContentMatrix();

    expect(contentMatrix).toEqual({ scale: 1, dx: 1, dy: 0 });
  });

  it("should patch content matrix dy", () => {
    const transformer = new ViewportTransformer();

    transformer.patchContentMatrix({ dy: 1 });

    const contentMatrix: TransformState = transformer.getContentMatrix();

    expect(contentMatrix).toEqual({ scale: 1, dx: 0, dy: 1 });
  });

  it("should calculate content matrix when patching viewport matrix", () => {
    const transformer = new ViewportTransformer();

    transformer.patchViewportMatrix({ scale: 2, dx: 2, dy: 2 });

    const contentMatrix: TransformState = transformer.getContentMatrix();

    expect(contentMatrix).toEqual({ scale: 1 / 2, dx: -1, dy: -1 });
  });

  it("should calculate viewport matrix when patching content matrix", () => {
    const transformer = new ViewportTransformer();

    transformer.patchContentMatrix({ scale: 2, dx: 2, dy: 2 });

    const contentMatrix: TransformState = transformer.getViewportMatrix();

    expect(contentMatrix).toEqual({ scale: 1 / 2, dx: -1, dy: -1 });
  });
});
