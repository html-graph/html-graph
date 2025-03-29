import { AddEdgeRequest, AddNodeRequest } from "./canvas";
import { CanvasBuilder } from "./canvas-builder";
import { standardCenterFn } from "./center-fn";
import { BezierEdgeShape } from "./edges";
import { EventSubject } from "./event-subject";
import { RenderingBox } from "./html-view";
import { createElement } from "./test-utils";

const triggerResizeFor = (element: HTMLElement): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).triggerResizeFor(element);
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

const wait = (timeout: number): Promise<void> => {
  return new Promise((res) => {
    setTimeout(() => {
      res(undefined);
    }, timeout);
  });
};

describe("CanvasBuilder", () => {
  it("should build canvas with specified defaults", () => {
    const builder = new CanvasBuilder();

    const canvas = builder
      .setDefaults({
        nodes: {
          priority: () => 10,
        },
      })
      .build();

    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.addNode({
      element: document.createElement("div"),
      x: 0,
      y: 0,
    });

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.zIndex).toBe("10");
  });

  it("should build canvas with specified options", () => {
    const builder = new CanvasBuilder();

    const canvas = builder
      .setOptions({
        nodes: {
          priority: () => 10,
        },
      })
      .build();

    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.addNode({
      element: document.createElement("div"),
      x: 0,
      y: 0,
    });

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.zIndex).toBe("10");
  });

  it("should build resize reactive canvas", () => {
    const builder = new CanvasBuilder();

    const canvas = builder.enableResizeReactiveNodes().build();

    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    const nodeRequest1: AddNodeRequest = {
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
    };

    const nodeRequest2: AddNodeRequest = {
      id: "node-2",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-2",
          element: document.createElement("div"),
        },
      ],
    };

    const shape = new BezierEdgeShape();

    const addEdge: AddEdgeRequest = {
      from: "port-1",
      to: "port-2",
      shape,
    };

    canvas.addNode(nodeRequest1).addNode(nodeRequest2).addEdge(addEdge);

    const spy = jest.spyOn(shape, "render");

    triggerResizeFor(nodeRequest1.element);

    expect(spy).toHaveBeenCalled();
  });

  it("should build user draggable nodes canvas", () => {
    const builder = new CanvasBuilder();

    const canvas = builder.enableUserDraggableNodes().build();

    const canvasElement = createElement({ width: 1000, height: 1000 });

    canvas.attach(canvasElement);

    const element = createElement();

    canvas.addNode({
      id: "node-1",
      element,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    window.dispatchEvent(
      createMouseMoveEvent({ movementX: 100, movementY: 100 }),
    );

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(100px, 100px)");
  });

  it("should build user transformable canvas", () => {
    const builder = new CanvasBuilder();

    const canvas = builder.enableUserTransformableViewport().build();

    const element = createElement({ width: 1000, height: 1000 });

    canvas.attach(element);

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({ movementX: 100, movementY: 100 });

    window.dispatchEvent(moveEvent);

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 100, 100)");
  });

  it("should build canvas with specified rendering trigger", () => {
    const builder = new CanvasBuilder();
    const trigger = new EventSubject<RenderingBox>();

    const canvas = builder.enableBoxAreaRendering(trigger).build();

    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.addNode({
      element: document.createElement("div"),
      x: 0,
      y: 0,
    });

    const container = canvasElement.children[0].children[0];
    const elementsBefore = container.children.length;
    trigger.emit({ x: -1, y: -1, width: 2, height: 2 });
    const elementsAfter = container.children.length;

    expect([elementsBefore, elementsAfter]).toStrictEqual([0, 1]);
  });

  it("should build canvas with virtual scroll", async () => {
    const builder = new CanvasBuilder();

    const canvas = builder
      .enableVirtualScroll({
        nodeContainingRadius: {
          vertical: 10,
          horizontal: 10,
        },
      })
      .build();

    const canvasElement = createElement({ width: 100, height: 100 });
    canvas.attach(canvasElement);

    canvas.addNode({
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    canvas.addNode({
      element: document.createElement("div"),
      x: 300,
      y: 300,
      centerFn: standardCenterFn,
      priority: 0,
    });

    await wait(0);

    const container = canvasElement.children[0].children[0];
    expect(container.children.length).toBe(1);
  });
});
