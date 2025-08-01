import { TransformState } from "./transform-state";
import { ViewportStore } from "./viewport-store";

describe("ViewportStore", () => {
  it("should return initial viewport matrix", () => {
    const transformer = new ViewportStore();

    const viewportMatrix: TransformState = transformer.getViewportMatrix();

    const expected: TransformState = {
      scale: 1,
      x: 0,
      y: 0,
    };

    expect(viewportMatrix).toEqual(expected);
  });

  it("should return initial content matrix", () => {
    const transformer = new ViewportStore();

    const contentMatrix: TransformState = transformer.getContentMatrix();

    const expected: TransformState = {
      scale: 1,
      x: 0,
      y: 0,
    };

    expect(contentMatrix).toEqual(expected);
  });

  it("should patch viewport matrix scale", () => {
    const transformer = new ViewportStore();

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
    const transformer = new ViewportStore();

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
    const transformer = new ViewportStore();

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
    const transformer = new ViewportStore();

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
    const transformer = new ViewportStore();

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
    const transformer = new ViewportStore();

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
    const transformer = new ViewportStore();

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
    const transformer = new ViewportStore();

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
    const transformer = new ViewportStore();
    const onAfterUpdate = jest.fn();
    transformer.onAfterUpdated.subscribe(onAfterUpdate);

    transformer.patchContentMatrix({ scale: 2, x: 2, y: 2 });

    expect(onAfterUpdate).toHaveBeenCalled();
  });

  it("should call callback after patching viewport matrix", () => {
    const transformer = new ViewportStore();
    const onAfterUpdate = jest.fn();
    transformer.onAfterUpdated.subscribe(onAfterUpdate);

    transformer.patchViewportMatrix({ scale: 2, x: 2, y: 2 });

    expect(onAfterUpdate).toHaveBeenCalled();
  });
});
