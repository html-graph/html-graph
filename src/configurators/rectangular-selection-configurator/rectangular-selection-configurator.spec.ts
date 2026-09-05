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
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RectangularSelectionConfigurator } from "./rectangular-selection-configurator";
import { createElement } from "@/mocks/create-element.mock";
import { MouseEventVerifier, PointInsideVerifier } from "../shared";

const createCanvas = (options?: {
  mainElement?: HTMLElement;
  overlayElement?: HTMLElement;
  onSelectionChange?: (rect: DOMRect) => void;
  onSelectionFinished?: (rect: DOMRect) => void;
  onSelectionInterrupted?: (rect: DOMRect) => void;
  onSelectionStarted?: () => void;
  rectangleElement?: Element;
  mouseDownEventVerifier?: MouseEventVerifier;
  mouseUpEventVerifier?: MouseEventVerifier;
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

  const pointInsideVerifier = new PointInsideVerifier(overlayElement, window);

  RectangularSelectionConfigurator.configure(
    canvas,
    mainElement,
    overlayElement,
    pointInsideVerifier,
    window,
    {
      rectangleElement:
        options?.rectangleElement ?? document.createElement("div"),
      mouseDownEventVerifier:
        options?.mouseDownEventVerifier ?? ((): boolean => true),
      mouseUpEventVerifier:
        options?.mouseUpEventVerifier ?? ((): boolean => true),
      onSelectionStarted: options?.onSelectionStarted ?? ((): void => {}),
      onSelectionChange: options?.onSelectionChange ?? ((): void => {}),
      onSelectionInterrupted:
        options?.onSelectionInterrupted ?? ((): void => {}),
      onSelectionFinished: options?.onSelectionFinished ?? ((): void => {}),
    },
  );

  return canvas;
};

const selectRectangle = (overlayElement: HTMLElement): HTMLElement => {
  return overlayElement.children[0].children[0] as HTMLElement;
};

let innerWidth: number;
let innerHeight: number;

describe("RectangularSelectionConfigurator", () => {
  beforeEach(() => {
    innerWidth = window.innerWidth;
    innerHeight = window.innerHeight;

    window.innerWidth = 1000;
    window.innerHeight = 1000;
  });

  afterEach(() => {
    window.innerWidth = innerWidth;
    window.innerHeight = innerHeight;
  });

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

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 100 }),
    );

    expect(overlayElement.children[0].children.length).toBe(1);
  });

  it("should attach rectangle element to rectangle wrapper", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const rectangleElement = document.createElement("div");
    createCanvas({ mainElement, overlayElement, rectangleElement });

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 100 }),
    );

    const rectangle = selectRectangle(overlayElement);

    expect(rectangle.children[0]).toBe(rectangleElement);
  });

  it("should call selection started callback on mouse down", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const onSelectionStarted = vi.fn();
    createCanvas({ mainElement, overlayElement, onSelectionStarted });

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 100 }),
    );

    expect(onSelectionStarted).toHaveBeenCalled();
  });

  it("should not call selection started callback when mouse down event verifier not passed", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const onSelectionStarted = vi.fn();
    const mouseDownEventVerifier = (): boolean => false;
    createCanvas({
      mainElement,
      overlayElement,
      onSelectionStarted,
      mouseDownEventVerifier,
    });

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 100 }),
    );

    expect(onSelectionStarted).not.toHaveBeenCalled();
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

  it("should call specified callback on selection change on mouse move", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const onSelectionChange = vi.fn();
    createCanvas({ mainElement, overlayElement, onSelectionChange });

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 100 }),
    );

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 900, clientY: 900 }),
    );

    expect(onSelectionChange).toHaveBeenCalled();
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

    const box = {
      x: rectangle.style.left,
      y: rectangle.style.top,
      width: rectangle.style.width,
      height: rectangle.style.height,
    };

    expect(box).toEqual({
      x: "100px",
      y: "100px",
      width: "800px",
      height: "800px",
    });
  });

  it("should call specified callback on mouse up", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const onSelectionFinished = vi.fn();
    createCanvas({ mainElement, overlayElement, onSelectionFinished });

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 900, clientY: 900 }),
    );

    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 100, clientY: 100 }),
    );

    expect(onSelectionFinished).toHaveBeenCalled();
  });

  it("should not call specified callback when mouse up verifier not passed", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const onSelectionFinished = vi.fn();
    const mouseUpEventVerifier = (): boolean => false;
    createCanvas({
      mainElement,
      overlayElement,
      onSelectionFinished,
      mouseUpEventVerifier,
    });

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 900, clientY: 900 }),
    );

    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 100, clientY: 100 }),
    );

    expect(onSelectionFinished).not.toHaveBeenCalled();
  });

  it("should not call specified callback after selection is finished", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const onSelectionFinished = vi.fn();
    createCanvas({ mainElement, overlayElement, onSelectionFinished });

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 900, clientY: 900 }),
    );

    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 100, clientY: 100 }),
    );

    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 100, clientY: 100 }),
    );

    expect(onSelectionFinished).toHaveBeenCalledTimes(1);
  });

  it("should not call specified callback on selection change after selection is finished", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const onSelectionChange = vi.fn();
    createCanvas({ mainElement, overlayElement, onSelectionChange });

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 100 }),
    );

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 900, clientY: 900 }),
    );

    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 900, clientY: 900 }),
    );

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 900, clientY: 900 }),
    );

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
  });

  it("should remove rectangle element after selection is finished", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    createCanvas({ mainElement, overlayElement });

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 900, clientY: 900 }),
    );

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 100, clientY: 100 }),
    );

    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 100, clientY: 100 }),
    );

    const rectangle = selectRectangle(overlayElement);

    expect(rectangle).toBe(undefined);
  });

  it("should call specified callback when selection is interrupted", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const onSelectionInterrupted = vi.fn();
    createCanvas({ mainElement, overlayElement, onSelectionInterrupted });

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 100 }),
    );

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: -100, clientY: -100 }),
    );

    expect(onSelectionInterrupted).toHaveBeenCalled();
  });

  it("should not call selection change callback when selection is interrupted", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const onSelectionChange = vi.fn();
    createCanvas({ mainElement, overlayElement, onSelectionChange });

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 100 }),
    );

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: -100, clientY: -100 }),
    );

    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("should not listen to mouse move when selection is interrupted", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const onSelectionInterrupted = vi.fn();
    createCanvas({ mainElement, overlayElement, onSelectionInterrupted });

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 100 }),
    );

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: -100, clientY: -100 }),
    );

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: -100, clientY: -100 }),
    );

    expect(onSelectionInterrupted).toHaveBeenCalledTimes(1);
  });

  it("should remove selection rectangle when selection is interrupted", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    createCanvas({ mainElement, overlayElement });

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 100 }),
    );

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: -100, clientY: -100 }),
    );

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: -100, clientY: -100 }),
    );

    const rectangle = selectRectangle(overlayElement);

    expect(rectangle).toBe(undefined);
  });

  it("should not listen to mouse events when canvas is destroyed", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const onSelectionChange = vi.fn();
    const canvas = createCanvas({
      mainElement,
      overlayElement,
      onSelectionChange,
    });

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 100 }),
    );

    canvas.destroy();

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 900, clientY: 900 }),
    );

    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("should not listen to canvas mouse down when canvas is destroyed", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const onSelectionStarted = vi.fn();
    const canvas = createCanvas({
      mainElement,
      overlayElement,
      onSelectionStarted,
    });

    canvas.destroy();

    mainElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 100 }),
    );

    expect(onSelectionStarted).not.toHaveBeenCalled();
  });
});
