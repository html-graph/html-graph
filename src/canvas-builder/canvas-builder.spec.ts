import { AddEdgeRequest, AddNodeRequest } from "@/canvas";
import { CanvasBuilder } from "@/canvas-builder";
import { standardCenterFn } from "@/center-fn";
import { BezierEdgeShape } from "@/edges";
import {
  AnimationFrameMock,
  createElement,
  createMouseMoveEvent,
  DummyAnimatedLayoutAlgorithm,
  triggerResizeFor,
  wait,
} from "@/mocks";
import { CanvasBuilderError } from "./canvas-builder-error";
import { DummyLayoutAlgorithm } from "@/mocks";
import { EventSubject } from "@/event-subject";

const setLayersDimensions = (element: HTMLElement): void => {
  for (const child of element.children[0].children) {
    child.getBoundingClientRect = element.getBoundingClientRect;
  }
};

describe("CanvasBuilder", () => {
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

  it("should throw error when trying to call build second time", () => {
    const builder = new CanvasBuilder(document.createElement("div"));
    builder.build();

    expect(() => {
      builder.build();
    }).toThrow(CanvasBuilderError);
  });

  it("should remove all children before destroy", () => {
    const canvasElement = document.createElement("div");
    const builder = new CanvasBuilder(canvasElement);

    const canvas = builder.build();

    canvas.destroy();

    expect(canvasElement.children.length).toBe(0);
  });

  it("should build canvas with specified defaults", () => {
    const canvasElement = document.createElement("div");
    const builder = new CanvasBuilder(canvasElement);

    const canvas = builder
      .setDefaults({
        nodes: {
          priority: () => 10,
        },
      })
      .build();

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

  it("should build canvas with node resize reactive edges", () => {
    const canvasElement = document.createElement("div");
    const builder = new CanvasBuilder(canvasElement);

    const canvas = builder.enableNodeResizeReactiveEdges().build();

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

    const spy = jest.spyOn(shape, "render");

    triggerResizeFor(nodeRequest1.element);

    expect(spy).toHaveBeenCalled();
  });

  it("should build canvas with user draggable nodes", () => {
    const canvasElement = createElement({ width: 1000, height: 1000 });
    const builder = new CanvasBuilder(canvasElement);

    const canvas = builder.enableUserDraggableNodes().build();
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

  it("should build canvas with user transformable viewport", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const builder = new CanvasBuilder(element);

    builder.enableUserTransformableViewport().build();

    const host = element.children[0].children[1];
    host.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({ movementX: 100, movementY: 100 });

    window.dispatchEvent(moveEvent);

    const container = host.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 100, 100)");
  });

  it("should build canvas with virtual scroll", async () => {
    const canvasElement = createElement({ width: 100, height: 100 });
    const builder = new CanvasBuilder(canvasElement);

    const canvas = builder
      .enableVirtualScroll({
        nodeContainingRadius: {
          vertical: 10,
          horizontal: 10,
        },
      })
      .build();

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

    await wait(0);

    const container =
      canvasElement.children[0].children[1].children[0].children[0];

    expect(container.children.length).toBe(1);
  });

  it("should build canvas with background", async () => {
    const canvasElement = createElement({ width: 100, height: 100 });
    const builder = new CanvasBuilder(canvasElement);

    builder.enableBackground().build();

    const svg = canvasElement.children[0].children[0].children[0];

    expect(svg.tagName).toBe("svg");
  });

  it("should build canvas with user connectable ports", () => {
    const canvasElement = createElement({ width: 1000, height: 1000 });
    const builder = new CanvasBuilder(canvasElement);
    document.body.appendChild(canvasElement);

    const canvas = builder.enableUserConnectablePorts().build();

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

  it("should build canvas with user draggable edges", () => {
    const canvasElement = createElement({ width: 1000, height: 1000 });
    const builder = new CanvasBuilder(canvasElement);
    document.body.appendChild(canvasElement);

    const canvas = builder.enableUserDraggableEdges().build();

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
      new MouseEvent("mousedown", { clientX: 0, clientY: 0, ctrlKey: true }),
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

  it("should build canvas with specified layout", () => {
    const builder = new CanvasBuilder(document.createElement("div"));
    const trigger = new EventSubject<void>();

    const canvas = builder
      .enableLayout({
        algorithm: new DummyLayoutAlgorithm(),
        applyOn: trigger,
      })
      .build();

    canvas.addNode({ id: "node-1", element: document.createElement("div") });

    trigger.emit();

    const { x, y } = canvas.graph.getNode("node-1")!;

    expect({ x, y }).toEqual({ x: 0, y: 0 });
  });

  it("should build canvas with specified animated layout", async () => {
    const builder = new CanvasBuilder(document.createElement("div"));

    const canvas = builder
      .enableAnimatedLayout({
        type: "custom",
        algorithm: new DummyAnimatedLayoutAlgorithm(),
      })
      .build();

    canvas.addNode({ id: "node-1", element: document.createElement("div") });

    animationMock.timer.emit(0);
    animationMock.timer.emit(100);

    const { x, y } = canvas.graph.getNode("node-1")!;

    expect({ x, y }).toEqual({ x: 0, y: 0 });
  });

  it("should unset canvas layout config when animated layout configured", async () => {
    const builder = new CanvasBuilder(document.createElement("div"));
    const trigger = new EventSubject<void>();

    const canvas = builder
      .enableLayout({
        algorithm: new DummyLayoutAlgorithm(),
        applyOn: trigger,
      })
      .enableAnimatedLayout({
        type: "custom",
        algorithm: new DummyAnimatedLayoutAlgorithm(100, 100),
      })
      .build();

    canvas.addNode({ id: "node-1", element: document.createElement("div") });

    animationMock.timer.emit(0);
    animationMock.timer.emit(100);

    trigger.emit();

    const { x, y } = canvas.graph.getNode("node-1")!;

    expect({ x, y }).toEqual({ x: 100, y: 100 });
  });

  it("should unset canvas animated layout config when layout configured", async () => {
    const builder = new CanvasBuilder(document.createElement("div"));
    const trigger = new EventSubject<void>();

    const canvas = builder
      .enableAnimatedLayout({
        type: "custom",
        algorithm: new DummyAnimatedLayoutAlgorithm(100, 100),
      })
      .enableLayout({
        algorithm: new DummyLayoutAlgorithm(),
        applyOn: trigger,
      })
      .build();

    canvas.addNode({ id: "node-1", element: document.createElement("div") });
    trigger.emit();

    animationMock.timer.emit(0);
    animationMock.timer.emit(100);

    const { x, y } = canvas.graph.getNode("node-1")!;

    expect({ x, y }).toEqual({ x: 0, y: 0 });
  });

  it("should should not animate grabbed node", async () => {
    const canvasElement = createElement({ width: 1000, height: 1000 });
    const builder = new CanvasBuilder(canvasElement);

    const canvas = builder
      .enableUserDraggableNodes()
      .enableAnimatedLayout({
        type: "custom",
        algorithm: new DummyAnimatedLayoutAlgorithm(100, 100),
      })
      .build();

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

    const { x, y } = canvas.graph.getNode("node-1")!;

    expect({ x, y }).toEqual({ x: 0, y: 0 });
  });
});
