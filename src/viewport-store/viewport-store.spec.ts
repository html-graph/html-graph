import { createElement } from "@/mocks";
import { TransformState } from "./transform-state";
import { ViewportStore } from "./viewport-store";

describe("ViewportStore", () => {
  it("should return initial viewport matrix", () => {
    const viewportStore = new ViewportStore();

    const viewportMatrix: TransformState = viewportStore.getViewportMatrix();

    const expected: TransformState = {
      scale: 1,
      x: 0,
      y: 0,
    };

    expect(viewportMatrix).toEqual(expected);
  });

  it("should return initial content matrix", () => {
    const viewportStore = new ViewportStore();

    const contentMatrix: TransformState = viewportStore.getContentMatrix();

    const expected: TransformState = {
      scale: 1,
      x: 0,
      y: 0,
    };

    expect(contentMatrix).toEqual(expected);
  });

  it("should patch viewport matrix scale", () => {
    const viewportStore = new ViewportStore();

    viewportStore.patchViewportMatrix({ scale: 2 });

    const viewportMatrix: TransformState = viewportStore.getViewportMatrix();

    const expected: TransformState = {
      scale: 2,
      x: 0,
      y: 0,
    };

    expect(viewportMatrix).toEqual(expected);
  });

  it("should patch viewport matrix dx", () => {
    const viewportStore = new ViewportStore();

    viewportStore.patchViewportMatrix({ x: 1 });

    const viewportMatrix: TransformState = viewportStore.getViewportMatrix();

    const expected: TransformState = {
      scale: 1,
      x: 1,
      y: 0,
    };

    expect(viewportMatrix).toEqual(expected);
  });

  it("should patch viewport matrix dy", () => {
    const viewportStore = new ViewportStore();

    viewportStore.patchViewportMatrix({ y: 1 });

    const viewportMatrix: TransformState = viewportStore.getViewportMatrix();

    const expected: TransformState = {
      scale: 1,
      x: 0,
      y: 1,
    };

    expect(viewportMatrix).toEqual(expected);
  });

  it("should patch content matrix scale", () => {
    const viewportStore = new ViewportStore();

    viewportStore.patchContentMatrix({ scale: 2 });

    const contentMatrix: TransformState = viewportStore.getContentMatrix();

    const expected: TransformState = {
      scale: 2,
      x: 0,
      y: 0,
    };

    expect(contentMatrix).toEqual(expected);
  });

  it("should patch content matrix dx", () => {
    const viewportStore = new ViewportStore();

    viewportStore.patchContentMatrix({ x: 1 });

    const contentMatrix: TransformState = viewportStore.getContentMatrix();

    const expected: TransformState = {
      scale: 1,
      x: 1,
      y: 0,
    };

    expect(contentMatrix).toEqual(expected);
  });

  it("should patch content matrix dy", () => {
    const viewportStore = new ViewportStore();

    viewportStore.patchContentMatrix({ y: 1 });

    const contentMatrix: TransformState = viewportStore.getContentMatrix();

    const expected: TransformState = {
      scale: 1,
      x: 0,
      y: 1,
    };

    expect(contentMatrix).toEqual(expected);
  });

  it("should calculate content matrix when patching viewport matrix", () => {
    const viewportStore = new ViewportStore();

    viewportStore.patchViewportMatrix({ scale: 2, x: 2, y: 2 });

    const contentMatrix: TransformState = viewportStore.getContentMatrix();

    const expected: TransformState = {
      scale: 1 / 2,
      x: -1,
      y: -1,
    };

    expect(contentMatrix).toEqual(expected);
  });

  it("should calculate viewport matrix when patching content matrix", () => {
    const viewportStore = new ViewportStore();

    viewportStore.patchContentMatrix({ scale: 2, x: 2, y: 2 });

    const contentMatrix: TransformState = viewportStore.getViewportMatrix();

    const expected: TransformState = {
      scale: 1 / 2,
      x: -1,
      y: -1,
    };

    expect(contentMatrix).toEqual(expected);
  });

  it("should call callback after patching content matrix", () => {
    const viewportStore = new ViewportStore();
    const onAfterUpdate = jest.fn();
    viewportStore.onAfterUpdated.subscribe(onAfterUpdate);

    viewportStore.patchContentMatrix({ scale: 2, x: 2, y: 2 });

    expect(onAfterUpdate).toHaveBeenCalled();
  });

  it("should call callback after patching viewport matrix", () => {
    const viewportStore = new ViewportStore();
    const onAfterUpdate = jest.fn();
    viewportStore.onAfterUpdated.subscribe(onAfterUpdate);

    viewportStore.patchViewportMatrix({ scale: 2, x: 2, y: 2 });

    expect(onAfterUpdate).toHaveBeenCalled();
  });

  it("should return viewport dimensions", () => {
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);
    const dimensions = viewportStore.getDimensions();

    expect(dimensions).toEqual({ width: 1000, height: 700 });
  });
});
