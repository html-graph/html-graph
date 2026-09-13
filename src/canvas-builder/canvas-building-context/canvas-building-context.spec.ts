import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { standardCenterFn } from "@/center-fn";
import { BezierEdgeShape } from "@/edges";
import { AnimationFrameMock } from "@/mocks/animation-frame.mock";
import { createElement } from "@/mocks/create-element.mock";
import { createMouseMoveEvent } from "@/mocks/create-mouse-move-event.mock";
import { triggerResizeFor } from "@/mocks/trigger-resize-for.mock";
import { waitMacrotask } from "@/mocks/wait-macrotask.mock";
import { DummyLayoutAlgorithm } from "@/mocks/dummy-layout-algorithm.mock";
import { EventSubject } from "@/event-subject";
import { AddEdgeRequest, AddNodeRequest } from "@/graph-controller";
import { setLayersDimensions } from "@/mocks/set-layer-dimensions.mock";
import { CanvasBuildingContextParams } from "./canvas-building-context-params";
import { CanvasBuildingContext } from "./canvas-building-context";

const defaultConfig: CanvasBuildingContextParams = {
  canvasDefaults: {},
  userDraggableNodes: {
    enabled: false,
    config: undefined,
  },
  userTransformableViewport: {
    enabled: false,
    config: undefined,
  },
  background: {
    enabled: false,
    config: undefined,
  },
  userConnectablePorts: {
    enabled: false,
    config: undefined,
  },
  userDraggableEdges: {
    enabled: false,
    config: undefined,
  },
  rectangularSelection: {
    enabled: false,
    config: undefined,
  },
  virtualScroll: {
    enabled: false,
  },
  layout: {
    enabled: false,
    config: undefined,
  },
  animatedLayout: {
    enabled: false,
    config: undefined,
  },
  nodeResizeReactiveEdges: {
    enabled: false,
  },
  userSelectableNodes: {
    enabled: false,
  },
  userSelectableEdges: {
    enabled: false,
  },
  userSelectableCanvas: {
    enabled: false,
  },
};

describe("CanvasBuildingContextContext", () => {
  const animationMock = new AnimationFrameMock();

  beforeEach(() => {
    animationMock.hook();
  });

  afterEach(() => {
    animationMock.unhook();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should remove all children before destroy", () => {
    const canvasElement = document.createElement("div");
    const context = new CanvasBuildingContext(canvasElement, defaultConfig);

    const canvas = context.createCanvas();

    canvas.destroy();

    expect(canvasElement.children.length).toBe(0);
  });

  it("should create canvas with specified defaults", () => {
    const canvasElement = document.createElement("div");
    const context = new CanvasBuildingContext(canvasElement, {
      ...defaultConfig,
      canvasDefaults: {
        nodes: {
          priority: (): number => 10,
        },
      },
    });

    const canvas = context.createCanvas();

    canvas.addNode({
      element: document.createElement("div"),
      x: 0,
      y: 0,
    });

    const container =
      canvasElement.children[0].children[1].children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.zIndex).toBe("10");
  });

  it("should create canvas with node resize reactive edges", () => {
    const canvasElement = document.createElement("div");
    const context = new CanvasBuildingContext(canvasElement, {
      ...defaultConfig,
      nodeResizeReactiveEdges: { enabled: true },
    });

    const canvas = context.createCanvas();

    const nodeRequest1: AddNodeRequest = {
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: document.createElement("div"),
        },
      ],
    };

    const nodeRequest2: AddNodeRequest = {
      id: "node-2",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-2",
          element: document.createElement("div"),
        },
      ],
    };

    const shape = new BezierEdgeShape();

    const addEdge: AddEdgeRequest = {
      from: "port-1",
      to: "port-2",
      shape,
    };

    canvas.addNode(nodeRequest1).addNode(nodeRequest2).addEdge(addEdge);

    const spy = vi.spyOn(shape, "render");

    triggerResizeFor(nodeRequest1.element);

    expect(spy).toHaveBeenCalled();
  });

  it("should create canvas with user draggable nodes", () => {
    const canvasElement = createElement({ width: 1000, height: 1000 });
    const context = new CanvasBuildingContext(canvasElement, {
      ...defaultConfig,
      userDraggableNodes: { enabled: true, config: undefined },
    });

    const canvas = context.createCanvas();
    setLayersDimensions(canvasElement);

    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    nodeElement.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 100 }));

    const container =
      canvasElement.children[0].children[1].children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(100px, 100px)");
  });

  it("should create canvas with user transformable viewport", () => {
    const canvasElement = createElement({ width: 1000, height: 1000 });
    const context = new CanvasBuildingContext(canvasElement, {
      ...defaultConfig,
      userTransformableViewport: { enabled: true, config: undefined },
    });

    context.createCanvas();

    const host = canvasElement.children[0].children[1];
    host.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({ movementX: 100, movementY: 100 });

    window.dispatchEvent(moveEvent);

    const container = host.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 100, 100)");
  });

  it("should create canvas with virtual scroll", async () => {
    const canvasElement = createElement({ width: 100, height: 100 });
    const context = new CanvasBuildingContext(canvasElement, {
      ...defaultConfig,
      virtualScroll: {
        enabled: true,
        config: {
          nodeContainingRadius: {
            vertical: 10,
            horizontal: 10,
          },
        },
      },
    });

    const canvas = context.createCanvas();

    canvas.addNode({
      element: document.createElement("div"),
      x: 0,
      y: 0,
    });

    canvas.addNode({
      element: document.createElement("div"),
      x: 300,
      y: 300,
    });

    await waitMacrotask(0);

    const container =
      canvasElement.children[0].children[1].children[0].children[0];

    expect(container.children.length).toBe(1);
  });

  it("should create canvas with background", async () => {
    const canvasElement = createElement({ width: 100, height: 100 });
    const context = new CanvasBuildingContext(canvasElement, {
      ...defaultConfig,
      background: { enabled: true, config: undefined },
    });

    context.createCanvas();

    const svg = canvasElement.children[0].children[0].children[0];

    expect(svg.tagName).toBe("svg");
  });

  it("should create canvas with user connectable ports", () => {
    const canvasElement = createElement({ width: 1000, height: 1000 });
    const context = new CanvasBuildingContext(canvasElement, {
      ...defaultConfig,
      userConnectablePorts: { enabled: true, config: undefined },
    });
    document.body.appendChild(canvasElement);

    const canvas = context.createCanvas();

    setLayersDimensions(canvasElement);

    const sourcePortElement = createElement({
      x: -5,
      y: -5,
      width: 10,
      height: 10,
    });

    const sourceNodeElement = document.createElement("div");
    sourceNodeElement.appendChild(sourcePortElement);

    canvas.addNode({
      element: sourceNodeElement,
      x: 0,
      y: 0,
      ports: [
        {
          element: sourcePortElement,
        },
      ],
    });

    const targetPortElement = createElement({
      x: 95,
      y: 95,
      width: 10,
      height: 10,
    });

    const targetNodeElement = document.createElement("div");
    targetNodeElement.appendChild(targetPortElement);

    canvas.addNode({
      element: targetNodeElement,
      x: 0,
      y: 0,
      ports: [
        {
          element: targetPortElement,
        },
      ],
    });

    sourcePortElement.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 100 }));
    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 100, clientY: 100 }),
    );

    expect(canvas.graph.getAllEdgeIds().length).toBe(1);
  });

  it("should create canvas with user draggable edges", () => {
    const canvasElement = createElement({ width: 1000, height: 1000 });
    const context = new CanvasBuildingContext(canvasElement, {
      ...defaultConfig,
      userDraggableEdges: { enabled: true, config: undefined },
    });
    document.body.appendChild(canvasElement);

    const canvas = context.createCanvas();

    setLayersDimensions(canvasElement);

    const sourcePortElement = createElement({
      x: -5,
      y: -5,
      width: 10,
      height: 10,
    });

    const sourceNodeElement = document.createElement("div");
    sourceNodeElement.appendChild(sourcePortElement);

    canvas.addNode({
      element: sourceNodeElement,
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: sourcePortElement,
        },
      ],
    });

    const targetPortElement = createElement({
      x: 95,
      y: 95,
      width: 10,
      height: 10,
    });

    const targetNodeElement = document.createElement("div");
    targetNodeElement.appendChild(targetPortElement);

    canvas.addNode({
      element: targetNodeElement,
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-2",
          element: targetPortElement,
        },
      ],
    });

    const shape = new BezierEdgeShape();

    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-2", shape });

    sourcePortElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 0, clientY: 0 }),
    );
    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 100 }));
    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 100, clientY: 100 }),
    );

    expect(canvas.graph.getEdge("edge-1")).toEqual({
      from: "port-2",
      to: "port-2",
      priority: 0,
      shape,
    });
  });

  it("should create canvas with default layout", async () => {
    const context = new CanvasBuildingContext(document.createElement("div"), {
      ...defaultConfig,
      layout: { enabled: true, config: undefined },
    });

    const canvas = context.createCanvas();

    canvas.addNode({ id: "node-1", element: document.createElement("div") });

    await waitMacrotask(0);

    const { x, y } = canvas.graph.getNode("node-1");

    expect(x !== null && y !== null).toBe(true);
  });

  it("should create canvas with specified layout", () => {
    const trigger = new EventSubject<void>();

    const context = new CanvasBuildingContext(document.createElement("div"), {
      ...defaultConfig,
      layout: {
        enabled: true,
        config: {
          algorithm: {
            type: "custom",
            instance: new DummyLayoutAlgorithm(),
          },
          applyOn: trigger,
        },
      },
    });

    const canvas = context.createCanvas();

    canvas.addNode({ id: "node-1", element: document.createElement("div") });

    trigger.emit();

    const { x, y } = canvas.graph.getNode("node-1");

    expect({ x, y }).toEqual({ x: 0, y: 0 });
  });

  it("should create canvas with specified animated layout", async () => {
    const context = new CanvasBuildingContext(document.createElement("div"), {
      ...defaultConfig,
      animatedLayout: { enabled: true, config: undefined },
    });

    const canvas = context.createCanvas();

    canvas.addNode({ id: "node-1", element: document.createElement("div") });

    animationMock.timer.emit(0);
    animationMock.timer.emit(100);

    const { x, y } = canvas.graph.getNode("node-1");

    expect(x !== null && y !== null).toBe(true);
  });

  it("should should not animate grabbed node", async () => {
    const canvasElement = createElement({ width: 1000, height: 1000 });
    const context = new CanvasBuildingContext(canvasElement, {
      ...defaultConfig,
      userDraggableNodes: { enabled: true, config: undefined },
      animatedLayout: { enabled: true, config: undefined },
    });

    const canvas = context.createCanvas();

    setLayersDimensions(canvasElement);

    const nodeElement = createElement();

    canvas.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
    });

    nodeElement.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    animationMock.timer.emit(0);
    animationMock.timer.emit(100);

    const { x, y } = canvas.graph.getNode("node-1");

    expect({ x, y }).toEqual({ x: 0, y: 0 });
  });

  it("should create canvas with selectable nodes", () => {
    const canvasElement = document.createElement("div");
    const onNodeSelected = vi.fn();

    const context = new CanvasBuildingContext(canvasElement, {
      ...defaultConfig,
      userSelectableNodes: {
        enabled: true,
        config: {
          onNodeSelected,
        },
      },
    });

    const canvas = context.createCanvas();

    const nodeElement = document.createElement("div");

    const nodeRequest1: AddNodeRequest = {
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
    };

    canvas.addNode(nodeRequest1);

    nodeElement.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
    window.dispatchEvent(new MouseEvent("mouseup", { button: 0 }));

    expect(onNodeSelected).toHaveBeenCalled();
  });

  it("should create selectable canvas", () => {
    const canvasElement = document.createElement("div");
    const onCanvasSelected = vi.fn();
    const context = new CanvasBuildingContext(canvasElement, {
      ...defaultConfig,
      userSelectableCanvas: {
        enabled: true,
        config: {
          onCanvasSelected,
        },
      },
    });

    context.createCanvas();

    const layer = canvasElement.children[0].children[1];

    layer.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
    window.dispatchEvent(new MouseEvent("mouseup", { button: 0 }));

    expect(onCanvasSelected).toHaveBeenCalled();
  });

  it("should create canvas with selectable edges", () => {
    const canvasElement = document.createElement("div");
    const onEdgeSelected = vi.fn();

    const context = new CanvasBuildingContext(canvasElement, {
      ...defaultConfig,
      userSelectableEdges: {
        enabled: true,
        config: {
          onEdgeSelected,
        },
      },
    });

    const canvas = context.createCanvas();

    const node1Element = document.createElement("div");
    const node2Element = document.createElement("div");

    const shape = new BezierEdgeShape();

    canvas
      .addNode({
        id: "node-1",
        element: node1Element,
        x: 0,
        y: 0,
        ports: [{ id: "port-1", element: node1Element }],
      })
      .addNode({
        id: "node-2",
        element: node2Element,
        x: 0,
        y: 0,
        ports: [{ id: "port-2", element: node2Element }],
      })
      .addEdge({
        from: "port-1",
        to: "port-2",
        shape,
      });

    shape.element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
    window.dispatchEvent(new MouseEvent("mouseup", { button: 0 }));

    expect(onEdgeSelected).toHaveBeenCalled();
  });

  it("should create canvas with rectangular selection", () => {
    const canvasElement = createElement({ width: 1000, height: 1000 });
    const onSelectionStarted = vi.fn();

    const context = new CanvasBuildingContext(canvasElement, {
      ...defaultConfig,
      rectangularSelection: {
        enabled: true,
        config: {
          onSelectionStarted,
        },
      },
    });

    document.body.appendChild(canvasElement);

    context.createCanvas();

    setLayersDimensions(canvasElement);

    const host = canvasElement.children[0].children[1];
    host.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 100,
        clientY: 100,
        button: 0,
        ctrlKey: true,
      }),
    );

    expect(onSelectionStarted).toHaveBeenCalled();
  });
});
