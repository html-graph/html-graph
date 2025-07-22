import { AddEdgeRequest, Canvas, CanvasParams } from "@/canvas";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import { ViewportStore } from "@/viewport-store";
import { UserConnectablePortsConfigurator } from "./user-connectable-ports-configurator";
import { createElement, createMouseMoveEvent } from "@/mocks";
import { UserConnectablePortsParams } from "./user-connectable-ports-params";
import { BezierEdgeShape } from "@/edges";
import { ConnectionTypeResolver } from "./connection-type-resolver";
import { ConnectionPreprocessor } from "../shared";
import { standardCenterFn } from "@/center-fn";

const createCanvas = (options?: {
  mainElement?: HTMLElement;
  overlayElement?: HTMLElement;
  connectionTypeResolver?: ConnectionTypeResolver;
  connectionPreprocessor?: ConnectionPreprocessor;
  onAfterEdgeCreated?: (edgeId: unknown) => void;
  onEdgeCreationInterrupted?: () => void;
  onEdgeCreationPrevented?: () => void;
}): Canvas => {
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore();
  const mainElement =
    options?.mainElement ?? createElement({ width: 1000, height: 1000 });
  const overlayElement =
    options?.overlayElement ?? createElement({ width: 1000, height: 1000 });
  const htmlView = new CoreHtmlView(graphStore, viewportStore, mainElement);

  const canvasParams: CanvasParams = {
    nodes: {
      centerFn: standardCenterFn,
      priorityFn: () => 0,
    },
    ports: {
      direction: 0,
    },
    edges: {
      shapeFactory: () => new BezierEdgeShape(),
      priorityFn: () => 0,
    },
  };

  const canvas = new Canvas(
    mainElement,
    graphStore,
    viewportStore,
    htmlView,
    canvasParams,
  );

  const params: UserConnectablePortsParams = {
    edgeShapeFactory: () => new BezierEdgeShape(),
    connectionTypeResolver:
      options?.connectionTypeResolver ?? ((): "direct" | "reverse" => "direct"),
    mouseDownEventVerifier: (event: MouseEvent) => event.button === 0,
    mouseUpEventVerifier: (event: MouseEvent) => event.button === 0,
    connectionPreprocessor:
      options?.connectionPreprocessor ??
      ((request): AddEdgeRequest | null => request),
    onAfterEdgeCreated: options?.onAfterEdgeCreated ?? ((): void => {}),
    onEdgeCreationInterrupted:
      options?.onEdgeCreationInterrupted ?? ((): void => {}),
    onEdgeCreationPrevented:
      options?.onEdgeCreationPrevented ?? ((): void => {}),
    dragPortDirection: 0,
  };

  UserConnectablePortsConfigurator.configure(
    canvas,
    overlayElement,
    viewportStore,
    window,
    params,
  );

  return canvas;
};

const createNode = (canvas: Canvas, portElement: HTMLElement): void => {
  const nodeElement = document.createElement("div");
  nodeElement.appendChild(portElement);

  canvas.addNode({
    element: nodeElement,
    x: 0,
    y: 0,
    ports: [{ element: portElement }],
  });
};

describe("UserConnectablePortsConfigurator", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should create overlay graph on port mouse grab", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(new MouseEvent("mousedown"));

    expect(overlayElement.children[0].children[0].children.length).toBe(3);
  });

  it("should not create overlay graph when event verifier not matched", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      overlayElement,
    });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(new MouseEvent("mousedown", { button: 1 }));

    expect(overlayElement.children[0].children[0].children.length).toBe(0);
  });

  it("should not create overlay graph connection type is null", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      overlayElement,
      connectionTypeResolver: () => null,
    });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(new MouseEvent("mousedown"));

    expect(overlayElement.children[0].children[0].children.length).toBe(0);
  });

  it("should create source node at static port center", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement = createElement({ width: 10, height: 10 });
    createNode(canvas, portElement);

    portElement.dispatchEvent(new MouseEvent("mousedown"));

    const overlayNodeElement = overlayElement.children[0].children[0]
      .children[0] as HTMLElement;

    expect(overlayNodeElement.style.transform).toBe("translate(5px, 5px)");
  });

  it("should create target node at cursor", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 10, clientY: 10 }),
    );

    const overlayNodeElement = overlayElement.children[0].children[0]
      .children[1] as HTMLElement;

    expect(overlayNodeElement.style.transform).toBe("translate(10px, 10px)");
  });

  it("should create target node at static port center when connection type is reverse", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      overlayElement,
      connectionTypeResolver: () => "reverse",
    });

    const portElement = createElement({ width: 10, height: 10 });
    createNode(canvas, portElement);

    portElement.dispatchEvent(new MouseEvent("mousedown"));

    const overlayNodeElement = overlayElement.children[0].children[0]
      .children[1] as HTMLElement;

    expect(overlayNodeElement.style.transform).toBe("translate(5px, 5px)");
  });

  it("should create source node at cursor when connection type is reverse", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      overlayElement,
      connectionTypeResolver: () => "reverse",
    });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 10, clientY: 10 }),
    );

    const overlayNodeElement = overlayElement.children[0].children[0]
      .children[0] as HTMLElement;

    expect(overlayNodeElement.style.transform).toBe("translate(10px, 10px)");
  });

  it("should move target port on port pointer move", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 100 }));

    const targetNodeElement = overlayElement.children[0].children[0]
      .children[1] as HTMLElement;
    expect(targetNodeElement.style.transform).toBe("translate(100px, 100px)");
  });

  it("should clear overlay graph when pointer moving target port outside", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: -10, clientY: -10 }));

    expect(overlayElement.children[0].children[0].children.length).toBe(0);
  });

  it("should create connection on pointer release", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const mainElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement, mainElement });

    document.body.appendChild(mainElement);
    document.body.appendChild(overlayElement);

    const portSourceElement = createElement({
      x: -5,
      y: -5,
      width: 10,
      height: 10,
    });
    createNode(canvas, portSourceElement);

    const portTargetElement = createElement({
      x: 95,
      y: 95,
      width: 10,
      height: 10,
    });
    createNode(canvas, portTargetElement);

    portSourceElement.dispatchEvent(new MouseEvent("mousedown"));
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

    const portSourceElement = createElement({
      x: -5,
      y: -5,
      width: 10,
      height: 10,
    });
    createNode(canvas, portSourceElement);

    const portTargetElement = createElement({
      x: 95,
      y: 95,
      width: 10,
      height: 10,
    });
    createNode(canvas, portTargetElement);

    portSourceElement.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 110, clientY: 110 }));
    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 110, clientY: 110 }),
    );

    expect(canvas.graph.getAllEdgeIds().length).toBe(0);
  });

  it("should create reverse connection", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const mainElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      overlayElement,
      mainElement,
      connectionTypeResolver: () => "reverse",
    });

    document.body.appendChild(mainElement);
    document.body.appendChild(overlayElement);

    const portSourceElement = createElement({
      x: -5,
      y: -5,
      width: 10,
      height: 10,
    });
    createNode(canvas, portSourceElement);

    const portTargetElement = createElement({
      x: 95,
      y: 95,
      width: 10,
      height: 10,
    });
    createNode(canvas, portTargetElement);

    portSourceElement.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 100 }));
    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 100, clientY: 100 }),
    );

    expect(canvas.graph.getEdge(0)).toStrictEqual(
      expect.objectContaining({ from: 1, to: 0 }),
    );
  });

  it("should call specified callback after edge creation", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const mainElement = createElement({ width: 1000, height: 1000 });

    const onAfterEdgeCreated = jest.fn();
    const canvas = createCanvas({
      overlayElement,
      mainElement,
      onAfterEdgeCreated,
    });

    document.body.appendChild(mainElement);
    document.body.appendChild(overlayElement);

    const portSourceElement = createElement({
      x: -5,
      y: -5,
      width: 10,
      height: 10,
    });
    createNode(canvas, portSourceElement);

    const portTargetElement = createElement({
      x: 95,
      y: 95,
      width: 10,
      height: 10,
    });
    createNode(canvas, portTargetElement);

    portSourceElement.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 100 }));
    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 100, clientY: 100 }),
    );

    expect(onAfterEdgeCreated).toHaveBeenCalledWith(0);
  });

  it("should call specified callback on edge creation interruption", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const mainElement = createElement({ width: 1000, height: 1000 });

    const onEdgeCreationInterrupted = jest.fn();
    const canvas = createCanvas({
      overlayElement,
      mainElement,
      onEdgeCreationInterrupted,
    });

    document.body.appendChild(mainElement);
    document.body.appendChild(overlayElement);

    const portSourceElement = createElement({
      x: -5,
      y: -5,
      width: 10,
      height: 10,
    });
    createNode(canvas, portSourceElement);

    const portTargetElement = createElement({
      x: 95,
      y: 95,
      width: 10,
      height: 10,
    });
    createNode(canvas, portTargetElement);

    portSourceElement.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 50, clientY: 50 }));
    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 50, clientY: 50 }),
    );

    expect(onEdgeCreationInterrupted).toHaveBeenCalledWith(0, true);
  });

  it("should call specified callback on edge creation prevention", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const mainElement = createElement({ width: 1000, height: 1000 });

    const onEdgeCreationPrevented = jest.fn();
    const canvas = createCanvas({
      overlayElement,
      mainElement,
      onEdgeCreationPrevented,
      connectionPreprocessor: () => null,
    });

    document.body.appendChild(mainElement);
    document.body.appendChild(overlayElement);

    const portSourceElement = createElement({
      x: -5,
      y: -5,
      width: 10,
      height: 10,
    });
    createNode(canvas, portSourceElement);

    const portTargetElement = createElement({
      x: 95,
      y: 95,
      width: 10,
      height: 10,
    });
    createNode(canvas, portTargetElement);

    portSourceElement.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 100 }));
    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 100, clientY: 100 }),
    );

    expect(onEdgeCreationPrevented).toHaveBeenCalledWith({ from: 0, to: 1 });
  });
});
