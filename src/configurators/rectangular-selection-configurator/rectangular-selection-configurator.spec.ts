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

  RectangularSelectionConfigurator.configure(canvas, overlayElement);

  return canvas;
};

describe("RectangularSelectionConfigurator", () => {
  it("should create selection rectangle on mouse down", () => {
    const mainElement = createElement({ width: 1000, height: 1000 });
    const overlayElement = createElement({ width: 1000, height: 1000 });
    createCanvas({ mainElement, overlayElement });

    mainElement.dispatchEvent(new MouseEvent("mousedown"));

    expect(overlayElement.children.length).toBe(1);
  });
});
