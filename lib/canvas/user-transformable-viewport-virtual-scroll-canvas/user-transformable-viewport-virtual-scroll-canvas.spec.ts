import { UserTransformableViewportVirtualScrollCanvas } from "./user-transformable-viewport-virtual-scroll-canvas";
import { EventSubject } from "@/event-subject";
import { RenderingBox } from "@/html-view";
import { Canvas } from "../canvas";
import {
  CoreCanvas,
  createBoxHtmlViewFactory,
  DiContainer,
} from "../core-canvas";
import { TransformOptions } from "../user-transformable-viewport-canvas";

const wait = (timeout: number): Promise<void> => {
  return new Promise((res) => {
    setTimeout(() => {
      res(undefined);
    }, timeout);
  });
};

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

const create = (
  transformOptions?: TransformOptions,
): {
  canvas: UserTransformableViewportVirtualScrollCanvas;
  coreCanvas: CoreCanvas;
} => {
  const trigger = new EventSubject<RenderingBox>();
  const htmlViewFactory = createBoxHtmlViewFactory(trigger);
  const container = new DiContainer({}, htmlViewFactory);
  const coreCanvas = new CoreCanvas(container);

  const canvas = new UserTransformableViewportVirtualScrollCanvas(
    coreCanvas,
    trigger,
    transformOptions,
    {
      maxNodeContainingRadius: {
        vertical: 25,
        horizontal: 25,
      },
    },
  );
  return { canvas, coreCanvas };
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

const configureEdgeGraph = (canvas: Canvas): void => {
  canvas
    .addNode({
      element: document.createElement("div"),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: document.createElement("div"),
          direction: 0,
        },
      ],
    })
    .addNode({
      element: document.createElement("div"),
      x: 300,
      y: 300,
      ports: [
        {
          id: "port-2",
          element: document.createElement("div"),
          direction: 0,
        },
      ],
    })
    .addNode({
      element: document.createElement("div"),
      x: 600,
      y: 600,
      ports: [
        {
          id: "port-3",
          element: document.createElement("div"),
          direction: 0,
        },
      ],
    })
    .addEdge({
      from: "port-1",
      to: "port-2",
    })
    .addEdge({
      from: "port-2",
      to: "port-3",
    });
};

const triggerResizeFor = (element: HTMLElement): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).triggerResizeFor(element);
};

describe("UserTransformableViewportVirtualScrollCanvas", () => {
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
      element: document.createElement("div"),
      x: 0,
      y: 0,
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
    });

    const spy = jest.spyOn(coreCanvas, "updateNode");

    canvas.updateNode("node-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should call removeNode on canvas", () => {
    const { canvas, coreCanvas } = create();

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
    const { canvas, coreCanvas } = create();

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
    const { canvas, coreCanvas } = create();

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
    const { canvas, coreCanvas } = create();

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
    const { canvas, coreCanvas } = create();

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
    const { canvas, coreCanvas } = create();

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
    const { canvas, coreCanvas } = create();

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
        onTransformChange,
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
        onTransformFinished,
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
