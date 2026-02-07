import { createCanvas, createElement } from "@/mocks";
import { ViewportNavigator } from "./viewport-navigator";

describe("ViewportNavigator", () => {
  it("should keep content matrix as is when no nodes", () => {
    const element = createElement({ width: 200, height: 200 });
    const canvas = createCanvas(element);

    canvas.patchContentMatrix({ scale: 2, x: 3, y: 4 });

    const navigator = new ViewportNavigator(canvas.viewport, canvas.graph);

    const contentMatrix = navigator.createFocusContentMatrix({
      contentOffset: 0,
    });

    expect(contentMatrix).toEqual({ scale: 2, x: 3, y: 4 });
  });

  it("should calculate content matrix to have single node in the center", () => {
    const element = createElement({ width: 200, height: 200 });
    const canvas = createCanvas(element);

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
    });

    const navigator = new ViewportNavigator(canvas.viewport, canvas.graph);

    const contentMatrix = navigator.createFocusContentMatrix({
      contentOffset: 0,
    });

    expect(contentMatrix).toEqual({ scale: 1, x: 100, y: 100 });
  });

  it("should keep content matrix scale", () => {
    const element = createElement({ width: 200, height: 200 });
    const canvas = createCanvas(element);

    canvas
      .addNode({
        id: "node-1",
        element: document.createElement("div"),
        x: 100,
        y: 100,
      })
      .patchViewportMatrix({ scale: 2 });

    const navigator = new ViewportNavigator(canvas.viewport, canvas.graph);

    const contentMatrix = navigator.createFocusContentMatrix({
      contentOffset: 0,
    });

    expect(contentMatrix).toEqual({ scale: 0.5, x: 50, y: 50 });
  });

  it("should calculate content matrix to have two nodes content in the center", () => {
    const element = createElement({ width: 200, height: 200 });
    const canvas = createCanvas(element);

    canvas
      .addNode({
        id: "node-1",
        element: document.createElement("div"),
        x: 0,
        y: 0,
      })
      .addNode({
        id: "node-2",
        element: document.createElement("div"),
        x: 100,
        y: 100,
      });

    const navigator = new ViewportNavigator(canvas.viewport, canvas.graph);

    const contentMatrix = navigator.createFocusContentMatrix({
      contentOffset: 0,
    });

    expect(contentMatrix).toEqual({ scale: 1, x: 50, y: 50 });
  });

  it("should account for scale when has two nodes", () => {
    const element = createElement({ width: 200, height: 200 });
    const canvas = createCanvas(element);

    canvas
      .addNode({
        id: "node-1",
        element: document.createElement("div"),
        x: 0,
        y: 0,
      })
      .addNode({
        id: "node-2",
        element: document.createElement("div"),
        x: 100,
        y: 100,
      })
      .patchViewportMatrix({ scale: 2 });

    const navigator = new ViewportNavigator(canvas.viewport, canvas.graph);

    const contentMatrix = navigator.createFocusContentMatrix({
      contentOffset: 0,
    });

    expect(contentMatrix).toEqual({ scale: 0.5, x: 75, y: 75 });
  });

  it("should adjust viewport scale when current scale doesn't fit horizontally", () => {
    const element = createElement({ width: 200, height: 200 });
    const canvas = createCanvas(element);

    canvas
      .addNode({
        id: "node-1",
        element: document.createElement("div"),
        x: 0,
        y: 0,
      })
      .addNode({
        id: "node-2",
        element: document.createElement("div"),
        x: 1000,
        y: 0,
      });

    const navigator = new ViewportNavigator(canvas.viewport, canvas.graph);

    const contentMatrix = navigator.createFocusContentMatrix({
      contentOffset: 0,
    });

    expect(contentMatrix).toEqual({ scale: 0.2, x: -400, y: 100 });
  });

  it("should adjust viewport scale when current scale doesn't fit vertically", () => {
    const element = createElement({ width: 200, height: 200 });
    const canvas = createCanvas(element);

    canvas
      .addNode({
        id: "node-1",
        element: document.createElement("div"),
        x: 0,
        y: 0,
      })
      .addNode({
        id: "node-2",
        element: document.createElement("div"),
        x: 0,
        y: 1000,
      });

    const navigator = new ViewportNavigator(canvas.viewport, canvas.graph);

    const contentMatrix = navigator.createFocusContentMatrix({
      contentOffset: 0,
    });

    expect(contentMatrix).toEqual({ scale: 0.2, x: 100, y: -400 });
  });

  it("should account for specified offset", () => {
    const element = createElement({ width: 200, height: 200 });
    const canvas = createCanvas(element);

    canvas
      .addNode({
        id: "node-1",
        element: document.createElement("div"),
        x: 0,
        y: 0,
      })
      .addNode({
        id: "node-2",
        element: document.createElement("div"),
        x: 800,
        y: 0,
      });

    const navigator = new ViewportNavigator(canvas.viewport, canvas.graph);

    const contentMatrix = navigator.createFocusContentMatrix({
      contentOffset: 100,
    });

    expect(contentMatrix).toEqual({ scale: 0.2, x: -300, y: 100 });
  });
});
