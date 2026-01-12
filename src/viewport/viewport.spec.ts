import { ViewportStore, TransformState } from "@/viewport-store";
import { Viewport } from "./viewport";
import { createElement } from "@/mocks";

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

  it("should call callback after viewport update", () => {
    const host = createElement({ x: 0, y: 0, width: 1000, height: 700 });
    const viewportStore = new ViewportStore(host);
    const viewport = new Viewport(viewportStore);

    const onAfterUpdate = jest.fn();

    viewport.onAfterUpdated.subscribe(onAfterUpdate);

    viewportStore.patchViewportMatrix({});

    expect(onAfterUpdate).toHaveBeenCalled();
  });
});
