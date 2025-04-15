import { ViewportStore, TransformState } from "../viewport-store";
import { Viewport } from "./viewport";

describe("Viewport", () => {
  it("should return initial viewport matrix", () => {
    const viewportStore = new ViewportStore();
    jest
      .spyOn(viewportStore, "getViewportMatrix")
      .mockReturnValue({ scale: 2, x: 1, y: 1 });

    const viewport = new Viewport(viewportStore);

    const viewportMatrix = viewport.getViewportMatrix();

    const expected: TransformState = {
      scale: 2,
      x: 1,
      y: 1,
    };

    expect(viewportMatrix).toEqual(expected);
  });

  it("should return initial content matrix", () => {
    const viewportStore = new ViewportStore();
    jest
      .spyOn(viewportStore, "getContentMatrix")
      .mockReturnValue({ scale: 2, x: 1, y: 1 });

    const viewport = new Viewport(viewportStore);

    const viewportMatrix = viewport.getContentMatrix();

    const expected: TransformState = {
      scale: 2,
      x: 1,
      y: 1,
    };

    expect(viewportMatrix).toEqual(expected);
  });

  it("should return viewport matrix as a new object", () => {
    const viewportStore = new ViewportStore();
    const matrix: TransformState = {
      scale: 2,
      x: 1,
      y: 1,
    };

    jest.spyOn(viewportStore, "getViewportMatrix").mockReturnValue(matrix);

    const viewport = new Viewport(viewportStore);

    const viewportMatrix = viewport.getViewportMatrix();

    expect(viewportMatrix).not.toBe(matrix);
  });

  it("should return content matrix as a new object", () => {
    const viewportStore = new ViewportStore();
    const matrix: TransformState = {
      scale: 2,
      x: 1,
      y: 1,
    };

    jest.spyOn(viewportStore, "getContentMatrix").mockReturnValue(matrix);

    const viewport = new Viewport(viewportStore);

    const viewportMatrix = viewport.getContentMatrix();

    expect(viewportMatrix).not.toBe(matrix);
  });

  it("should call callback before viewpoprt update", () => {
    const viewportStore = new ViewportStore();

    const viewport = new Viewport(viewportStore);

    const onBeforeUpdate = jest.fn();

    viewport.onBeforeUpdate.subscribe(onBeforeUpdate);

    viewportStore.patchViewportMatrix({});

    expect(onBeforeUpdate).toHaveBeenCalled();
  });

  it("should call callback after viewpoprt update", () => {
    const viewportStore = new ViewportStore();

    const viewport = new Viewport(viewportStore);

    const onAfterUpdate = jest.fn();

    viewport.onAfterUpdate.subscribe(onAfterUpdate);

    viewportStore.patchViewportMatrix({});

    expect(onAfterUpdate).toHaveBeenCalled();
  });
});
