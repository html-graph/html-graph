import { AddEdgeRequest, Canvas, EdgeShapeFactory, GraphEdge } from "@/canvas";
import { BezierEdgeShape, DirectEdgeShape, EdgeShape } from "@/edges";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import {
  createElement,
  createMouseMoveEvent,
  defaultCanvasParams,
} from "@/mocks";
import { ViewportStore } from "@/viewport-store";
import { DraggableEdgesParams } from "./draggable-edges-params";
import { UserDraggableEdgesConfigurator } from "./user-draggable-edges-configurator";
import { ConnectionPreprocessor } from "../shared";

const createCanvas = (options?: {
  mainElement?: HTMLElement;
  overlayElement?: HTMLElement;
  connectionPreprocessor?: ConnectionPreprocessor;
  draggingEdgeResolver?: (portId: unknown) => unknown;
  onAfterEdgeReattached?: (edgeId: unknown) => unknown;
  onEdgeReattachInterrupted?: (edge: GraphEdge) => void;
  onEdgeReattachPrevented?: (edge: GraphEdge) => void;
  draggingEdgeShapeFactory?: EdgeShapeFactory;
}): Canvas => {
  const graphStore = new GraphStore<number>();
  const viewportStore = new ViewportStore();
  const mainElement =
    options?.mainElement ?? createElement({ width: 1000, height: 1000 });
  const overlayElement =
    options?.overlayElement ?? createElement({ width: 1000, height: 1000 });
  const htmlView = new CoreHtmlView(graphStore, viewportStore, mainElement);

  const canvas = new Canvas(
    graphStore,
    viewportStore,
    htmlView,
    defaultCanvasParams,
  );

  const defaultResolver = (portId: unknown): unknown => {
    const edgeIds = canvas.graph.getPortAdjacentEdgeIds(portId)!;

    if (edgeIds.length > 0) {
      return edgeIds[edgeIds.length - 1];
    } else {
      return null;
    }
  };

  const params: DraggableEdgesParams = {
    draggingEdgeShapeFactory: options?.draggingEdgeShapeFactory ?? null,
    draggingEdgeResolver: options?.draggingEdgeResolver ?? defaultResolver,
    connectionPreprocessor:
      options?.connectionPreprocessor ?? ((request): AddEdgeRequest => request),
    mouseDownEventVerifier: (event: MouseEvent) => event.button === 0,
    mouseUpEventVerifier: (event: MouseEvent) => event.button === 0,
    onAfterEdgeReattached: options?.onAfterEdgeReattached ?? ((): void => {}),
    onEdgeReattachInterrupted:
      options?.onEdgeReattachInterrupted ?? ((): void => {}),
    onEdgeReattachPrevented:
      options?.onEdgeReattachPrevented ?? ((): void => {}),
  };

  UserDraggableEdgesConfigurator.configure(
    canvas,
    overlayElement,
    viewportStore,
    window,
    params,
  );

  return canvas;
};

const createNode = (
  canvas: Canvas,
  portElement: HTMLElement,
  portId: unknown,
): void => {
  const nodeElement = document.createElement("div");
  nodeElement.appendChild(portElement);

  canvas.addNode({
    element: nodeElement,
    x: 0,
    y: 0,
    ports: [{ id: portId, element: portElement }],
  });
};

const createGraph = (
  canvas: Canvas,
  params?: {
    portElement1?: HTMLElement;
    portElement2?: HTMLElement;
    portElement3?: HTMLElement;
    edgeShape?: EdgeShape;
  },
): void => {
  const portElement1 = params?.portElement1 ?? document.createElement("div");
  createNode(canvas, portElement1, "node-1-1");

  const portElement2 = params?.portElement2 ?? document.createElement("div");
  createNode(canvas, portElement2, "node-2-1");

  const portElement3 = params?.portElement3 ?? document.createElement("div");
  createNode(canvas, portElement3, "node-3-1");

  canvas.addEdge({
    from: "node-1-1",
    to: "node-2-1",
    shape: params?.edgeShape ?? new BezierEdgeShape(),
  });
};

describe("UserDraggableEdgesConfigurator", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should create overlay graph on port pointer grab", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement1 = document.createElement("div");
    createGraph(canvas, { portElement1 });

    portElement1.dispatchEvent(new MouseEvent("mousedown"));

    expect(overlayElement.children[0].children[0].children.length).toBe(3);
  });

  it("should not create overlay graph when event verifier not matched", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      overlayElement,
    });

    const portElement1 = document.createElement("div");
    createGraph(canvas, { portElement1 });

    portElement1.dispatchEvent(new MouseEvent("mousedown", { button: 1 }));

    expect(overlayElement.children[0].children[0].children.length).toBe(0);
  });

  it("should not create overlay graph when edge is not resolved", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      overlayElement,
      draggingEdgeResolver: () => null,
    });

    const portElement1 = document.createElement("div");
    createGraph(canvas, { portElement1 });

    portElement1.dispatchEvent(new MouseEvent("mousedown"));

    expect(overlayElement.children[0].children[0].children.length).toBe(0);
  });

  it("should not create overlay graph when resolved to nonexisting edge", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      overlayElement,
      draggingEdgeResolver: () => "edge-123",
    });

    const portElement1 = document.createElement("div");
    createGraph(canvas, { portElement1 });

    portElement1.dispatchEvent(new MouseEvent("mousedown"));

    expect(overlayElement.children[0].children[0].children.length).toBe(0);
  });

  it("should create source node at static port center", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement1 = createElement({ width: 10, height: 10 });
    const portElement2 = document.createElement("div");

    createGraph(canvas, { portElement1, portElement2 });

    portElement2.dispatchEvent(new MouseEvent("mousedown"));

    const overlayNodeElement = overlayElement.children[0].children[0]
      .children[0] as HTMLElement;

    expect(overlayNodeElement.style.transform).toBe("translate(5px, 5px)");
  });

  it("should create target node at cursor", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement1 = createElement({ width: 10, height: 10 });
    const portElement2 = document.createElement("div");

    createGraph(canvas, { portElement1, portElement2 });

    portElement2.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 10, clientY: 10 }),
    );

    const overlayNodeElement = overlayElement.children[0].children[0]
      .children[1] as HTMLElement;

    expect(overlayNodeElement.style.transform).toBe("translate(10px, 10px)");
  });

  it("should move target port on port pointer move", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement1 = createElement({ width: 10, height: 10 });
    const portElement2 = document.createElement("div");

    createGraph(canvas, { portElement1, portElement2 });

    portElement2.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 10, clientY: 10 }),
    );

    portElement2.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 100 }));

    const targetNodeElement = overlayElement.children[0].children[0]
      .children[1] as HTMLElement;
    expect(targetNodeElement.style.transform).toBe("translate(100px, 100px)");
  });

  it("should clear overlay graph when pointer moving target port outside", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement1 = createElement({ width: 10, height: 10 });
    const portElement2 = document.createElement("div");

    createGraph(canvas, { portElement1, portElement2 });

    portElement2.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: -10, clientY: -10 }));

    expect(overlayElement.children[0].children[0].children.length).toBe(0);
  });

  it("should create connection on pointer release", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const mainElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement, mainElement });

    document.body.appendChild(mainElement);
    document.body.appendChild(overlayElement);

    const portElement1 = createElement({ x: -5, y: -5, width: 10, height: 10 });
    const portElement2 = createElement({ x: 95, y: 95, width: 10, height: 10 });

    createGraph(canvas, { portElement1, portElement2 });

    portElement1.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 100 }));
    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 100, clientY: 100 }),
    );

    expect(canvas.graph.getAllEdgeIds().length).toBe(1);
  });

  it("should not create connection on pointer release outside of port", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const mainElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement, mainElement });

    document.body.appendChild(mainElement);
    document.body.appendChild(overlayElement);

    const portElement1 = createElement({ x: -5, y: -5, width: 10, height: 10 });
    const portElement2 = createElement({ x: 95, y: 95, width: 10, height: 10 });

    createGraph(canvas, { portElement1, portElement2 });

    portElement1.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 110, clientY: 110 }));
    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 110, clientY: 110 }),
    );

    expect(canvas.graph.getAllEdgeIds().length).toBe(0);
  });

  it("should call specified callback after edge reattach", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const mainElement = createElement({ width: 1000, height: 1000 });

    const onAfterEdgeReattached = jest.fn();
    const canvas = createCanvas({
      overlayElement,
      mainElement,
      onAfterEdgeReattached,
    });

    document.body.appendChild(mainElement);
    document.body.appendChild(overlayElement);

    const portElement1 = createElement({ x: -5, y: -5, width: 10, height: 10 });
    const portElement2 = createElement({ x: 95, y: 95, width: 10, height: 10 });

    createGraph(canvas, { portElement1, portElement2 });

    portElement1.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 100 }));
    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 100, clientY: 100 }),
    );

    expect(onAfterEdgeReattached).toHaveBeenCalledWith(0);
  });

  it("should call specified callback on edge reattach interruption", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const mainElement = createElement({ width: 1000, height: 1000 });

    const onEdgeReattachInterrupted = jest.fn();
    const canvas = createCanvas({
      overlayElement,
      mainElement,
      onEdgeReattachInterrupted,
    });

    document.body.appendChild(mainElement);
    document.body.appendChild(overlayElement);

    const portElement1 = createElement({ x: -5, y: -5, width: 10, height: 10 });
    const portElement2 = createElement({ x: 95, y: 95, width: 10, height: 10 });
    const edgeShape = new BezierEdgeShape();

    createGraph(canvas, { portElement1, portElement2, edgeShape });

    portElement1.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 50, clientY: 50 }));
    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 50, clientY: 50 }),
    );

    expect(onEdgeReattachInterrupted).toHaveBeenCalledWith({
      id: 0,
      from: "node-1-1",
      to: "node-2-1",
      priority: 0,
      shape: edgeShape,
    });
  });

  it("should call specified callback on edge reattach prevention", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const mainElement = createElement({ width: 1000, height: 1000 });

    const onEdgeReattachPrevented = jest.fn();
    const canvas = createCanvas({
      overlayElement,
      mainElement,
      onEdgeReattachPrevented,
      connectionPreprocessor: () => null,
    });

    document.body.appendChild(mainElement);
    document.body.appendChild(overlayElement);

    const portElement1 = createElement({ x: -5, y: -5, width: 10, height: 10 });
    const portElement2 = createElement({ x: 95, y: 95, width: 10, height: 10 });
    const edgeShape = new BezierEdgeShape();

    createGraph(canvas, { portElement1, portElement2, edgeShape });

    portElement1.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 100 }));
    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 100, clientY: 100 }),
    );

    expect(onEdgeReattachPrevented).toHaveBeenCalledWith({
      id: 0,
      from: "node-1-1",
      to: "node-2-1",
      priority: 0,
      shape: edgeShape,
    });
  });

  it("should create overlay edge with specified shape", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const mainElement = createElement({ width: 1000, height: 1000 });

    const edgeShape = new DirectEdgeShape();

    const onEdgeReattachPrevented = jest.fn();
    const canvas = createCanvas({
      draggingEdgeShapeFactory: () => edgeShape,
      overlayElement,
      mainElement,
      onEdgeReattachPrevented,
      connectionPreprocessor: () => null,
    });

    document.body.appendChild(mainElement);
    document.body.appendChild(overlayElement);

    const portElement1 = createElement({ x: -5, y: -5, width: 10, height: 10 });
    const portElement2 = createElement({ x: 95, y: 95, width: 10, height: 10 });

    createGraph(canvas, { portElement1, portElement2 });

    portElement1.dispatchEvent(new MouseEvent("mousedown"));

    expect(overlayElement.children[0].children[0].children[2]).toBe(
      edgeShape.svg,
    );
  });

  it("should account for target port dragging", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const mainElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement, mainElement });

    document.body.appendChild(mainElement);
    document.body.appendChild(overlayElement);

    const portElement1 = document.createElement("div");
    const portElement2 = createElement({ x: 95, y: 95, width: 10, height: 10 });
    const portElement3 = createElement({ x: 95, y: -5, width: 10, height: 10 });
    const edgeShape = new BezierEdgeShape();

    createGraph(canvas, {
      portElement1,
      portElement2,
      portElement3,
      edgeShape,
    });

    portElement2.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 100 }),
    );
    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 0 }));
    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 100, clientY: 0 }),
    );

    expect(canvas.graph.getEdge(0)).toEqual({
      from: "node-1-1",
      to: "node-3-1",
      priority: 0,
      shape: edgeShape,
    });
  });
});
