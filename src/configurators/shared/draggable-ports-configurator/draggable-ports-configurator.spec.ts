import { Canvas } from "@/canvas";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import { createElement, createTouch, defaultCanvasParams } from "@/mocks";
import { ViewportStore } from "@/viewport-store";
import { DraggablePortsConfigurator } from "./draggable-ports-configurator";
import { Point } from "@/point";
import { MouseEventVerifier } from "../mouse-event-verifier";

const createDraggablePortsCanvas = (options?: {
  element?: HTMLElement;
  onPointerDown?: (portId: unknown, clientPoint: Point) => boolean;
  onPointerMove?: (clientPoint: Point) => void;
  onPointerUp?: (clientPoint: Point) => void;
  onStopDrag?: () => void;
  mouseDownEventVerifier?: MouseEventVerifier;
  mouseUpEventVerifier?: MouseEventVerifier;
}): Canvas => {
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore();
  const element =
    options?.element ?? createElement({ width: 1000, height: 1000 });
  const htmlView = new CoreHtmlView(graphStore, viewportStore, element);

  const canvas = new Canvas(
    element,
    graphStore,
    viewportStore,
    htmlView,
    defaultCanvasParams,
  );

  DraggablePortsConfigurator.configure(canvas, element, window, {
    onPortPointerDown: options?.onPointerDown ?? ((): boolean => true),
    onPointerMove: options?.onPointerMove ?? ((): void => {}),
    onPointerUp: options?.onPointerUp ?? ((): void => {}),
    onStopDrag: options?.onStopDrag ?? ((): void => {}),
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
  it("should call onPointerDown callback on mouse down", () => {
    const onPointerDown = jest.fn();
    const canvas = createDraggablePortsCanvas({ onPointerDown });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 200 }),
    );

    expect(onPointerDown).toHaveBeenCalledWith(0, { x: 100, y: 200 });
  });

  it("should not call onPointerDown callback when mouse event verifier not matched", () => {
    const onPointerDown = jest.fn();
    const mouseDownEventVerifier: MouseEventVerifier = () => false;

    const canvas = createDraggablePortsCanvas({
      onPointerDown,
      mouseDownEventVerifier,
    });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 200 }),
    );

    expect(onPointerDown).not.toHaveBeenCalled();
  });

  it("should stop event propagation when mouse event is accepted", () => {
    const onPointerDown = jest.fn(() => true);

    const canvas = createDraggablePortsCanvas({
      onPointerDown,
    });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    const event = new MouseEvent("mousedown", { clientX: 100, clientY: 200 });

    const spy = jest.spyOn(event, "stopPropagation");

    portElement.dispatchEvent(event);

    expect(spy).toHaveBeenCalled();
  });

  it("should call onPointerDown callback on touch start", () => {
    const onPointerDown = jest.fn();
    const canvas = createDraggablePortsCanvas({ onPointerDown });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 100, clientY: 200 })],
      }),
    );

    expect(onPointerDown).toHaveBeenCalledWith(0, { x: 100, y: 200 });
  });

  it("should not call onPointerDown callback when event has more than 1 touch", () => {
    const onPointerDown = jest.fn(() => true);

    const canvas = createDraggablePortsCanvas({
      onPointerDown,
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

    expect(onPointerDown).not.toHaveBeenCalled();
  });

  it("should stop event propagation when touch event is accepted", () => {
    const onPointerDown = jest.fn(() => true);

    const canvas = createDraggablePortsCanvas({
      onPointerDown,
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

  it("should call onPointerMove when mouse is outside", () => {
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

  it("should call onStopDrag when mouse is outside", () => {
    const onStopDrag = jest.fn();
    const canvas = createDraggablePortsCanvas({ onStopDrag });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 0, clientY: 0 }),
    );

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: -1, clientY: -1 }),
    );

    expect(onStopDrag).toHaveBeenCalled();
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

  it("should call onStopDrag when touch is outside", () => {
    const onStopDrag = jest.fn();
    const canvas = createDraggablePortsCanvas({ onStopDrag });

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

    expect(onStopDrag).toHaveBeenCalled();
  });

  it("should call onStopDrag on mouse up", () => {
    const onStopDrag = jest.fn();
    const canvas = createDraggablePortsCanvas({ onStopDrag });

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

    expect(onStopDrag).toHaveBeenCalled();
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

  it("should  not call onPointerUp when mouse up event verifier fails", () => {
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

  it("should call onStopDrag on touch end", () => {
    const onStopDrag = jest.fn();
    const canvas = createDraggablePortsCanvas({ onStopDrag });

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

    window.dispatchEvent(
      new TouchEvent("touchend", {
        changedTouches: [createTouch({ clientX: 100, clientY: 200 })],
      }),
    );

    expect(onStopDrag).toHaveBeenCalled();
  });

  it("should call onStopDrag on touch cancel", () => {
    const onStopDrag = jest.fn();
    const canvas = createDraggablePortsCanvas({ onStopDrag });

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

    window.dispatchEvent(
      new TouchEvent("touchcancel", {
        changedTouches: [createTouch({ clientX: 100, clientY: 200 })],
      }),
    );

    expect(onStopDrag).toHaveBeenCalled();
  });

  it("should call onPointerDown for unmarked port", () => {
    const onPointerDown = jest.fn();
    const canvas = createDraggablePortsCanvas({ onPointerDown });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);
    canvas.unmarkPort(0);

    portElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 200 }),
    );

    expect(onPointerDown).not.toHaveBeenCalled();
  });

  it("should call onPointerDown after clear", () => {
    const onPointerDown = jest.fn();
    const canvas = createDraggablePortsCanvas({ onPointerDown });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);
    canvas.clear();

    portElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 200 }),
    );

    expect(onPointerDown).not.toHaveBeenCalled();
  });

  it("should not call onStopDrag when mouse event verifier fails", () => {
    const onStopDrag = jest.fn();
    const canvas = createDraggablePortsCanvas({
      onStopDrag,
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

    expect(onStopDrag).not.toHaveBeenCalled();
  });

  it("should call onStopDrag on destroy", () => {
    const onStopDrag = jest.fn();
    const canvas = createDraggablePortsCanvas({
      onStopDrag,
    });

    canvas.destroy();

    expect(onStopDrag).toHaveBeenCalled();
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

  it("should not call onPointerMove error when canvas destroyed before mouse up", () => {
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
