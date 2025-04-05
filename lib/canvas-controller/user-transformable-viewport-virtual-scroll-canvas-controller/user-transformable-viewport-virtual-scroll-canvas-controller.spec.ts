import { UserTransformableViewportVirtualScrollCanvasController } from "./user-transformable-viewport-virtual-scroll-canvas-controller";
import { EventSubject } from "@/event-subject";
import { BoxHtmlView, CoreHtmlView, RenderingBox } from "@/html-view";
import { CanvasController } from "../canvas-controller";
import { CoreCanvasController } from "../core-canvas-controller";
import { TransformOptions } from "../user-transformable-viewport-canvas-controller";
import { standardCenterFn } from "@/center-fn";
import { BezierEdgeShape } from "@/edges";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import {
  createElement,
  createMouseMoveEvent,
  createMouseWheelEvent,
  triggerResizeFor,
  wait,
} from "@/mocks";

const create = (
  transformOptions?: TransformOptions,
): {
  canvas: UserTransformableViewportVirtualScrollCanvasController;
  coreCanvas: CoreCanvasController;
} => {
  const trigger = new EventSubject<RenderingBox>();
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore();
  const coreCanvas = new CoreCanvasController(
    graphStore,
    viewportStore,
    new BoxHtmlView(
      new CoreHtmlView(graphStore, viewportStore),
      graphStore,
      trigger,
    ),
  );

  const canvas = new UserTransformableViewportVirtualScrollCanvasController(
    coreCanvas,
    trigger,
    transformOptions,
    {
      nodeContainingRadius: {
        vertical: 25,
        horizontal: 25,
      },
    },
  );
  return { canvas, coreCanvas };
};

const configureEdgeGraph = (canvas: CanvasController): void => {
  canvas.addNode({
    id: "node-1",
    element: document.createElement("div"),
    x: 0,
    y: 0,
    centerFn: standardCenterFn,
    priority: 0,
  });

  canvas.markPort({
    id: "port-1",
    nodeId: "node-1",
    element: document.createElement("div"),
    direction: 0,
  });

  canvas.addNode({
    id: "node-2",
    element: document.createElement("div"),
    x: 300,
    y: 300,
    centerFn: standardCenterFn,
    priority: 0,
  });

  canvas.markPort({
    id: "port-2",
    nodeId: "node-2",
    element: document.createElement("div"),
    direction: 0,
  });

  canvas.addNode({
    id: "node-3",
    element: document.createElement("div"),
    x: 600,
    y: 600,
    centerFn: standardCenterFn,
    priority: 0,
  });

  canvas.markPort({
    id: "port-3",
    nodeId: "node-3",
    element: document.createElement("div"),
    direction: 0,
  });

  canvas.addEdge({
    id: "edge-1",
    from: "port-1",
    to: "port-2",
    shape: new BezierEdgeShape(),
    priority: 0,
  });

  canvas.addEdge({
    id: "edge-2",
    from: "port-2",
    to: "port-3",
    shape: new BezierEdgeShape(),
    priority: 0,
  });
};

describe("UserTransformableViewportVirtualScrollCanvasController", () => {
  it("should call attach on canvas", () => {
    const { canvas, coreCanvas } = create();
    const canvasElement = document.createElement("div");

    const spy = jest.spyOn(coreCanvas, "attach");

    canvas.attach(canvasElement);

    expect(spy).toHaveBeenCalledWith(canvasElement);
  });

  it("should call detach on canvas", () => {
    const { canvas, coreCanvas } = create();
    const canvasElement = document.createElement("div");

    const spy = jest.spyOn(coreCanvas, "detach");

    canvas.attach(canvasElement);
    canvas.detach();

    expect(spy).toHaveBeenCalled();
  });

  it("should call addNode on canvas", () => {
    const { canvas, coreCanvas } = create();

    const spy = jest.spyOn(coreCanvas, "addNode");

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    expect(spy).toHaveBeenCalled();
  });

  it("should call updateNode on canvas", () => {
    const { canvas, coreCanvas } = create();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    const spy = jest.spyOn(coreCanvas, "updateNode");

    canvas.updateNode("node-1", {});

    expect(spy).toHaveBeenCalled();
  });

  it("should call removeNode on canvas", () => {
    const { canvas, coreCanvas } = create();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    const spy = jest.spyOn(coreCanvas, "removeNode");

    canvas.removeNode("node-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should call markPort on canvas", () => {
    const { canvas, coreCanvas } = create();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    const spy = jest.spyOn(coreCanvas, "markPort");

    canvas.markPort({
      id: "port-1",
      element: document.createElement("div"),
      nodeId: "node-1",
      direction: 0,
    });

    expect(spy).toHaveBeenCalled();
  });

  it("should call updatePort on canvas", () => {
    const { canvas, coreCanvas } = create();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    const spy = jest.spyOn(coreCanvas, "updatePort");

    canvas.updatePort("port-1", {});

    expect(spy).toHaveBeenCalled();
  });

  it("should call unmarkPort on canvas", () => {
    const { canvas, coreCanvas } = create();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    const spy = jest.spyOn(coreCanvas, "unmarkPort");

    canvas.unmarkPort("port-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should call addEdge on canvas", () => {
    const { canvas, coreCanvas } = create();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    const spy = jest.spyOn(coreCanvas, "addEdge");

    canvas.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new BezierEdgeShape(),
      priority: 0,
    });

    expect(spy).toHaveBeenCalled();
  });

  it("should call updateEdge on canvas", () => {
    const { canvas, coreCanvas } = create();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    canvas.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new BezierEdgeShape(),
      priority: 0,
    });

    const spy = jest.spyOn(coreCanvas, "updateEdge");

    canvas.updateEdge("edge-1", {});

    expect(spy).toHaveBeenCalled();
  });

  it("should call removeEdge on canvas", () => {
    const { canvas, coreCanvas } = create();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    canvas.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    canvas.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new BezierEdgeShape(),
      priority: 0,
    });

    const spy = jest.spyOn(coreCanvas, "removeEdge");

    canvas.removeEdge("edge-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should call patchViewportMatrix on canvas", () => {
    const { canvas, coreCanvas } = create();

    const spy = jest.spyOn(coreCanvas, "patchViewportMatrix");

    canvas.patchViewportMatrix({});

    expect(spy).toHaveBeenCalled();
  });

  it("should call patchContentMatrix on canvas", () => {
    const { canvas, coreCanvas } = create();

    const spy = jest.spyOn(coreCanvas, "patchContentMatrix");

    canvas.patchContentMatrix({});

    expect(spy).toHaveBeenCalled();
  });

  it("should call clear on canvas", () => {
    const { canvas, coreCanvas } = create();

    const spy = jest.spyOn(coreCanvas, "clear");

    canvas.clear();

    expect(spy).toHaveBeenCalled();
  });

  it("should call destroy on canvas", () => {
    const { canvas, coreCanvas } = create();

    const spy = jest.spyOn(coreCanvas, "destroy");

    canvas.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should load elements around viewport on next tick", async () => {
    const { canvas } = create();
    const canvasElement = createElement({ width: 100, height: 100 });
    canvas.attach(canvasElement);

    configureEdgeGraph(canvas);

    await wait(0);

    const container = canvasElement.children[0].children[0];
    expect(container.children.length).toBe(3);
  });

  it("should load elements around viewport on next tick after resize", async () => {
    const { canvas } = create();
    const canvasElement = createElement({ width: 100, height: 100 });
    canvas.attach(canvasElement);

    configureEdgeGraph(canvas);

    await wait(0);

    canvasElement.getBoundingClientRect = (): DOMRect => {
      return new DOMRect(0, 0, 200, 200);
    };

    triggerResizeFor(canvasElement);

    await wait(0);

    const container = canvasElement.children[0].children[0];
    expect(container.children.length).toBe(5);
  });

  it("should load elements around viewport after patch viewport matrix", async () => {
    const { canvas } = create();
    const canvasElement = createElement({ width: 100, height: 100 });
    canvas.attach(canvasElement);

    configureEdgeGraph(canvas);

    await wait(0);

    canvas.patchViewportMatrix({ x: 250, y: 250 });

    const container = canvasElement.children[0].children[0];
    expect(container.children.length).toBe(5);
  });

  it("should load elements around viewport after patch content matrix", async () => {
    const { canvas } = create();
    const canvasElement = createElement({ width: 100, height: 100 });
    canvas.attach(canvasElement);

    configureEdgeGraph(canvas);

    await wait(0);

    canvas.patchContentMatrix({ x: -250, y: -250 });

    const container = canvasElement.children[0].children[0];
    expect(container.children.length).toBe(5);
  });

  it("should load elements around viewport after translate viewport finish on next tick", async () => {
    const { canvas } = create();
    const canvasElement = createElement({ width: 100, height: 100 });
    canvas.attach(canvasElement);

    configureEdgeGraph(canvas);

    await wait(0);

    canvasElement.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({
      movementX: -100,
      movementY: -100,
    });
    window.dispatchEvent(moveEvent);

    window.dispatchEvent(new MouseEvent("mouseup", { button: 0 }));

    await wait(0);

    const container = canvasElement.children[0].children[0];
    expect(container.children.length).toBe(5);
  });

  it("should load elements around viewport on wheel scale when reached outside of viewport on next tick", async () => {
    const { canvas } = create({
      scale: {
        mouseWheelSensitivity: 10,
      },
    });

    const canvasElement = createElement({ width: 100, height: 100 });
    canvas.attach(canvasElement);

    configureEdgeGraph(canvas);

    await wait(0);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    canvasElement.dispatchEvent(wheelEvent);

    await wait(0);

    const container = canvasElement.children[0].children[0];
    expect(container.children.length).toBe(5);
  });

  it("should call specifined onTransformChange", async () => {
    const onTransformChange = jest.fn();

    const { canvas } = create({
      events: {
        onTransformChange: onTransformChange,
      },
    });

    const canvasElement = createElement({ width: 100, height: 100 });
    canvas.attach(canvasElement);

    configureEdgeGraph(canvas);

    await wait(0);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    canvasElement.dispatchEvent(wheelEvent);

    expect(onTransformChange).toHaveBeenCalled();
  });

  it("should call specifined onTransformFinished", async () => {
    const onTransformFinished = jest.fn();

    const { canvas } = create({
      events: {
        onTransformFinished: onTransformFinished,
      },
    });

    const canvasElement = createElement({ width: 100, height: 100 });
    canvas.attach(canvasElement);

    configureEdgeGraph(canvas);

    await wait(0);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    canvasElement.dispatchEvent(wheelEvent);

    await wait(500);

    expect(onTransformFinished).toHaveBeenCalled();
  });

  it("should not load elements around viewport on wheel scale when not reached outside of viewport on next tick", async () => {
    const { canvas } = create({
      scale: {
        mouseWheelSensitivity: 1.1,
      },
    });

    const canvasElement = createElement({ width: 100, height: 100 });
    canvas.attach(canvasElement);

    configureEdgeGraph(canvas);

    await wait(0);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    canvasElement.dispatchEvent(wheelEvent);

    await wait(0);

    const container = canvasElement.children[0].children[0];
    expect(container.children.length).toBe(3);
  });
});
