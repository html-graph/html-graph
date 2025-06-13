import { AddEdgeRequest, AddNodeRequest } from "@/canvas";
import { CanvasBuilder } from "@/canvas-builder";
import { standardCenterFn } from "@/center-fn";
import { BezierEdgeShape } from "@/edges";
import { EventSubject } from "@/event-subject";
import { RenderingBox } from "@/html-view";
import {
  createElement,
  createMouseMoveEvent,
  triggerResizeFor,
  wait,
} from "@/mocks";
import { HtmlGraphError } from "./error";

const setLayersDimensions = (element: HTMLElement): void => {
  for (const child of element.children[0].children) {
    child.getBoundingClientRect = element.getBoundingClientRect;
  }
};

describe("CanvasBuilder", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should throw error when attach element not specified", () => {
    const builder = new CanvasBuilder();

    expect(() => {
      builder.build();
    }).toThrow(HtmlGraphError);
  });

  it("should remove all children before destroy", () => {
    const builder = new CanvasBuilder();
    const canvasElement = document.createElement("div");

    const canvas = builder.setElement(canvasElement).build();

    canvas.destroy();

    expect(canvasElement.children.length).toBe(0);
  });

  it("should build canvas with specified defaults", () => {
    const builder = new CanvasBuilder();
    const canvasElement = document.createElement("div");

    const canvas = builder
      .setDefaults({
        nodes: {
          priority: () => 10,
        },
      })
      .setElement(canvasElement)
      .build();

    canvas.addNode({
      element: document.createElement("div"),
      x: 0,
      y: 0,
    });

    const container =
      canvasElement.children[0].children[1].children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.zIndex).toBe("10");
  });

  it("should build canvas with resize reactive nodes", () => {
    const builder = new CanvasBuilder();

    const canvasElement = document.createElement("div");
    const canvas = builder
      .enableResizeReactiveNodes()
      .setElement(canvasElement)
      .build();

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

  it("should build canvas with user draggable nodes", () => {
    const builder = new CanvasBuilder();

    const canvasElement = createElement({ width: 1000, height: 1000 });
    const canvas = builder
      .enableUserDraggableNodes()
      .setElement(canvasElement)
      .build();

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

    const container =
      canvasElement.children[0].children[1].children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(100px, 100px)");
  });

  it("should build canvas with user transformable viewport", () => {
    const builder = new CanvasBuilder();

    const element = createElement({ width: 1000, height: 1000 });

    builder.enableUserTransformableViewport().setElement(element).build();

    const host = element.children[0].children[1];
    host.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({ movementX: 100, movementY: 100 });

    window.dispatchEvent(moveEvent);

    const container = host.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 100, 100)");
  });

  it("should build canvas with specified rendering trigger", () => {
    const builder = new CanvasBuilder();
    const trigger = new EventSubject<RenderingBox>();

    const canvasElement = document.createElement("div");
    const canvas = builder
      .enableBoxAreaRendering(trigger)
      .setElement(canvasElement)
      .build();

    canvas.addNode({
      element: document.createElement("div"),
      x: 0,
      y: 0,
    });

    const container =
      canvasElement.children[0].children[1].children[0].children[0];

    const elementsBefore = container.children.length;
    trigger.emit({ x: -1, y: -1, width: 2, height: 2 });
    const elementsAfter = container.children.length;

    expect([elementsBefore, elementsAfter]).toStrictEqual([0, 1]);
  });

  it("should build canvas with virtual scroll", async () => {
    const builder = new CanvasBuilder();
    const canvasElement = createElement({ width: 100, height: 100 });

    const canvas = builder
      .enableVirtualScroll({
        nodeContainingRadius: {
          vertical: 10,
          horizontal: 10,
        },
      })
      .setElement(canvasElement)
      .build();

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

    const container =
      canvasElement.children[0].children[1].children[0].children[0];

    expect(container.children.length).toBe(1);
  });

  it("should build canvas with background", async () => {
    const builder = new CanvasBuilder();
    const canvasElement = createElement({ width: 100, height: 100 });

    builder.setElement(canvasElement).enableBackground().build();

    const svg = canvasElement.children[0].children[0].children[0];

    expect(svg.tagName).toBe("svg");
  });

  it("should build canvas with user connectable ports", () => {
    const builder = new CanvasBuilder();
    const canvasElement = createElement({ width: 1000, height: 1000 });
    document.body.appendChild(canvasElement);

    const canvas = builder
      .setElement(canvasElement)
      .enableUserConnectablePorts()
      .build();

    setLayersDimensions(canvasElement);

    const sourcePortElement = createElement({
      x: -5,
      y: -5,
      width: 10,
      height: 10,
    });

    const sourceNodeElement = document.createElement("div");
    sourceNodeElement.appendChild(sourcePortElement);

    canvas.addNode({
      element: sourceNodeElement,
      x: 0,
      y: 0,
      ports: [
        {
          element: sourcePortElement,
        },
      ],
    });

    const targetPortElement = createElement({
      x: 95,
      y: 95,
      width: 10,
      height: 10,
    });

    const targetNodeElement = document.createElement("div");
    targetNodeElement.appendChild(targetPortElement);

    canvas.addNode({
      element: targetNodeElement,
      x: 0,
      y: 0,
      ports: [
        {
          element: targetPortElement,
        },
      ],
    });

    sourcePortElement.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 100 }));
    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 100, clientY: 100 }),
    );

    expect(canvas.graph.getAllEdgeIds().length).toBe(1);
  });
});
