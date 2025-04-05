import { standardCenterFn } from "@/center-fn";
import { CanvasController } from "../canvas-controller";
import { CoreCanvasController } from "../core-canvas-controller";
import { UserTransformableViewportCanvasController } from "./user-transformable-viewport-canvas-controller";
import { BezierEdgeShape } from "@/edges";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { CoreHtmlView } from "@/html-view";
import {
  createElement,
  createMouseMoveEvent,
  createMouseWheelEvent,
  createTouch,
  wait,
} from "@/mocks";

let innerWidth: number;
let innerHeight: number;

const createCanvas = (): CanvasController => {
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore();

  return new CoreCanvasController(
    graphStore,
    viewportStore,
    new CoreHtmlView(graphStore, viewportStore),
  );
};

describe("UserTransformableViewportCanvasController", () => {
  beforeEach(() => {
    innerWidth = window.innerWidth;
    innerHeight = window.innerHeight;

    window.innerWidth = 1500;
    window.innerHeight = 1200;
  });

  afterEach(() => {
    window.innerWidth = innerWidth;
    window.innerHeight = innerHeight;
  });

  it("should call attach on canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);
    const canvasElement = document.createElement("div");

    const spy = jest.spyOn(coreCanvas, "attach");

    canvas.attach(canvasElement);

    expect(spy).toHaveBeenCalledWith(canvasElement);
  });

  it("should call detach on canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);
    const canvasElement = document.createElement("div");

    const spy = jest.spyOn(coreCanvas, "detach");

    canvas.attach(canvasElement);
    canvas.detach();

    expect(spy).toHaveBeenCalled();
  });

  it("should call addNode on canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);

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
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);

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
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);

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
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);

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
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);

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
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);

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
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);

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
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);

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
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);

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
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);

    const spy = jest.spyOn(coreCanvas, "patchViewportMatrix");

    canvas.patchViewportMatrix({});

    expect(spy).toHaveBeenCalled();
  });

  it("should call patchContentMatrix on canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);

    const spy = jest.spyOn(coreCanvas, "patchContentMatrix");

    canvas.patchContentMatrix({});

    expect(spy).toHaveBeenCalled();
  });

  it("should call clear on canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);

    const spy = jest.spyOn(coreCanvas, "clear");

    canvas.clear();

    expect(spy).toHaveBeenCalled();
  });

  it("should call destroy on canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);

    const spy = jest.spyOn(coreCanvas, "destroy");

    canvas.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should call detach on destroy canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);

    const spy = jest.spyOn(canvas, "detach");

    canvas.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should set cursor on mouse down", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);
    const element = createElement();

    canvas.attach(element);

    element.dispatchEvent(new MouseEvent("mousedown"));

    expect(element.style.cursor).toBe("grab");
  });

  it("should not set cursor on right mouse button down", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);
    const element = createElement();

    canvas.attach(element);

    element.dispatchEvent(new MouseEvent("mousedown", { button: 1 }));

    expect(element.style.cursor).toBe("");
  });

  it("should move canvas with mouse", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);
    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({ movementX: 100, movementY: 100 });

    window.dispatchEvent(moveEvent);

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 100, 100)");
  });

  it("should call onBeforeTransformChange for move with mouse", () => {
    const coreCanvas = createCanvas();
    const onBeforeTransformChange = jest.fn((): void => {});

    const canvas = new UserTransformableViewportCanvasController(coreCanvas, {
      events: {
        onBeforeTransformChange: onBeforeTransformChange,
      },
    });

    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({ movementX: 100, movementY: 100 });

    window.dispatchEvent(moveEvent);

    expect(onBeforeTransformChange).toHaveBeenCalled();
  });

  it("should call onTransformChange for move with mouse", () => {
    const coreCanvas = createCanvas();
    const onTransformChange = jest.fn((): void => {});

    const canvas = new UserTransformableViewportCanvasController(coreCanvas, {
      events: {
        onTransformChange: onTransformChange,
      },
    });

    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({ movementX: 100, movementY: 100 });

    window.dispatchEvent(moveEvent);

    expect(onTransformChange).toHaveBeenCalled();
  });

  it("should unset cursor after move with mouse finished", () => {
    const coreCanvas = createCanvas();
    const onTransformFinished = jest.fn((): void => {});

    const canvas = new UserTransformableViewportCanvasController(coreCanvas, {
      events: {
        onTransformChange: onTransformFinished,
      },
    });

    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({ movementX: 100, movementY: 100 });

    window.dispatchEvent(moveEvent);
    window.dispatchEvent(new MouseEvent("mouseup", { button: 0 }));

    expect(element.style.cursor).toBe("");
  });

  it("should not move canvas with mouse when pointer is outside of window", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);
    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({
      movementX: 100,
      movementY: 100,
      clientX: -100,
      clientY: 0,
    });

    window.dispatchEvent(moveEvent);

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 0, 0)");
  });

  it("should not move canvas with mouse when pointer is inside window but outside of element", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);
    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({
      movementX: 100,
      movementY: 100,
      clientX: 1100,
      clientY: 0,
    });

    window.dispatchEvent(moveEvent);

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 0, 0)");
  });

  it("should not unset cursor left mouse button was not releaseed", () => {
    const coreCanvas = createCanvas();
    const onTransformChange = jest.fn((): void => {});

    const canvas = new UserTransformableViewportCanvasController(coreCanvas, {
      events: {
        onTransformChange: onTransformChange,
      },
    });

    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({ movementX: 100, movementY: 100 });

    window.dispatchEvent(moveEvent);
    window.dispatchEvent(new MouseEvent("mouseup", { button: 1 }));

    expect(element.style.cursor).toBe("grab");
  });

  it("should scale canvas on mouse wheel scroll", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);
    const element = createElement({ width: 1000, height: 1000 });
    canvas.attach(element);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    element.dispatchEvent(wheelEvent);
    const container = element.children[0].children[0] as HTMLElement;

    const expectedScale = 1 / 1.2;

    expect(container.style.transform).toBe(
      `matrix(${expectedScale}, 0, 0, ${expectedScale}, 0, 0)`,
    );
  });

  it("should scale down canvas on mouse wheel scroll backward", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);
    const element = createElement({ width: 1000, height: 1000 });
    canvas.attach(element);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: -1,
    });

    element.dispatchEvent(wheelEvent);
    const container = element.children[0].children[0] as HTMLElement;

    const expectedScale = 1.2;

    expect(container.style.transform).toBe(
      `matrix(${expectedScale}, 0, 0, ${expectedScale}, 0, 0)`,
    );
  });

  it("should prevent default event of wheel scroll", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);
    const element = createElement({ width: 1000, height: 1000 });
    canvas.attach(element);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    const spy = jest.spyOn(wheelEvent, "preventDefault");

    element.dispatchEvent(wheelEvent);

    expect(spy).toHaveBeenCalled();
  });

  it("should call start event on mouse wheel scroll", () => {
    const coreCanvas = createCanvas();

    const onTransformStarted = jest.fn();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas, {
      events: {
        onTransformStarted: onTransformStarted,
      },
    });
    const element = createElement({ width: 1000, height: 1000 });
    canvas.attach(element);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    element.dispatchEvent(wheelEvent);

    expect(onTransformStarted).toHaveBeenCalled();
  });

  it("should call finish event on mouse wheel scroll", async () => {
    const coreCanvas = createCanvas();

    const onTransformFinished = jest.fn();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas, {
      events: {
        onTransformFinished: onTransformFinished,
      },
    });
    const element = createElement({ width: 1000, height: 1000 });
    canvas.attach(element);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    element.dispatchEvent(wheelEvent);

    await wait(500);
    expect(onTransformFinished).toHaveBeenCalled();
  });

  it("should call finish after 500ms span without events", async () => {
    const coreCanvas = createCanvas();

    const onTransformFinished = jest.fn();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas, {
      events: {
        onTransformFinished: onTransformFinished,
      },
    });
    const element = createElement({ width: 1000, height: 1000 });
    canvas.attach(element);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    element.dispatchEvent(wheelEvent);

    await wait(100);
    element.dispatchEvent(wheelEvent);
    await wait(500);

    expect(onTransformFinished).toHaveBeenCalledTimes(1);
  });

  it("should call start before finish on wheel scale", async () => {
    const coreCanvas = createCanvas();

    const onTransformStarted = jest.fn();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas, {
      events: {
        onTransformStarted: onTransformStarted,
      },
    });
    const element = createElement({ width: 1000, height: 1000 });
    canvas.attach(element);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    element.dispatchEvent(wheelEvent);
    await wait(100);
    element.dispatchEvent(wheelEvent);
    await wait(500);

    expect(onTransformStarted).toHaveBeenCalledTimes(1);
  });

  it("should move canvas with touch", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);
    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 100, 100)");
  });

  it("should stop movement on touchend", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);
    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    window.dispatchEvent(new TouchEvent("touchend"));

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 200, clientY: 200 })],
      }),
    );

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 100, 100)");
  });

  it("should stop movement on touchcancel", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);
    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    window.dispatchEvent(new TouchEvent("touchcancel"));

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 200, clientY: 200 })],
      }),
    );

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 100, 100)");
  });

  it("should not dispatch onTransformStarted for next touch", () => {
    const coreCanvas = createCanvas();
    const onTransformStarted = jest.fn();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas, {
      events: {
        onTransformStarted: onTransformStarted,
      },
    });
    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [
          createTouch({ clientX: 0, clientY: 0 }),
          createTouch({ clientX: 10, clientY: 10 }),
        ],
      }),
    );

    expect(onTransformStarted).toHaveReturnedTimes(1);
  });

  it("should handle touch gracefully if element gets detached in the process", async () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);
    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    canvas.detach();

    expect(() => {
      window.dispatchEvent(
        new TouchEvent("touchmove", {
          touches: [createTouch({ clientX: 100, clientY: 100 })],
        }),
      );
    }).not.toThrow();
  });

  it("should not move canvas if touch is outside of window", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);
    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: -100, clientY: 0 })],
      }),
    );

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 0, 0)");
  });

  it("should not move canvas if touch is outside of canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);
    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 1600, clientY: 0 })],
      }),
    );

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 0, 0)");
  });

  it("should move and scale canvas with two touches", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);
    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [
          createTouch({ clientX: 0, clientY: 0 }),
          createTouch({ clientX: 100, clientY: 0 }),
        ],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [
          createTouch({ clientX: 0, clientY: 0 }),
          createTouch({ clientX: 200, clientY: 0 }),
        ],
      }),
    );

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(2, 0, 0, 2, 50, 0)");
  });

  it("should keep moving canvas after move touches ended", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas);
    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [
          createTouch({ clientX: 0, clientY: 0 }),
          createTouch({ clientX: 100, clientY: 0 }),
        ],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchend", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 200, clientY: 0 })],
      }),
    );

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 200, 0)");
  });

  it("should call onTransformStarted for move with mouse", () => {
    const coreCanvas = createCanvas();
    const onTransformStarted = jest.fn((): void => {});

    const canvas = new UserTransformableViewportCanvasController(coreCanvas, {
      events: {
        onTransformStarted: onTransformStarted,
      },
    });

    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    expect(onTransformStarted).toHaveBeenCalled();
  });

  it("should call onTransformStarted for move with touch", () => {
    const coreCanvas = createCanvas();
    const onTransformStarted = jest.fn((): void => {});

    const canvas = new UserTransformableViewportCanvasController(coreCanvas, {
      events: {
        onTransformStarted: onTransformStarted,
      },
    });

    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    expect(onTransformStarted).toHaveBeenCalled();
  });

  it("should call onTransformFinished on finish move with mouse", () => {
    const coreCanvas = createCanvas();
    const onTransformFinished = jest.fn((): void => {});

    const canvas = new UserTransformableViewportCanvasController(coreCanvas, {
      events: {
        onTransformFinished: onTransformFinished,
      },
    });

    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
    window.dispatchEvent(new MouseEvent("mouseup", { button: 0 }));

    expect(onTransformFinished).toHaveBeenCalled();
  });

  it("should call onTransformFinished on finish move with touch", () => {
    const coreCanvas = createCanvas();
    const onTransformFinished = jest.fn((): void => {});

    const canvas = new UserTransformableViewportCanvasController(coreCanvas, {
      events: {
        onTransformFinished: onTransformFinished,
      },
    });

    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(new TouchEvent("touchend"));

    expect(onTransformFinished).toHaveBeenCalled();
  });

  it("should not scale canvas if mouse wheel event not valid", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas, {
      scale: {
        mouseWheelEventVerifier: (event: WheelEvent): boolean => event.ctrlKey,
      },
    });

    const element = createElement({ width: 1000, height: 1000 });
    canvas.attach(element);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    element.dispatchEvent(wheelEvent);
    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe(`matrix(1, 0, 0, 1, 0, 0)`);
  });

  it("should call resize start event on host element resize", () => {
    const coreCanvas = createCanvas();

    const onResizeTransformStarted = jest.fn();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas, {
      events: {
        onResizeTransformStarted,
      },
    });

    const element = createElement({ width: 1000, height: 1000 });
    canvas.attach(element);

    expect(onResizeTransformStarted).toHaveBeenCalledTimes(1);
  });

  it("should call resize finish event on host element resize", () => {
    const coreCanvas = createCanvas();

    const onResizeTransformFinished = jest.fn();
    const canvas = new UserTransformableViewportCanvasController(coreCanvas, {
      events: {
        onResizeTransformFinished,
      },
    });

    const element = createElement({ width: 1000, height: 1000 });
    canvas.attach(element);

    expect(onResizeTransformFinished).toHaveBeenCalledTimes(1);
  });
});
