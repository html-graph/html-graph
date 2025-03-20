import { UserTransformableViewportVirtualScrollCanvas } from "./user-transformable-viewport-virtual-scroll-canvas";
import { CanvasCore } from "../canvas-core";
import { EventSubject } from "@/event-subject";
import { RenderingBox } from "@/html-view";

const create = (): {
  canvas: UserTransformableViewportVirtualScrollCanvas;
  canvasCore: CanvasCore;
} => {
  const canvasCore = new CanvasCore();
  const trigger = new EventSubject<RenderingBox>();
  const canvas = new UserTransformableViewportVirtualScrollCanvas(
    canvasCore,
    trigger,
    undefined,
    {
      maxNodeContainingRadius: {
        vertical: 25,
        horizontal: 25,
      },
    },
  );
  return { canvas, canvasCore };
};

// const triggerResizeFor = (element: HTMLElement): void => {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   (global as any).triggerResizeFor(element);
// };

describe("UserTransformableViewportVirtualScrollCanvas", () => {
  it("should call attach on canvas", () => {
    const { canvas, canvasCore } = create();
    const canvasElement = document.createElement("div");

    const spy = jest.spyOn(canvasCore, "attach");

    canvas.attach(canvasElement);

    expect(spy).toHaveBeenCalledWith(canvasElement);
  });

  it("should call detach on canvas", () => {
    const { canvas, canvasCore } = create();
    const canvasElement = document.createElement("div");

    const spy = jest.spyOn(canvasCore, "detach");

    canvas.attach(canvasElement);
    canvas.detach();

    expect(spy).toHaveBeenCalled();
  });

  it("should call addNode on canvas", () => {
    const { canvas, canvasCore } = create();

    const spy = jest.spyOn(canvasCore, "addNode");

    canvas.addNode({
      element: document.createElement("div"),
      x: 0,
      y: 0,
    });

    expect(spy).toHaveBeenCalled();
  });

  it("should call updateNode on canvas", () => {
    const { canvas, canvasCore } = create();

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
    const { canvas, canvasCore } = create();

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
    const { canvas, canvasCore } = create();

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
    const { canvas, canvasCore } = create();

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
    const { canvas, canvasCore } = create();

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
    const { canvas, canvasCore } = create();

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
    const { canvas, canvasCore } = create();

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
    const { canvas, canvasCore } = create();

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
    const { canvas, canvasCore } = create();

    const spy = jest.spyOn(canvasCore, "patchViewportMatrix");

    canvas.patchViewportMatrix({});

    expect(spy).toHaveBeenCalled();
  });

  it("should call patchContentMatrix on canvas", () => {
    const { canvas, canvasCore } = create();

    const spy = jest.spyOn(canvasCore, "patchContentMatrix");

    canvas.patchContentMatrix({});

    expect(spy).toHaveBeenCalled();
  });

  it("should call clear on canvas", () => {
    const { canvas, canvasCore } = create();

    const spy = jest.spyOn(canvasCore, "clear");

    canvas.clear();

    expect(spy).toHaveBeenCalled();
  });

  it("should call destroy on canvas", () => {
    const { canvas, canvasCore } = create();

    const spy = jest.spyOn(canvasCore, "destroy");

    canvas.destroy();

    expect(spy).toHaveBeenCalled();
  });
});
