import { EdgeShapeMock } from "@/edges";
import { CanvasCore } from "./canvas-core";
import { HtmlGraphError } from "@/error";

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

describe("CanvasCore", () => {
  it("should attach canvas", () => {
    const canvas = new CanvasCore();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    expect(canvasElement.children.length).toBe(1);
  });

  it("should detach canvas", () => {
    const canvas = new CanvasCore();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);
    canvas.detach();

    expect(canvasElement.children.length).toBe(0);
  });

  it("should create node", () => {
    const canvas = new CanvasCore();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.addNode({
      element: createElement(),
      x: 0,
      y: 0,
    });

    const container = canvasElement.children[0].children[0];

    expect(container.children.length).toBe(1);
  });

  it("should update node coordinates", () => {
    const canvas = new CanvasCore();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.updateNode("node-1", { x: 100, y: 100 });

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(100px, 100px)");
  });

  it("should update node priority", () => {
    const canvas = new CanvasCore();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.updateNode("node-1", { priority: 10 });

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.zIndex).toBe("10");
  });

  it("should update node centerFn", () => {
    const canvas = new CanvasCore();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.addNode({
      id: "node-1",
      element: createElement({ width: 100, height: 100 }),
      x: 0,
      y: 0,
    });

    canvas.updateNode("node-1", { centerFn: () => ({ x: 0, y: 0 }) });

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(0px, 0px)");
  });

  it("should remove node", () => {
    const canvas = new CanvasCore();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.addNode({
      id: "node-1",
      element: createElement({ width: 100, height: 100 }),
      x: 0,
      y: 0,
    });

    canvas.removeNode("node-1");

    const container = canvasElement.children[0].children[0];

    expect(container.children.length).toBe(0);
  });

  it("should create edge", () => {
    const canvas = new CanvasCore();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: createElement(),
        },
      ],
    });

    canvas.addNode({
      id: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-2",
          element: createElement(),
        },
      ],
    });

    canvas.addEdge({ from: "port-1", to: "port-2" });

    const container = canvasElement.children[0].children[0];

    expect(container.children.length).toBe(3);
  });

  it("should update edge shape", () => {
    const canvas = new CanvasCore();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: createElement(),
        },
      ],
    });

    canvas.addNode({
      id: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-2",
          element: createElement(),
        },
      ],
    });

    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-2" });

    const shape = new EdgeShapeMock();

    canvas.updateEdge("edge-1", {
      shape: { type: "custom", factory: () => shape },
    });

    const container = canvasElement.children[0].children[0];
    const edgeSvg = container.children[2];

    expect(edgeSvg).toBe(shape.svg);
  });

  it("should update edge priority", () => {
    const canvas = new CanvasCore();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: createElement(),
        },
      ],
    });

    canvas.addNode({
      id: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-2",
          element: createElement(),
        },
      ],
    });

    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-2" });

    canvas.updateEdge("edge-1", {
      priority: 10,
    });

    const container = canvasElement.children[0].children[0];
    const edgeSvg = container.children[2] as SVGSVGElement;

    expect(edgeSvg.style.zIndex).toBe("10");
  });

  it("should remove edge", () => {
    const canvas = new CanvasCore();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: createElement(),
        },
      ],
    });

    canvas.addNode({
      id: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-2",
          element: createElement(),
        },
      ],
    });

    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-2" });

    canvas.removeEdge("edge-1");

    const container = canvasElement.children[0].children[0];

    expect(container.children.length).toBe(2);
  });

  it("should mark port", () => {
    const canvas = new CanvasCore();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.markPort({
      id: "port-1",
      element: createElement(),
      nodeId: "node-1",
    });

    expect(() => {
      canvas.addEdge({ from: "port-1", to: "port-1" });
    }).not.toThrow(HtmlGraphError);
  });

  it("should update port direction", () => {
    const canvas = new CanvasCore();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.markPort({
      id: "port-1",
      element: createElement(),
      nodeId: "node-1",
    });

    const shape = new EdgeShapeMock();
    canvas.addEdge({
      from: "port-1",
      to: "port-1",
      shape: { type: "custom", factory: () => shape },
    });

    const spy = jest.spyOn(shape, "render");

    canvas.updatePort("port-1", { direction: Math.PI });

    expect(spy).toHaveBeenCalledWith({
      to: { x: 0, y: 0 },
      flipX: 1,
      flipY: 1,
      fromDir: Math.PI,
      toDir: Math.PI,
    });
  });

  it("should update port center function", () => {
    const canvas = new CanvasCore();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.addNode({
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: createElement({ width: 100, height: 100 }),
        },
      ],
    });

    canvas.addNode({
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-2",
          element: createElement({ x: 100, y: 100 }),
        },
      ],
    });

    const shape = new EdgeShapeMock();
    canvas.addEdge({
      from: "port-1",
      to: "port-2",
      shape: { type: "custom", factory: () => shape },
    });

    const spy = jest.spyOn(shape, "render");

    canvas.updatePort("port-1", { centerFn: () => ({ x: 0, y: 0 }) });

    expect(spy).toHaveBeenCalledWith({
      to: { x: 100, y: 100 },
      flipX: 1,
      flipY: 1,
      fromDir: 0,
      toDir: 0,
    });
  });

  it("should unmark port", () => {
    const canvas = new CanvasCore();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    });

    canvas.markPort({
      id: "port-1",
      element: createElement(),
      nodeId: "node-1",
    });

    canvas.unmarkPort("port-1");

    expect(() => {
      canvas.addEdge({ from: "port-1", to: "port-1" });
    }).toThrow(HtmlGraphError);
  });

  it("should patch viewport matrix", () => {
    const canvas = new CanvasCore();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.patchViewportMatrix({ scale: 2, dx: 2, dy: 2 });

    const container = canvasElement.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(0.5, 0, 0, 0.5, -1, -1)");
  });

  it("should patch content matrix", () => {
    const canvas = new CanvasCore();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.patchContentMatrix({ scale: 2, dx: 3, dy: 4 });

    const container = canvasElement.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(2, 0, 0, 2, 3, 4)");
  });

  it("should clear canvas", () => {
    const canvas = new CanvasCore();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.addNode({
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: createElement({ width: 100, height: 100 }),
        },
      ],
    });

    canvas.addNode({
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-2",
          element: createElement({ x: 100, y: 100 }),
        },
      ],
    });

    canvas.addEdge({
      from: "port-1",
      to: "port-2",
    });

    canvas.clear();

    const container = canvasElement.children[0].children[0];

    expect(container.children.length).toBe(0);
  });

  it("should clear canvas on destroy", () => {
    const canvas = new CanvasCore();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.addNode({
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: createElement({ width: 100, height: 100 }),
        },
      ],
    });

    canvas.addNode({
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-2",
          element: createElement({ x: 100, y: 100 }),
        },
      ],
    });

    canvas.addEdge({
      from: "port-1",
      to: "port-2",
    });

    canvas.destroy();

    expect(canvasElement.children.length).toBe(0);
  });
});
