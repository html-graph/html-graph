import { Canvas } from "../canvas";
import { CoreCanvas, coreHtmlViewFactory, DiContainer } from "../core-canvas";
import { UserDraggableNodesCanvas } from "./user-draggable-nodes-canvas";

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

const createCanvas = (): Canvas => {
  const container = new DiContainer({}, coreHtmlViewFactory);

  return new CoreCanvas(container);
};

describe("UserDraggableNodesCanvas", () => {
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
    const canvas = new UserDraggableNodesCanvas(coreCanvas);
    const canvasElement = document.createElement("div");

    const spy = jest.spyOn(coreCanvas, "attach");

    canvas.attach(canvasElement);

    expect(spy).toHaveBeenCalledWith(canvasElement);
  });

  it("should call detach on canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);
    const canvasElement = document.createElement("div");

    const spy = jest.spyOn(coreCanvas, "detach");

    canvas.attach(canvasElement);
    canvas.detach();

    expect(spy).toHaveBeenCalled();
  });

  it("should call addNode on canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);

    const spy = jest.spyOn(coreCanvas, "addNode");

    canvas.addNode({
      element: document.createElement("div"),
      x: 0,
      y: 0,
    });

    expect(spy).toHaveBeenCalled();
  });

  it("should call updateNode on canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
    });

    const spy = jest.spyOn(coreCanvas, "updateNode");

    canvas.updateNode("node-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should call removeNode on canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
    });

    const spy = jest.spyOn(coreCanvas, "removeNode");

    canvas.removeNode("node-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should call markPort on canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
    });

    const spy = jest.spyOn(coreCanvas, "markPort");

    canvas.markPort({
      element: document.createElement("div"),
      nodeId: "node-1",
    });

    expect(spy).toHaveBeenCalled();
  });

  it("should call updatePort on canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);

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

    const spy = jest.spyOn(coreCanvas, "updatePort");

    canvas.updatePort("port-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should call unmarkPort on canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);

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

    const spy = jest.spyOn(coreCanvas, "unmarkPort");

    canvas.unmarkPort("port-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should call addEdge on canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);

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

    const spy = jest.spyOn(coreCanvas, "addEdge");

    canvas.addEdge({ from: "port-1", to: "port-1" });

    expect(spy).toHaveBeenCalled();
  });

  it("should call updateEdge on canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);

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

    const spy = jest.spyOn(coreCanvas, "updateEdge");

    canvas.updateEdge("edge-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should call removeEdge on canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);

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

    const spy = jest.spyOn(coreCanvas, "removeEdge");

    canvas.removeEdge("edge-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should call patchViewportMatrix on canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);

    const spy = jest.spyOn(coreCanvas, "patchViewportMatrix");

    canvas.patchViewportMatrix({});

    expect(spy).toHaveBeenCalled();
  });

  it("should call patchContentMatrix on canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);

    const spy = jest.spyOn(coreCanvas, "patchContentMatrix");

    canvas.patchContentMatrix({});

    expect(spy).toHaveBeenCalled();
  });

  it("should call clear on canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);

    const spy = jest.spyOn(coreCanvas, "clear");

    canvas.clear();

    expect(spy).toHaveBeenCalled();
  });

  it("should call destroy on canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);

    const spy = jest.spyOn(coreCanvas, "destroy");

    canvas.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should call detach on destroy canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);

    const spy = jest.spyOn(canvas, "detach");

    canvas.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should call clear on destroy canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);

    const spy = jest.spyOn(canvas, "clear");

    canvas.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should change cursor on node grab", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);
    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    expect(canvasElement.style.cursor).toBe("grab");
  });

  it("should not change cursor on other than left mouse button", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);
    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 1 }));

    expect(canvasElement.style.cursor).toBe("");
  });

  it("should move grabbed node with mouse", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);
    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    window.dispatchEvent(
      createMouseMoveEvent({ movementX: 100, movementY: 100 }),
    );

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(100px, 100px)");
  });

  it("should change cursor back on node release", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);
    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
    window.dispatchEvent(new MouseEvent("mouseup", { button: 0 }));

    expect(canvasElement.style.cursor).toBe("");
  });

  it("should not change cursor back on node release for other than left mouse button", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);
    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
    window.dispatchEvent(new MouseEvent("mouseup", { button: 1 }));

    expect(canvasElement.style.cursor).toBe("grab");
  });

  it("should change cursor on node grab on specified", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas, {
      mouse: {
        dragCursor: "crosshair",
      },
    });
    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    expect(canvasElement.style.cursor).toBe("crosshair");
  });

  it("should move grabbed node with touch", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);
    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

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

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(100px, 100px)");
  });

  it("should not move grabbed node with mouse when pointer is out of canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);
    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    window.dispatchEvent(createMouseMoveEvent({ clientX: 1100, clientY: 0 }));

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(0px, 0px)");
  });

  it("should not move grabbed node with mouse when pointer is out of window", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);
    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    window.dispatchEvent(createMouseMoveEvent({ clientX: -100, clientY: 0 }));

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(0px, 0px)");
  });

  it("should not move grabbed node with touch if more than one touches", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);
    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [
          createTouch({ clientX: 100, clientY: 100 }),
          createTouch({ clientX: 200, clientY: 200 }),
        ],
      }),
    );

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(0px, 0px)");
  });

  it("should not move grabbed node when touch out of canvas", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);
    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 1100, clientY: 100 })],
      }),
    );

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(0px, 0px)");
  });

  it("should not move grabbed node when touch out of window", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);
    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: -100, clientY: 100 })],
      }),
    );

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(0px, 0px)");
  });

  it("should not move grabbed node with touch after release", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);
    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

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

    window.dispatchEvent(
      new TouchEvent("touchend", {
        touches: [],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 200, clientY: 200 })],
      }),
    );

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(100px, 100px)");
  });

  it("should stop moving node with touch after release one of touches", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);
    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

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

    window.dispatchEvent(
      new TouchEvent("touchend", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 200, clientY: 200 })],
      }),
    );

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(100px, 100px)");
  });

  it("should not move node with mouse if drag is not allowed", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas, {
      events: {
        onBeforeNodeDrag: (): boolean => false,
      },
    });
    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 100 }));

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(0px, 0px)");
  });

  it("should not move node with touch if drag is not allowed", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas, {
      events: {
        onBeforeNodeDrag: (): boolean => false,
      },
    });
    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

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

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(0px, 0px)");
  });

  it("should not grab node with more than one touch", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);
    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

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
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(0px, 0px)");
  });

  it("should not change cursor on grab after clear", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);
    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

    canvas.clear();

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    expect(canvasElement.style.cursor).toBe("");
  });

  it("should handle gracefully drag removed node", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);
    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    canvas.removeNode("node-1");

    expect(() => {
      window.dispatchEvent(
        createMouseMoveEvent({ movementX: 100, movementY: 100 }),
      );
    }).not.toThrow();
  });

  it("should move node on top on grab with mouse", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);
    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.zIndex).toBe("2");
  });

  it("should not move node on top when move on top disabled", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas, {
      moveOnTop: false,
    });
    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.zIndex).toBe("0");
  });

  it("should update adjacent edges priorities", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas);
    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element1 = createElement();

    canvas.addNode({
      element: element1,
      x: 0,
      y: 0,
      ports: [{ id: "port-1", element: createElement() }],
    });

    canvas.addNode({
      element: createElement(),
      x: 0,
      y: 0,
      ports: [{ id: "port-2", element: createElement() }],
    });

    canvas.addEdge({ from: "port-1", to: "port-2" });

    element1.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const container = canvasElement.children[0].children[0];
    const edgeSvg = container.children[2] as HTMLElement;

    expect(edgeSvg.style.zIndex).toBe("1");
  });

  it("should call on drag finished with mouse", () => {
    const onNodeDragFinished = jest.fn();

    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas, {
      events: {
        onNodeDragFinished,
      },
    });

    const canvasElement = createElement({ width: 1000, height: 1000 });
    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
    window.dispatchEvent(new MouseEvent("mouseup", { button: 0 }));

    expect(onNodeDragFinished).toHaveBeenCalledWith({
      nodeId: "node-1",
      element,
      x: 0,
      y: 0,
    });
  });

  it("should call on drag finished with touch", () => {
    const onNodeDragFinished = jest.fn();

    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas, {
      events: {
        onNodeDragFinished,
      },
    });

    const canvasElement = createElement({ width: 1000, height: 1000 });
    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchend", {
        touches: [],
      }),
    );

    expect(onNodeDragFinished).toHaveBeenCalledWith({
      nodeId: "node-1",
      element,
      x: 0,
      y: 0,
    });
  });

  it("should not start drag when mouse down validator not passed", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas, {
      mouse: {
        mouseDownEventVerifier: (event: MouseEvent): boolean =>
          event.button === 0 && event.ctrlKey,
      },
    });

    const canvasElement = createElement({ width: 1000, height: 1000 });
    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    window.dispatchEvent(
      createMouseMoveEvent({ movementX: 100, movementY: 100 }),
    );

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(0px, 0px)");
  });

  it("should not stop drag when mouse up validator not passed", () => {
    const coreCanvas = createCanvas();
    const canvas = new UserDraggableNodesCanvas(coreCanvas, {
      mouse: {
        mouseUpEventVerifier: (event: MouseEvent): boolean =>
          event.button === 0 && event.ctrlKey,
      },
    });

    const canvasElement = createElement({ width: 1000, height: 1000 });
    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
    });

    element.dispatchEvent(
      new MouseEvent("mousedown", { button: 0, ctrlKey: true }),
    );

    window.dispatchEvent(
      createMouseMoveEvent({ movementX: 100, movementY: 100 }),
    );

    window.dispatchEvent(new MouseEvent("mouseup", { button: 0 }));

    window.dispatchEvent(
      createMouseMoveEvent({ movementX: 100, movementY: 100 }),
    );

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(200px, 200px)");
  });
});
