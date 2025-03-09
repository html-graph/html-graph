import { TransformState } from "../transform-state";
import { ViewportTransformer } from "./viewport-transformer";

const onAfterUpdate = jest.fn();

describe("ViewportTransformer", () => {
  it("should return initial viewport matrix", () => {
    const transformer = new ViewportTransformer(onAfterUpdate);

    const viewportMatrix: TransformState = transformer.getViewportMatrix();

    const expected: TransformState = {
      scale: 1,
      x: 0,
      y: 0,
    };

    expect(viewportMatrix).toEqual(expected);
  });

  it("should return initial content matrix", () => {
    const transformer = new ViewportTransformer(onAfterUpdate);

    const contentMatrix: TransformState = transformer.getContentMatrix();

    const expected: TransformState = {
      scale: 1,
      x: 0,
      y: 0,
    };

    expect(contentMatrix).toEqual(expected);
  });

  it("should patch viewport matrix scale", () => {
    const transformer = new ViewportTransformer(onAfterUpdate);

    transformer.patchViewportMatrix({ scale: 2 });

    const viewportMatrix: TransformState = transformer.getViewportMatrix();

    const expected: TransformState = {
      scale: 2,
      x: 0,
      y: 0,
    };

    expect(viewportMatrix).toEqual(expected);
  });

  it("should patch viewport matrix dx", () => {
    const transformer = new ViewportTransformer(onAfterUpdate);

    transformer.patchViewportMatrix({ x: 1 });

    const viewportMatrix: TransformState = transformer.getViewportMatrix();

    const expected: TransformState = {
      scale: 1,
      x: 1,
      y: 0,
    };

    expect(viewportMatrix).toEqual(expected);
  });

  it("should patch viewport matrix dy", () => {
    const transformer = new ViewportTransformer(onAfterUpdate);

    transformer.patchViewportMatrix({ y: 1 });

    const viewportMatrix: TransformState = transformer.getViewportMatrix();

    const expected: TransformState = {
      scale: 1,
      x: 0,
      y: 1,
    };

    expect(viewportMatrix).toEqual(expected);
  });

  it("should patch content matrix scale", () => {
    const transformer = new ViewportTransformer(onAfterUpdate);

    transformer.patchContentMatrix({ scale: 2 });

    const contentMatrix: TransformState = transformer.getContentMatrix();

    const expected: TransformState = {
      scale: 2,
      x: 0,
      y: 0,
    };

    expect(contentMatrix).toEqual(expected);
  });

  it("should patch content matrix dx", () => {
    const transformer = new ViewportTransformer(onAfterUpdate);

    transformer.patchContentMatrix({ x: 1 });

    const contentMatrix: TransformState = transformer.getContentMatrix();

    const expected: TransformState = {
      scale: 1,
      x: 1,
      y: 0,
    };

    expect(contentMatrix).toEqual(expected);
  });

  it("should patch content matrix dy", () => {
    const transformer = new ViewportTransformer(onAfterUpdate);

    transformer.patchContentMatrix({ y: 1 });

    const contentMatrix: TransformState = transformer.getContentMatrix();

    const expected: TransformState = {
      scale: 1,
      x: 0,
      y: 1,
    };

    expect(contentMatrix).toEqual(expected);
  });

  it("should calculate content matrix when patching viewport matrix", () => {
    const transformer = new ViewportTransformer(onAfterUpdate);

    transformer.patchViewportMatrix({ scale: 2, x: 2, y: 2 });

    const contentMatrix: TransformState = transformer.getContentMatrix();

    const expected: TransformState = {
      scale: 1 / 2,
      x: -1,
      y: -1,
    };

    expect(contentMatrix).toEqual(expected);
  });

  it("should calculate viewport matrix when patching content matrix", () => {
    const transformer = new ViewportTransformer(onAfterUpdate);

    transformer.patchContentMatrix({ scale: 2, x: 2, y: 2 });

    const contentMatrix: TransformState = transformer.getViewportMatrix();

    const expected: TransformState = {
      scale: 1 / 2,
      x: -1,
      y: -1,
    };

    expect(contentMatrix).toEqual(expected);
  });

  it("should call callback after patching content matrix", () => {
    const transformer = new ViewportTransformer(onAfterUpdate);

    transformer.patchContentMatrix({ scale: 2, x: 2, y: 2 });

    expect(onAfterUpdate).toHaveBeenCalled();
  });

  it("should call callback after patching viewport matrix", () => {
    const transformer = new ViewportTransformer(onAfterUpdate);

    transformer.patchViewportMatrix({ scale: 2, x: 2, y: 2 });

    expect(onAfterUpdate).toHaveBeenCalled();
  });
});
