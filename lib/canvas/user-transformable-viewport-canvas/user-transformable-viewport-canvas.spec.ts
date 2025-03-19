import { CanvasCore } from "../canvas-core";
import { UserTransformableViewportCanvas } from "./user-transformable-viewport-canvas";

const createElement = (params?: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}): HTMLElement => {
  const div = document.createElement("div");

  div.getBoundingClientRect = (): DOMRect => {
    return new DOMRect(
      params?.x ?? 0,
      params?.y ?? 0,
      params?.width ?? 0,
      params?.height ?? 0,
    );
  };

  return div;
};

const createMouseMoveEvent = (params: {
  movementX?: number;
  movementY?: number;
  clientX?: number;
  clientY?: number;
}): MouseEvent => {
  const moveEvent = new MouseEvent("mousemove", {
    clientX: params.clientX,
    clientY: params.clientX,
  });

  Object.defineProperty(moveEvent, "movementX", {
    get() {
      return params.movementX ?? 0;
    },
  });

  Object.defineProperty(moveEvent, "movementY", {
    get() {
      return params.movementY ?? 0;
    },
  });

  return moveEvent;
};

const createMouseWheelEvent = (params: {
  clientX?: number;
  clientY?: number;
  deltaY?: number;
}): MouseEvent => {
  const wheelEvent = new MouseEvent("wheel", {
    clientX: params.clientX,
    clientY: params.clientX,
  });

  Object.defineProperty(wheelEvent, "deltaY", {
    get() {
      return params.deltaY ?? 0;
    },
  });

  return wheelEvent;
};

const createTouch = (params: { clientX: number; clientY: number }): Touch => {
  return {
    clientX: params.clientX,
    clientY: params.clientY,
    force: 0,
    identifier: 0,
    pageX: 0,
    pageY: 0,
    radiusX: 0,
    radiusY: 0,
    rotationAngle: 0,
    screenX: 0,
    screenY: 0,
    target: document.createElement("div"),
  };
};

let innerWidth: number;
let innerHeight: number;

describe("UserTransformableViewportCanvas", () => {
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
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);
    const canvasElement = document.createElement("div");

    const spy = jest.spyOn(canvasCore, "attach");

    canvas.attach(canvasElement);

    expect(spy).toHaveBeenCalledWith(canvasElement);
  });

  it("should call detach on canvas", () => {
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);
    const canvasElement = document.createElement("div");

    const spy = jest.spyOn(canvasCore, "detach");

    canvas.attach(canvasElement);
    canvas.detach();

    expect(spy).toHaveBeenCalled();
  });

  it("should call addNode on canvas", () => {
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);

    const spy = jest.spyOn(canvasCore, "addNode");

    canvas.addNode({
      element: document.createElement("div"),
      x: 0,
      y: 0,
    });

    expect(spy).toHaveBeenCalled();
  });

  it("should call updateNode on canvas", () => {
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
    });

    const spy = jest.spyOn(canvasCore, "updateNode");

    canvas.updateNode("node-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should call removeNode on canvas", () => {
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
    });

    const spy = jest.spyOn(canvasCore, "removeNode");

    canvas.removeNode("node-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should call markPort on canvas", () => {
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
    });

    const spy = jest.spyOn(canvasCore, "markPort");

    canvas.markPort({
      element: document.createElement("div"),
      nodeId: "node-1",
    });

    expect(spy).toHaveBeenCalled();
  });

  it("should call updatePort on canvas", () => {
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);

    canvas.addNode({
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
    });

    const spy = jest.spyOn(canvasCore, "updatePort");

    canvas.updatePort("port-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should call unmarkPort on canvas", () => {
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);

    canvas.addNode({
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
    });

    const spy = jest.spyOn(canvasCore, "unmarkPort");

    canvas.unmarkPort("port-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should call addEdge on canvas", () => {
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);

    canvas.addNode({
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
    });

    const spy = jest.spyOn(canvasCore, "addEdge");

    canvas.addEdge({ from: "port-1", to: "port-1" });

    expect(spy).toHaveBeenCalled();
  });

  it("should call updateEdge on canvas", () => {
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);

    canvas.addNode({
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
    });

    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-1" });

    const spy = jest.spyOn(canvasCore, "updateEdge");

    canvas.updateEdge("edge-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should call removeEdge on canvas", () => {
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);

    canvas.addNode({
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
    });

    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-1" });

    const spy = jest.spyOn(canvasCore, "removeEdge");

    canvas.removeEdge("edge-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should call patchViewportMatrix on canvas", () => {
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);

    const spy = jest.spyOn(canvasCore, "patchViewportMatrix");

    canvas.patchViewportMatrix({});

    expect(spy).toHaveBeenCalled();
  });

  it("should call patchContentMatrix on canvas", () => {
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);

    const spy = jest.spyOn(canvasCore, "patchContentMatrix");

    canvas.patchContentMatrix({});

    expect(spy).toHaveBeenCalled();
  });

  it("should call clear on canvas", () => {
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);

    const spy = jest.spyOn(canvasCore, "clear");

    canvas.clear();

    expect(spy).toHaveBeenCalled();
  });

  it("should call destroy on canvas", () => {
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);

    const spy = jest.spyOn(canvasCore, "destroy");

    canvas.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should call detach on destroy canvas", () => {
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);

    const spy = jest.spyOn(canvas, "detach");

    canvas.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should set cursor on mouse down", () => {
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);
    const element = createElement();

    canvas.attach(element);

    element.dispatchEvent(new MouseEvent("mousedown"));

    expect(element.style.cursor).toBe("grab");
  });

  it("should not set cursor on right mouse button down", () => {
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);
    const element = createElement();

    canvas.attach(element);

    element.dispatchEvent(new MouseEvent("mousedown", { button: 1 }));

    expect(element.style.cursor).toBe("");
  });

  it("should move canvas with mouse", () => {
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);
    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({ movementX: 100, movementY: 100 });

    window.dispatchEvent(moveEvent);

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 100, 100)");
  });

  it("should call onBeforeTransformChange for move with mouse", () => {
    const canvasCore = new CanvasCore();
    const onBeforeTransformChange = jest.fn((): void => {});

    const canvas = new UserTransformableViewportCanvas(canvasCore, {
      events: {
        onBeforeTransformChange,
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
    const canvasCore = new CanvasCore();
    const onTransformChange = jest.fn((): void => {});

    const canvas = new UserTransformableViewportCanvas(canvasCore, {
      events: {
        onTransformChange,
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
    const canvasCore = new CanvasCore();
    const onTransformFinished = jest.fn((): void => {});

    const canvas = new UserTransformableViewportCanvas(canvasCore, {
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
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);
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
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);
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
    const canvasCore = new CanvasCore();
    const onTransformChange = jest.fn((): void => {});

    const canvas = new UserTransformableViewportCanvas(canvasCore, {
      events: {
        onTransformChange,
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
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);
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
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);
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
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);
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
    const canvasCore = new CanvasCore();

    const onTransformStarted = jest.fn();
    const canvas = new UserTransformableViewportCanvas(canvasCore, {
      events: {
        onTransformStarted,
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
    const canvasCore = new CanvasCore();

    const onTransformFinished = jest.fn();
    const canvas = new UserTransformableViewportCanvas(canvasCore, {
      events: {
        onTransformFinished,
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

    await new Promise((res) => {
      setTimeout(() => {
        expect(onTransformFinished).toHaveBeenCalled();
        res(undefined);
      }, 500);
    });
  });

  it("should call finish after 500ms span without events", async () => {
    const canvasCore = new CanvasCore();

    const onTransformFinished = jest.fn();
    const canvas = new UserTransformableViewportCanvas(canvasCore, {
      events: {
        onTransformFinished,
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

    await new Promise((r1) => {
      setTimeout(async () => {
        element.dispatchEvent(wheelEvent);

        await new Promise((r2) => {
          setTimeout(() => {
            expect(onTransformFinished).toHaveBeenCalledTimes(1);
            r2(undefined);
          }, 500);
        });

        r1(undefined);
      }, 499);
    });
  });

  it("should move canvas with touch", () => {
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);
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
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);
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
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);
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

  it("should handle touch gracefully if element gets detached in the process", async () => {
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);
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
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);
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
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);
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
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);
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
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore);
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
    const canvasCore = new CanvasCore();
    const onTransformStarted = jest.fn((): void => {});

    const canvas = new UserTransformableViewportCanvas(canvasCore, {
      events: {
        onTransformStarted,
      },
    });

    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    expect(onTransformStarted).toHaveBeenCalled();
  });

  it("should call onTransformStarted for move with touch", () => {
    const canvasCore = new CanvasCore();
    const onTransformStarted = jest.fn((): void => {});

    const canvas = new UserTransformableViewportCanvas(canvasCore, {
      events: {
        onTransformStarted,
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
    const canvasCore = new CanvasCore();
    const onTransformFinished = jest.fn((): void => {});

    const canvas = new UserTransformableViewportCanvas(canvasCore, {
      events: {
        onTransformFinished,
      },
    });

    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
    window.dispatchEvent(new MouseEvent("mouseup", { button: 0 }));

    expect(onTransformFinished).toHaveBeenCalled();
  });

  it("should call onTransformFinished on finish move with touch", () => {
    const canvasCore = new CanvasCore();
    const onTransformFinished = jest.fn((): void => {});

    const canvas = new UserTransformableViewportCanvas(canvasCore, {
      events: {
        onTransformFinished,
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
    const canvasCore = new CanvasCore();
    const canvas = new UserTransformableViewportCanvas(canvasCore, {
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
});
