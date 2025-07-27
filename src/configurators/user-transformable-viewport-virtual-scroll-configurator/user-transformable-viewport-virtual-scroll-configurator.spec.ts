import { EventSubject } from "@/event-subject";
import { BoxHtmlView, CoreHtmlView, RenderingBox } from "@/html-view";
import { standardCenterFn } from "@/center-fn";
import { BezierEdgeShape } from "@/edges";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import {
  createElement,
  createMouseMoveEvent,
  createMouseWheelEvent,
  defaultCanvasParams,
  triggerResizeFor,
  wait,
} from "@/mocks";
import { Canvas } from "@/canvas";
import { UserTransformableViewportVirtualScrollConfigurator } from "./user-transformable-viewport-virtual-scroll-configurator";
import { TransformableViewportParams } from "../user-transformable-viewport-configurator";

const createCanvas = (options?: {
  element?: HTMLElement;
  wheelSensitivity?: number;
  onTransformFinished?: () => void;
  onBeforeTransformChange?: () => void;
  onTransformChange?: () => void;
  onResizeTransformStarted?: () => void;
  onResizeTransformFinished?: () => void;
}): Canvas => {
  const trigger = new EventSubject<RenderingBox>();
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore();
  const element = options?.element ?? document.createElement("div");

  const htmlView = new BoxHtmlView(
    new CoreHtmlView(graphStore, viewportStore, element),
    graphStore,
    trigger,
    {
      onBeforeNodeAttached: (): void => {},
      onAfterNodeDetached: (): void => {},
    },
  );

  const canvas = new Canvas(
    element,
    graphStore,
    viewportStore,
    htmlView,
    defaultCanvasParams,
  );

  const transformParams: TransformableViewportParams = {
    wheelSensitivity: options?.wheelSensitivity ?? 1.2,
    onTransformStarted: (): void => {},
    onTransformFinished: options?.onTransformFinished ?? ((): void => {}),
    onBeforeTransformChange:
      options?.onBeforeTransformChange ?? ((): void => {}),
    onTransformChange: options?.onTransformChange ?? ((): void => {}),
    onResizeTransformStarted:
      options?.onResizeTransformStarted ?? ((): void => {}),
    onResizeTransformFinished:
      options?.onResizeTransformFinished ?? ((): void => {}),
    transformPreprocessor: (transform) => transform.nextTransform,
    shiftCursor: "grab",
    mouseDownEventVerifier: (event: MouseEvent) => event.button === 0,
    mouseUpEventVerifier: (event: MouseEvent) => event.button === 0,
    mouseWheelEventVerifier: () => true,
    scaleWheelFinishTimeout: 500,
  };

  UserTransformableViewportVirtualScrollConfigurator.configure(
    canvas,
    element,
    window,
    transformParams,
    trigger,
    {
      nodeVerticalRadius: 25,
      nodeHorizontalRadius: 25,
    },
  );

  return canvas;
};

const configureEdgeGraph = (canvas: Canvas): void => {
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
  it("should load elements around viewport on next tick", async () => {
    const element = createElement({ width: 100, height: 100 });
    const canvas = createCanvas({ element });

    configureEdgeGraph(canvas);

    await wait(0);

    const container = element.children[0].children[0];
    expect(container.children.length).toBe(3);
  });

  it("should load elements around viewport on next tick after resize", async () => {
    const element = createElement({ width: 100, height: 100 });
    const canvas = createCanvas({ element });

    configureEdgeGraph(canvas);

    await wait(0);

    element.getBoundingClientRect = (): DOMRect => {
      return new DOMRect(0, 0, 200, 200);
    };

    triggerResizeFor(element);

    await wait(0);

    const container = element.children[0].children[0];
    expect(container.children.length).toBe(5);
  });

  it("should load elements around viewport after patch viewport matrix", async () => {
    const element = createElement({ width: 100, height: 100 });
    const canvas = createCanvas({ element });

    configureEdgeGraph(canvas);

    await wait(0);

    canvas.patchViewportMatrix({ x: 250, y: 250 });

    const container = element.children[0].children[0];
    expect(container.children.length).toBe(5);
  });

  it("should load elements around viewport after patch content matrix", async () => {
    const element = createElement({ width: 100, height: 100 });
    const canvas = createCanvas({ element });

    configureEdgeGraph(canvas);

    await wait(0);

    canvas.patchContentMatrix({ x: -250, y: -250 });

    const container = element.children[0].children[0];
    expect(container.children.length).toBe(5);
  });

  it("should load elements around viewport after translate viewport finish on next tick", async () => {
    const element = createElement({ width: 100, height: 100 });
    const canvas = createCanvas({ element });

    configureEdgeGraph(canvas);

    await wait(0);

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({
      movementX: -100,
      movementY: -100,
    });
    window.dispatchEvent(moveEvent);

    window.dispatchEvent(new MouseEvent("mouseup", { button: 0 }));

    await wait(0);

    const container = element.children[0].children[0];
    expect(container.children.length).toBe(5);
  });

  it("should load elements around viewport on wheel scale when reached outside of viewport on next tick", async () => {
    const element = createElement({ width: 100, height: 100 });
    const canvas = createCanvas({
      wheelSensitivity: 10,
      element,
    });

    configureEdgeGraph(canvas);

    await wait(0);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    element.dispatchEvent(wheelEvent);

    await wait(0);

    const container = element.children[0].children[0];
    expect(container.children.length).toBe(5);
  });

  it("should call specified onTransformChange", async () => {
    const onTransformChange = jest.fn();
    const element = createElement({ width: 100, height: 100 });

    const canvas = createCanvas({
      onTransformChange,
      element,
    });

    configureEdgeGraph(canvas);

    await wait(0);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    element.dispatchEvent(wheelEvent);

    expect(onTransformChange).toHaveBeenCalled();
  });

  it("should call specified onTransformFinished", async () => {
    const onTransformFinished = jest.fn();
    const element = createElement({ width: 100, height: 100 });

    const canvas = createCanvas({
      onTransformFinished,
      element,
    });

    configureEdgeGraph(canvas);

    await wait(0);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    element.dispatchEvent(wheelEvent);

    await wait(500);

    expect(onTransformFinished).toHaveBeenCalled();
  });

  it("should not load elements around viewport on wheel scale when not reached outside of viewport on next tick", async () => {
    const element = createElement({ width: 100, height: 100 });
    const canvas = createCanvas({
      element,
      wheelSensitivity: 1.1,
    });

    configureEdgeGraph(canvas);

    await wait(0);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    element.dispatchEvent(wheelEvent);

    await wait(0);

    const container = element.children[0].children[0];
    expect(container.children.length).toBe(3);
  });

  it("should unsubscribe before destroy", () => {
    const canvas = createCanvas();

    canvas.destroy();
  });

  it("should call specified onResizeTransformStarted", async () => {
    const onResizeTransformStarted = jest.fn();
    const element = createElement({ width: 100, height: 100 });

    createCanvas({
      onResizeTransformStarted,
      element,
    });

    triggerResizeFor(element);

    expect(onResizeTransformStarted).toHaveBeenCalled();
  });

  it("should call specified onResizeTransformFinished", async () => {
    const onResizeTransformFinished = jest.fn();
    const element = createElement({ width: 100, height: 100 });

    createCanvas({
      onResizeTransformFinished,
      element,
    });

    triggerResizeFor(element);

    expect(onResizeTransformFinished).toHaveBeenCalled();
  });

  it("should call specified onBeforeTransformChange", async () => {
    const onBeforeTransformChange = jest.fn();
    const element = createElement({ width: 100, height: 100 });

    const canvas = createCanvas({
      onBeforeTransformChange,
      element,
    });

    configureEdgeGraph(canvas);

    await wait(0);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    element.dispatchEvent(wheelEvent);

    expect(onBeforeTransformChange).toHaveBeenCalled();
  });
});
