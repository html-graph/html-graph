import { Canvas } from "@/canvas";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import {
  createElement,
  createTouch,
  defaultGraphControllerParams,
  defaultViewportControllerParams,
} from "@/mocks";
import { ViewportStore } from "@/viewport-store";
import { DraggablePortsConfigurator } from "./draggable-ports-configurator";
import { Point } from "@/point";
import { MouseEventVerifier } from "../mouse-event-verifier";
import { Identifier } from "@/identifier";
import { Graph } from "@/graph";
import { Viewport } from "@/viewport";
import { GraphController } from "@/graph-controller";
import { ViewportController } from "@/viewport-controller";
import { PointInsideVerifier } from "../point-inside-verifier";

const createDraggablePortsCanvas = (options?: {
  element?: HTMLElement;
  portDragAllowedVerifier?: (portId: Identifier, clientPoint: Point) => boolean;
  onPointerMove?: (clientPoint: Point) => void;
  onPointerMoveOutside?: () => void;
  onPointerUp?: (clientPoint: Point) => void;
  mouseDownEventVerifier?: MouseEventVerifier;
  mouseUpEventVerifier?: MouseEventVerifier;
}): Canvas => {
  const graphStore = new GraphStore();
  const element =
    options?.element ?? createElement({ width: 1000, height: 1000 });
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

  DraggablePortsConfigurator.configure(canvas, window, pointInsideVerifier, {
    portDragAllowedVerifier:
      options?.portDragAllowedVerifier ?? ((): boolean => true),
    onPointerMove: options?.onPointerMove ?? ((): void => {}),
    onPointerOutside: options?.onPointerMoveOutside ?? ((): void => {}),
    onPointerUp: options?.onPointerUp ?? ((): void => {}),
    mouseDownEventVerifier:
      options?.mouseDownEventVerifier ?? ((): boolean => true),
    mouseUpEventVerifier:
      options?.mouseUpEventVerifier ?? ((): boolean => true),
  });

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

describe("DraggablePortsConfigurator", () => {
  it("should call portDragAllowedVerifier callback on mouse down", () => {
    const portDragAllowedVerifier = jest.fn();
    const canvas = createDraggablePortsCanvas({ portDragAllowedVerifier });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 200 }),
    );

    expect(portDragAllowedVerifier).toHaveBeenCalledWith(0, { x: 100, y: 200 });
  });

  it("should not call portDragAllowedVerifier callback when mouse event verifier not matched", () => {
    const portDragAllowedVerifier = jest.fn();
    const mouseDownEventVerifier: MouseEventVerifier = () => false;

    const canvas = createDraggablePortsCanvas({
      portDragAllowedVerifier,
      mouseDownEventVerifier,
    });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 200 }),
    );

    expect(portDragAllowedVerifier).not.toHaveBeenCalled();
  });

  it("should stop event propagation when mouse event is accepted", () => {
    const portDragAllowedVerifier = jest.fn(() => true);

    const canvas = createDraggablePortsCanvas({
      portDragAllowedVerifier,
    });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    const event = new MouseEvent("mousedown", { clientX: 100, clientY: 200 });

    const spy = jest.spyOn(event, "stopPropagation");

    portElement.dispatchEvent(event);

    expect(spy).toHaveBeenCalled();
  });

  it("should call portDragAllowedVerifier callback on touch start", () => {
    const portDragAllowedVerifier = jest.fn();
    const canvas = createDraggablePortsCanvas({ portDragAllowedVerifier });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 100, clientY: 200 })],
      }),
    );

    expect(portDragAllowedVerifier).toHaveBeenCalledWith(0, { x: 100, y: 200 });
  });

  it("should not call portDragAllowedVerifier callback when event has more than 1 touch", () => {
    const portDragAllowedVerifier = jest.fn(() => true);

    const canvas = createDraggablePortsCanvas({
      portDragAllowedVerifier,
    });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [
          createTouch({ clientX: 100, clientY: 200 }),
          createTouch({ clientX: 200, clientY: 200 }),
        ],
      }),
    );

    expect(portDragAllowedVerifier).not.toHaveBeenCalled();
  });

  it("should stop event propagation when touch event is accepted", () => {
    const portDragAllowedVerifier = jest.fn(() => true);

    const canvas = createDraggablePortsCanvas({
      portDragAllowedVerifier,
    });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    const event = new TouchEvent("touchstart", {
      touches: [createTouch({ clientX: 100, clientY: 200 })],
    });

    const spy = jest.spyOn(event, "stopPropagation");

    portElement.dispatchEvent(event);

    expect(spy).toHaveBeenCalled();
  });

  it("should call onPointerMove on mouse move", () => {
    const onPointerMove = jest.fn();
    const canvas = createDraggablePortsCanvas({ onPointerMove });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 0, clientY: 0 }),
    );

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 100, clientY: 200 }),
    );

    expect(onPointerMove).toHaveBeenCalledWith({ x: 100, y: 200 });
  });

  it("should not call onPointerMove when mouse is outside", () => {
    const onPointerMove = jest.fn();
    const canvas = createDraggablePortsCanvas({ onPointerMove });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 0, clientY: 0 }),
    );

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: -1, clientY: -1 }),
    );

    expect(onPointerMove).not.toHaveBeenCalled();
  });

  it("should call onPointerMoveOutside when mouse is outside", () => {
    const onPointerMoveOutside = jest.fn();
    const canvas = createDraggablePortsCanvas({ onPointerMoveOutside });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 0, clientY: 0 }),
    );

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: -1, clientY: -1 }),
    );

    expect(onPointerMoveOutside).toHaveBeenCalled();
  });

  it("should call onPointerMove on touch move", () => {
    const onPointerMove = jest.fn();
    const canvas = createDraggablePortsCanvas({ onPointerMove });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 100, clientY: 200 })],
      }),
    );

    expect(onPointerMove).toHaveBeenCalledWith({ x: 100, y: 200 });
  });

  it("should not call onPointerMove when touch is outside", () => {
    const onPointerMove = jest.fn();
    const canvas = createDraggablePortsCanvas({ onPointerMove });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: -1, clientY: -1 })],
      }),
    );

    expect(onPointerMove).not.toHaveBeenCalled();
  });

  it("should call onPointerMoveOutside when touch is outside", () => {
    const onPointerMoveOutside = jest.fn();
    const canvas = createDraggablePortsCanvas({ onPointerMoveOutside });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: -1, clientY: -1 })],
      }),
    );

    expect(onPointerMoveOutside).toHaveBeenCalled();
  });

  it("should call onPointerUp on mouse up", () => {
    const onPointerUp = jest.fn();
    const canvas = createDraggablePortsCanvas({ onPointerUp });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 0, clientY: 0 }),
    );

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 100, clientY: 200 }),
    );

    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 100, clientY: 200 }),
    );

    expect(onPointerUp).toHaveBeenCalledWith({ x: 100, y: 200 });
  });

  it("should call onPointerUp on touch end", () => {
    const onPointerUp = jest.fn();
    const canvas = createDraggablePortsCanvas({ onPointerUp });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchend", {
        changedTouches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    expect(onPointerUp).toHaveBeenCalledWith({ x: 100, y: 100 });
  });

  it("should not call onPointerUp when mouse up event verifier fails", () => {
    const onPointerUp = jest.fn();
    const canvas = createDraggablePortsCanvas({
      onPointerUp,
      mouseUpEventVerifier: () => false,
    });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 0, clientY: 0 }),
    );

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 100, clientY: 200 }),
    );

    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 100, clientY: 200 }),
    );

    expect(onPointerUp).not.toHaveBeenCalledWith();
  });

  it("should call portDragAllowedVerifier for unmarked port", () => {
    const portDragAllowedVerifier = jest.fn();
    const canvas = createDraggablePortsCanvas({ portDragAllowedVerifier });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);
    canvas.unmarkPort(0);

    portElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 200 }),
    );

    expect(portDragAllowedVerifier).not.toHaveBeenCalled();
  });

  it("should not call portDragAllowedVerifier after clear", () => {
    const portDragAllowedVerifier = jest.fn();
    const canvas = createDraggablePortsCanvas({ portDragAllowedVerifier });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);
    canvas.clear();

    portElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 200 }),
    );

    expect(portDragAllowedVerifier).not.toHaveBeenCalled();
  });

  it("should not call portDragAllowedVerifier after destroy", () => {
    const portDragAllowedVerifier = jest.fn();
    const canvas = createDraggablePortsCanvas({ portDragAllowedVerifier });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);
    canvas.destroy();

    portElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 200 }),
    );

    expect(portDragAllowedVerifier).not.toHaveBeenCalled();
  });

  it("should not call onPointerMove error when canvas destroyed in the process of dragging with mouse", () => {
    const onPointerMove = jest.fn();
    const canvas = createDraggablePortsCanvas({ onPointerMove });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 0, clientY: 0 }),
    );

    canvas.destroy();

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 100, clientY: 200 }),
    );

    expect(onPointerMove).not.toHaveBeenCalled();
  });

  it("should not call onPointerMove error when canvas destroyed in the process of dragging with touch", () => {
    const onPointerMove = jest.fn();
    const canvas = createDraggablePortsCanvas({ onPointerMove });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    canvas.destroy();

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 100, clientY: 200 })],
      }),
    );

    expect(onPointerMove).not.toHaveBeenCalled();
  });

  it("should not call onPointerUp error when canvas destroyed before mouse up", () => {
    const onPointerUp = jest.fn();
    const canvas = createDraggablePortsCanvas({ onPointerUp });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 0, clientY: 0 }),
    );

    canvas.destroy();

    window.dispatchEvent(new MouseEvent("mouseup", { clientX: 0, clientY: 0 }));

    expect(onPointerUp).not.toHaveBeenCalled();
  });

  it("should not call onPointerMove error when canvas destroyed before touch end", () => {
    const onPointerMove = jest.fn();
    const canvas = createDraggablePortsCanvas({ onPointerMove });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    canvas.destroy();

    window.dispatchEvent(
      new TouchEvent("touchend", {
        changedTouches: [createTouch({ clientX: 100, clientY: 200 })],
      }),
    );

    expect(onPointerMove).not.toHaveBeenCalled();
  });

  it("should not call onPointerMove error when canvas destroyed before touch cancel", () => {
    const onPointerMove = jest.fn();
    const canvas = createDraggablePortsCanvas({ onPointerMove });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    canvas.destroy();

    window.dispatchEvent(
      new TouchEvent("touchcancel", {
        changedTouches: [createTouch({ clientX: 100, clientY: 200 })],
      }),
    );

    expect(onPointerMove).not.toHaveBeenCalled();
  });
});
