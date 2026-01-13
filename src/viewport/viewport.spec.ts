import { ViewportStore, TransformState } from "@/viewport-store";
import { Viewport } from "./viewport";
import { createElement, triggerResizeFor } from "@/mocks";
import { Point } from "@/point";

describe("Viewport", () => {
  it("should return initial viewport matrix", () => {
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);
    const viewport = new Viewport(viewportStore);

    jest
      .spyOn(viewportStore, "getViewportMatrix")
      .mockReturnValue({ scale: 2, x: 1, y: 1 });

    const viewportMatrix = viewport.getViewportMatrix();

    const expected: TransformState = {
      scale: 2,
      x: 1,
      y: 1,
    };

    expect(viewportMatrix).toEqual(expected);
  });

  it("should return initial content matrix", () => {
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);
    const viewport = new Viewport(viewportStore);

    jest
      .spyOn(viewportStore, "getContentMatrix")
      .mockReturnValue({ scale: 2, x: 1, y: 1 });

    const viewportMatrix = viewport.getContentMatrix();

    const expected: TransformState = {
      scale: 2,
      x: 1,
      y: 1,
    };

    expect(viewportMatrix).toEqual(expected);
  });

  it("should return viewport matrix as a new object", () => {
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);
    const viewport = new Viewport(viewportStore);

    const matrix: TransformState = {
      scale: 2,
      x: 1,
      y: 1,
    };

    jest.spyOn(viewportStore, "getViewportMatrix").mockReturnValue(matrix);

    const viewportMatrix = viewport.getViewportMatrix();

    expect(viewportMatrix).not.toBe(matrix);
  });

  it("should return content matrix as a new object", () => {
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);
    const viewport = new Viewport(viewportStore);

    const matrix: TransformState = {
      scale: 2,
      x: 1,
      y: 1,
    };

    jest.spyOn(viewportStore, "getContentMatrix").mockReturnValue(matrix);

    const viewportMatrix = viewport.getContentMatrix();

    expect(viewportMatrix).not.toBe(matrix);
  });

  it("should call callback before viewport update", () => {
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);
    const viewport = new Viewport(viewportStore);

    const onBeforeUpdate = jest.fn();

    viewport.onBeforeUpdated.subscribe(onBeforeUpdate);

    viewportStore.patchViewportMatrix({});

    expect(onBeforeUpdate).toHaveBeenCalled();
  });

  it("should call callback after viewport update", () => {
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);
    const viewport = new Viewport(viewportStore);

    const onAfterUpdate = jest.fn();

    viewport.onAfterUpdated.subscribe(onAfterUpdate);

    viewportStore.patchViewportMatrix({});

    expect(onAfterUpdate).toHaveBeenCalled();
  });

  it("should return viewport dimensions", () => {
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);
    const viewport = new Viewport(viewportStore);

    expect(viewport.getDimensions()).toEqual({ width: 1000, height: 700 });
  });

  it("should emit resize event", () => {
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });

    const viewportStore = new ViewportStore(host);
    const viewport = new Viewport(viewportStore);

    host.getBoundingClientRect = (): DOMRect => {
      return new DOMRect(0, 0, 1100, 800);
    };

    const callback = jest.fn();

    viewport.onAfterResize.subscribe(callback);

    triggerResizeFor(host);

    expect(callback).toHaveBeenCalled();
  });

  it("should create content coordinates based on viewport coordinates", () => {
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);
    const viewport = new Viewport(viewportStore);

    viewportStore.patchViewportMatrix({ scale: 2, x: 1, y: 1 });

    const contentCoordinates = viewport.createContentCoords({
      x: 2,
      y: 2,
    });

    const expected: Point = {
      x: 5,
      y: 5,
    };

    expect(contentCoordinates).toEqual(expected);
  });

  it("should create viewport coordinates based on content coordinates", () => {
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);
    const viewport = new Viewport(viewportStore);

    viewportStore.patchContentMatrix({ scale: 2, x: 1, y: 1 });

    const viewportCoordinates = viewport.createViewportCoords({
      x: 2,
      y: 2,
    });

    const expected: Point = {
      x: 5,
      y: 5,
    };

    expect(viewportCoordinates).toEqual(expected);
  });
});
