import { Canvas } from "@/canvas";
import { Graph } from "@/graph";
import { GraphController } from "@/graph-controller";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import { Identifier } from "@/identifier";
import {
  createElement,
  defaultGraphControllerParams,
  defaultViewportControllerParams,
} from "@/mocks";
import { Viewport } from "@/viewport";
import { ViewportController } from "@/viewport-controller";
import { ViewportStore } from "@/viewport-store";
import { EventTagger, PointInsideVerifier, selectionHandled } from "../shared";
import { UserSelectableEdgesConfigurator } from "./user-selectable-edges-configurator";
import { BezierEdgeShape } from "@/edges";

const createCanvas = (options?: {
  element?: HTMLElement;
  onEdgeSelected?: (nodeId: Identifier) => void;
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

  UserSelectableEdgesConfigurator.configure(
    canvas,
    window,
    pointInsideVerifier,
    new EventTagger(),
    {
      onEdgeSelected: options?.onEdgeSelected ?? ((): void => {}),
      mouseDownEventVerifier:
        options?.mouseDownEventVerifier ?? ((): boolean => true),
      mouseUpEventVerifier:
        options?.mouseUpEventVerifier ?? ((): boolean => true),
      movementThreshold: options?.movementThreshold ?? 10,
    },
  );

  return canvas;
};

describe("UserSelectableEdgesConfigurator", () => {
  it("should call specified callback on edge mouse grab and immediate release", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onEdgeSelected = jest.fn();

    const canvas = createCanvas({ element, onEdgeSelected });

    const nodeElement = createElement({ width: 100, height: 100 });

    const shape = new BezierEdgeShape();

    canvas
      .addNode({
        id: "node-1",
        element: nodeElement,
        x: 200,
        y: 200,
        ports: [{ id: "port-1", element: nodeElement }],
      })
      .addEdge({
        id: "edge-1",
        from: "port-1",
        to: "port-1",
        shape,
      });

    shape.svg.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onEdgeSelected).toHaveBeenCalledWith("edge-1");
  });

  it("should should tag mouse event on edge selection", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onEdgeSelected = jest.fn();

    const canvas = createCanvas({ element, onEdgeSelected });

    const nodeElement = createElement({ width: 100, height: 100 });

    const shape = new BezierEdgeShape();

    canvas
      .addNode({
        id: "node-1",
        element: nodeElement,
        x: 200,
        y: 200,
        ports: [{ id: "port-1", element: nodeElement }],
      })
      .addEdge({
        id: "edge-1",
        from: "port-1",
        to: "port-1",
        shape,
      });

    shape.svg.dispatchEvent(
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

  it("should not call specified callback after edge removed", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onEdgeSelected = jest.fn();

    const canvas = createCanvas({ element, onEdgeSelected });

    const nodeElement = createElement({ width: 100, height: 100 });

    const shape = new BezierEdgeShape();

    canvas
      .addNode({
        id: "node-1",
        element: nodeElement,
        x: 200,
        y: 200,
        ports: [{ id: "port-1", element: nodeElement }],
      })
      .addEdge({
        id: "edge-1",
        from: "port-1",
        to: "port-1",
        shape,
      })
      .removeEdge("edge-1");

    shape.svg.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onEdgeSelected).not.toHaveBeenCalled();
  });

  it("should not call specified callback after canvas clear", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onEdgeSelected = jest.fn();

    const canvas = createCanvas({ element, onEdgeSelected });

    const nodeElement = createElement({ width: 100, height: 100 });

    const shape = new BezierEdgeShape();

    canvas
      .addNode({
        id: "node-1",
        element: nodeElement,
        x: 200,
        y: 200,
        ports: [{ id: "port-1", element: nodeElement }],
      })
      .addEdge({
        id: "edge-1",
        from: "port-1",
        to: "port-1",
        shape,
      })
      .clear();

    shape.svg.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onEdgeSelected).not.toHaveBeenCalled();
  });

  it("should not call specified callback after canvas destroy", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onEdgeSelected = jest.fn();

    const canvas = createCanvas({ element, onEdgeSelected });

    const nodeElement = createElement({ width: 100, height: 100 });

    const shape = new BezierEdgeShape();

    canvas
      .addNode({
        id: "node-1",
        element: nodeElement,
        x: 200,
        y: 200,
        ports: [{ id: "port-1", element: nodeElement }],
      })
      .addEdge({
        id: "edge-1",
        from: "port-1",
        to: "port-1",
        shape,
      })
      .destroy();

    shape.svg.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onEdgeSelected).not.toHaveBeenCalled();
  });

  it("should prevent selection initiation process when mouse down verifier not passed", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onEdgeSelected = jest.fn();

    const canvas = createCanvas({
      element,
      onEdgeSelected,
      mouseDownEventVerifier: (event: MouseEvent): boolean => event.ctrlKey,
    });

    const nodeElement = createElement({ width: 100, height: 100 });
    const shape = new BezierEdgeShape();

    canvas
      .addNode({
        id: "node-1",
        element: nodeElement,
        x: 200,
        y: 200,
        ports: [{ id: "port-1", element: nodeElement }],
      })
      .addEdge({
        id: "edge-1",
        from: "port-1",
        to: "port-1",
        shape,
      });

    shape.svg.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onEdgeSelected).not.toHaveBeenCalled();
  });

  it("should prevent selection initiation process when mouse up verifier not passed", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onEdgeSelected = jest.fn();

    const canvas = createCanvas({
      element,
      onEdgeSelected,
      mouseUpEventVerifier: (event: MouseEvent): boolean => event.ctrlKey,
    });

    const nodeElement = createElement({ width: 100, height: 100 });
    const shape = new BezierEdgeShape();

    canvas
      .addNode({
        id: "node-1",
        element: nodeElement,
        x: 200,
        y: 200,
        ports: [{ id: "port-1", element: nodeElement }],
      })
      .addEdge({
        id: "edge-1",
        from: "port-1",
        to: "port-1",
        shape,
      });

    shape.svg.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onEdgeSelected).not.toHaveBeenCalled();
  });
});
