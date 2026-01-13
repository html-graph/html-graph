import { createElement, triggerResizeFor } from "@/mocks";
import { TransformState } from "./transform-state";
import { ViewportStore } from "./viewport-store";

describe("ViewportStore", () => {
  it("should return initial viewport matrix", () => {
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);

    const viewportMatrix: TransformState = viewportStore.getViewportMatrix();

    const expected: TransformState = {
      scale: 1,
      x: 0,
      y: 0,
    };

    expect(viewportMatrix).toEqual(expected);
  });

  it("should return initial content matrix", () => {
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);

    const contentMatrix: TransformState = viewportStore.getContentMatrix();

    const expected: TransformState = {
      scale: 1,
      x: 0,
      y: 0,
    };

    expect(contentMatrix).toEqual(expected);
  });

  it("should patch viewport matrix scale", () => {
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);

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
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);

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
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);

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
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);

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
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);

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
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);

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
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);

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
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);

    viewportStore.patchContentMatrix({ scale: 2, x: 2, y: 2 });

    const contentMatrix: TransformState = viewportStore.getViewportMatrix();

    const expected: TransformState = {
      scale: 1 / 2,
      x: -1,
      y: -1,
    };

    expect(contentMatrix).toEqual(expected);
  });

  it("should call callback before patching content matrix", () => {
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);
    const onBeforeUpdate = jest.fn();
    viewportStore.onBeforeUpdated.subscribe(onBeforeUpdate);

    viewportStore.patchContentMatrix({ scale: 2, x: 2, y: 2 });

    expect(onBeforeUpdate).toHaveBeenCalled();
  });

  it("should call callback after patching content matrix", () => {
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);
    const onAfterUpdate = jest.fn();
    viewportStore.onAfterUpdated.subscribe(onAfterUpdate);

    viewportStore.patchContentMatrix({ scale: 2, x: 2, y: 2 });

    expect(onAfterUpdate).toHaveBeenCalled();
  });

  it("should call callback before patching viewport matrix", () => {
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);
    const onBeforeUpdate = jest.fn();
    viewportStore.onBeforeUpdated.subscribe(onBeforeUpdate);

    viewportStore.patchViewportMatrix({ scale: 2, x: 2, y: 2 });

    expect(onBeforeUpdate).toHaveBeenCalled();
  });

  it("should call callback after patching viewport matrix", () => {
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);
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

  it("should emit after resize event", () => {
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });

    const viewportStore = new ViewportStore(host);

    host.getBoundingClientRect = (): DOMRect => {
      return new DOMRect(0, 0, 1100, 800);
    };

    const callback = jest.fn();

    viewportStore.onAfterResize.subscribe(callback);

    triggerResizeFor(host);

    expect(callback).toHaveBeenCalled();
  });

  it("should not emit after resize event after destroy", () => {
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });

    const viewportStore = new ViewportStore(host);

    host.getBoundingClientRect = (): DOMRect => {
      return new DOMRect(0, 0, 1100, 800);
    };

    const callback = jest.fn();

    viewportStore.onAfterResize.subscribe(callback);
    viewportStore.destroy();

    triggerResizeFor(host);

    expect(callback).not.toHaveBeenCalled();
  });
});
