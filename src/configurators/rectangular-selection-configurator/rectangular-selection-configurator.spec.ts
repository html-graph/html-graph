import { Canvas } from "@/canvas";
import { Graph } from "@/graph";
import { GraphController } from "@/graph-controller";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import { defaultGraphControllerParams } from "@/mocks/default-graph-controller-params";
import { defaultViewportControllerParams } from "@/mocks/default-viewport-controller-params";
import { Viewport } from "@/viewport";
import { ViewportController } from "@/viewport-controller";
import { ViewportStore } from "@/viewport-store";
import { describe, expect, it } from "vitest";
import { RectangularSelectionConfigurator } from "./rectangular-selection-configurator";
import { createElement } from "@/mocks/create-element.mock";

const createCanvas = (options?: {
  mainElement?: HTMLElement;
  overlayElement?: HTMLElement;
}): Canvas => {
  const graphStore = new GraphStore();
  const mainElement =
    options?.mainElement ?? createElement({ width: 1000, height: 1000 });
  const viewportStore = new ViewportStore(mainElement);
  const htmlView = new CoreHtmlView(graphStore, viewportStore, mainElement);
  const graph = new Graph(graphStore);
  const viewport = new Viewport(viewportStore);

  const graphController = new GraphController(
    graphStore,
    htmlView,
    defaultGraphControllerParams,
  );

  const viewportController = new ViewportController(
    graphStore,
    viewportStore,
    defaultViewportControllerParams,
    window,
  );

  const canvas = new Canvas(
    graph,
    viewport,
    graphController,
    viewportController,
  );

  const overlayElement =
    options?.overlayElement ?? createElement({ width: 1000, height: 1000 });

  RectangularSelectionConfigurator.configure(
    canvas,
    mainElement,
    overlayElement,
    window,
  );

  return canvas;
};

const selectRectangle = (overlayElement: HTMLElement): HTMLElement => {
  return overlayElement.children[0].children[0] as HTMLElement;
};

describe("RectangularSelectionConfigurator", () => {
  it("should create overlay host element", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    createCanvas({ mainElement, overlayElement });

    expect(overlayElement.children.length).toBe(1);
  });

  it("should create selection rectangle element on mouse down", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    createCanvas({ mainElement, overlayElement });

    mainElement.dispatchEvent(new MouseEvent("mousedown"));

    expect(overlayElement.children[0].children.length).toBe(1);
  });

  it("should create selection rectangle with abolute positioning", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    createCanvas({ mainElement, overlayElement });

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 100 }),
    );

    const rectangle = selectRectangle(overlayElement);

    expect(rectangle.style.position).toBe("absolute");
  });

  it("should create selection rectangle positioned at cursor", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    createCanvas({ mainElement, overlayElement });

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 100 }),
    );

    const rectangle = selectRectangle(overlayElement);
    const pos = { x: rectangle.style.left, y: rectangle.style.top };

    expect(pos).toEqual({ x: "100px", y: "100px" });
  });

  it("should account for viewport coordinates when positioning rectangle", () => {
    const mainElement = createElement({
      x: 50,
      y: 50,
      width: 1000,
      height: 1000,
    });

    const overlayElement = createElement({
      x: 50,
      y: 50,
      width: 1000,
      height: 1000,
    });

    createCanvas({ mainElement, overlayElement });

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 100 }),
    );

    const rectangle = selectRectangle(overlayElement);
    const pos = { x: rectangle.style.left, y: rectangle.style.top };

    expect(pos).toEqual({ x: "50px", y: "50px" });
  });

  it("should account for viewport transformation when positioning rectangle", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });

    const canvas = createCanvas({ mainElement, overlayElement });

    canvas.patchContentMatrix({ x: 200, y: 300 });

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 100 }),
    );

    const rectangle = selectRectangle(overlayElement);
    const pos = { x: rectangle.style.left, y: rectangle.style.top };

    expect(pos).toEqual({ x: "300px", y: "400px" });
  });

  it("should update rectangle positioning when viewport is updated", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });

    const canvas = createCanvas({ mainElement, overlayElement });

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 100 }),
    );

    canvas.patchContentMatrix({ x: 200, y: 300 });

    const rectangle = selectRectangle(overlayElement);
    const pos = { x: rectangle.style.left, y: rectangle.style.top };

    expect(pos).toEqual({ x: "300px", y: "400px" });
  });

  it("should create selection rectangle with zero width and height", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    createCanvas({ mainElement, overlayElement });

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 100 }),
    );

    const rectangle = selectRectangle(overlayElement);
    const size = {
      width: rectangle.style.width,
      height: rectangle.style.height,
    };

    expect(size).toEqual({ width: "0px", height: "0px" });
  });

  it("should adjust rectangle width and height on mouse move", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    createCanvas({ mainElement, overlayElement });

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 100 }),
    );

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 900, clientY: 900 }),
    );

    const rectangle = selectRectangle(overlayElement);
    const size = {
      width: rectangle.style.width,
      height: rectangle.style.height,
    };

    expect(size).toEqual({ width: "800px", height: "800px" });
  });

  it("should flip rectangle in opposite direction", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    createCanvas({ mainElement, overlayElement });

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 900, clientY: 900 }),
    );

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 100, clientY: 100 }),
    );

    const rectangle = selectRectangle(overlayElement);

    const pos = { x: rectangle.style.left, y: rectangle.style.top };

    expect(pos).toEqual({ x: "100px", y: "100px" });
  });
});
