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
import { EventTagger, PointInsideVerifier, selectionHandled } from "../shared";

const createCanvas = (options?: {
  element?: HTMLElement;
  onNodeSelected?: (nodeId: Identifier) => void;
  mouseDownEventVerifier?: (event: MouseEvent) => boolean;
  mouseUpEventVerifier?: (event: MouseEvent) => boolean;
  movementThreshold?: number;
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

  const pointInsideVerifier = new PointInsideVerifier(element, window);

  UserSelectableNodesConfigurator.configure(
    canvas,
    window,
    pointInsideVerifier,
    new EventTagger(),
    {
      onNodeSelected: options?.onNodeSelected ?? ((): void => {}),
      mouseDownEventVerifier:
        options?.mouseDownEventVerifier ?? ((): boolean => true),
      mouseUpEventVerifier:
        options?.mouseUpEventVerifier ?? ((): boolean => true),
      movementThreshold: options?.movementThreshold ?? 10,
    },
  );

  return canvas;
};

describe("UserSelectableNodesConfigurator", () => {
  it("should call specified callback on node mouse grab and immediate release", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({ element, onNodeSelected });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    nodeElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onNodeSelected).toHaveBeenCalledWith("node-1");
  });

  it("should should tag mouse event on node selection", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({ element, onNodeSelected });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    nodeElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    const event = new MouseEvent("mouseup");

    window.dispatchEvent(event);

    const eventTagger = new EventTagger();

    expect(eventTagger.has(event, selectionHandled)).toBe(true);
  });

  it("should not call specified callback after node removed", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({ element, onNodeSelected });

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
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onNodeSelected).not.toHaveBeenCalled();
  });

  it("should not call specified callback after canvas destroy", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({ element, onNodeSelected });

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
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onNodeSelected).not.toHaveBeenCalled();
  });

  it("should prevent selection initiation process when mouse down verifier not passed", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({
      element,
      onNodeSelected,
      mouseDownEventVerifier: (event: MouseEvent): boolean => event.ctrlKey,
    });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    nodeElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onNodeSelected).not.toHaveBeenCalled();
  });

  it("should prevent selection when mouse up verifier not passed", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({
      element,
      onNodeSelected,
      mouseUpEventVerifier: (event: MouseEvent): boolean => event.ctrlKey,
    });

    const nodeElement = createElement({ width: 100, height: 100 });

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    nodeElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onNodeSelected).not.toHaveBeenCalled();
  });

  it("should reset node element mouse event on canvas clear", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onNodeSelected = jest.fn();

    const canvas = createCanvas({ element, onNodeSelected });

    const nodeElement = createElement({ width: 100, height: 100 });

    const spy = jest.spyOn(nodeElement, "removeEventListener");

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 200,
      y: 200,
    });

    canvas.clear();

    expect(spy).toHaveBeenCalledWith("mousedown", expect.anything());
    spy.mockClear();
  });
});
