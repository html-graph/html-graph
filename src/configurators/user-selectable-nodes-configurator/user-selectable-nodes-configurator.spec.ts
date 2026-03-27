import { Canvas } from "@/canvas";
import { Graph } from "@/graph";
import { GraphController } from "@/graph-controller";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import {
  createElement,
  defaultGraphControllerParams,
  defaultViewportControllerParams,
} from "@/mocks";
import { Viewport } from "@/viewport";
import { ViewportController } from "@/viewport-controller";
import { ViewportStore } from "@/viewport-store";
import { UserSelectableNodesConfigurator } from "./user-selectable-nodes-configurator";
import { Identifier } from "@/identifier";

const createCanvas = (options?: {
  element?: HTMLElement;
  selectionCallback?: (nodeIds: ReadonlySet<Identifier>) => void;
}): Canvas => {
  const graphStore = new GraphStore();
  const element = options?.element ?? document.createElement("div");
  const viewportStore = new ViewportStore(element);
  const htmlView = new CoreHtmlView(graphStore, viewportStore, element);
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

  UserSelectableNodesConfigurator.configure({
    canvas,
    window,
    selectionCallback: options?.selectionCallback ?? ((): void => {}),
  });

  return canvas;
};

describe("UserSelectableNodesConfigurator", () => {
  it("should call specified callback on node mouse grab and immediate release", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const selectionCallback = jest.fn();

    const canvas = createCanvas({ element, selectionCallback });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    nodeElement.dispatchEvent(
      new MouseEvent("mousedown", {
        ctrlKey: true,
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(selectionCallback).toHaveBeenCalledWith(new Set(["node-1"]));
  });

  it("should not call specified callback after node removed", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const selectionCallback = jest.fn();

    const canvas = createCanvas({ element, selectionCallback });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    canvas.removeNode("node-1");

    nodeElement.dispatchEvent(
      new MouseEvent("mousedown", {
        ctrlKey: true,
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(selectionCallback).not.toHaveBeenCalled();
  });

  it("should not call specified callback after canvas clear", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const selectionCallback = jest.fn();

    const canvas = createCanvas({ element, selectionCallback });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    canvas.clear();

    nodeElement.dispatchEvent(
      new MouseEvent("mousedown", {
        ctrlKey: true,
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(selectionCallback).not.toHaveBeenCalled();
  });

  it("should not call specified callback after canvas destroy", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const selectionCallback = jest.fn();

    const canvas = createCanvas({ element, selectionCallback });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    canvas.destroy();

    nodeElement.dispatchEvent(
      new MouseEvent("mousedown", {
        ctrlKey: true,
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(selectionCallback).not.toHaveBeenCalled();
  });

  it("should not call specified callback when canvas destroyed in the process", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const selectionCallback = jest.fn();

    const canvas = createCanvas({ element, selectionCallback });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    nodeElement.dispatchEvent(
      new MouseEvent("mousedown", {
        ctrlKey: true,
        clientX: 200,
        clientY: 200,
      }),
    );

    canvas.destroy();

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(selectionCallback).not.toHaveBeenCalled();
  });
});
