import { EdgeShapeMock, EdgeRenderParams } from "@/edges";
import { CoreCanvas } from "./core-canvas";
import { HtmlGraphError } from "@/error";
import { DiContainer } from "./di-container";
import { AddNodeRequest } from "../add-node-request";
import { MarkPortRequest } from "../mark-port-request";
import { MarkNodePortRequest } from "../mark-node-port-request";
import { GraphStore } from "@/graph-store";
import { ViewportTransformer } from "@/viewport-transformer";
import { CoreHtmlView, HtmlView } from "@/html-view";

const createCanvas = (): CoreCanvas => {
  const htmlControllerFactory = (
    graphStore: GraphStore,
    viewportTransformer: ViewportTransformer,
  ): HtmlView => new CoreHtmlView(graphStore, viewportTransformer);

  return new CoreCanvas(new DiContainer({}, htmlControllerFactory));
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

const createNodeRequest1 = (): AddNodeRequest => {
  return {
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
  };
};

const createNodeRequest2 = (): AddNodeRequest => {
  return {
    id: "node-2",
    element: createElement(),
    x: 500,
    y: 500,
    ports: [
      {
        id: "port-2",
        element: createElement(),
      },
    ],
  };
};

const addNodeRequest: AddNodeRequest = {
  id: "node-1",
  element: createElement(),
  x: 0,
  y: 0,
};

const markPortRequest: MarkPortRequest = {
  id: "port-1",
  element: createElement(),
  nodeId: "node-1",
};

describe("CoreCanvas", () => {
  it("should attach canvas", () => {
    const canvas = createCanvas();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);

    expect(canvasElement.children.length).toBe(1);
  });

  it("should detach canvas", () => {
    const canvas = createCanvas();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.detach();

    expect(canvasElement.children.length).toBe(0);
  });

  it("should create node", () => {
    const canvas = createCanvas();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());

    const container = canvasElement.children[0].children[0];
    expect(container.children.length).toBe(1);
  });

  it("should update node coordinates", () => {
    const canvas = createCanvas();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    canvas.updateNode("node-1", { x: 100, y: 100 });

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;
    expect(nodeWrapper.style.transform).toBe("translate(100px, 100px)");
  });

  it("should update node priority", () => {
    const canvas = createCanvas();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    canvas.updateNode("node-1", { priority: 10 });

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;
    expect(nodeWrapper.style.zIndex).toBe("10");
  });

  it("should update node centerFn", () => {
    const canvas = createCanvas();
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
    const canvas = createCanvas();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    canvas.removeNode("node-1");

    const container = canvasElement.children[0].children[0];
    expect(container.children.length).toBe(0);
  });

  it("should create edge", () => {
    const canvas = createCanvas();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    canvas.addNode(createNodeRequest2());
    canvas.addEdge({ from: "port-1", to: "port-2" });

    const container = canvasElement.children[0].children[0];
    expect(container.children.length).toBe(3);
  });

  it("should update edge shape", () => {
    const canvas = createCanvas();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    canvas.addNode(createNodeRequest2());
    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-2" });

    const shape = new EdgeShapeMock();

    canvas.updateEdge("edge-1", { shape });

    const container = canvasElement.children[0].children[0];
    const edgeSvg = container.children[2];
    expect(edgeSvg).toBe(shape.svg);
  });

  it("should update edge priority", () => {
    const canvas = createCanvas();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.addNode(createNodeRequest1());
    canvas.addNode(createNodeRequest2());
    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-2" });
    canvas.updateEdge("edge-1", {
      priority: 10,
    });

    const container = canvasElement.children[0].children[0];
    const edgeSvg = container.children[2] as SVGSVGElement;
    expect(edgeSvg.style.zIndex).toBe("10");
  });

  it("should update edge without arguments", () => {
    const canvas = createCanvas();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    const nodeRequest2 = createNodeRequest2();
    canvas.addNode(nodeRequest2);
    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-2" });

    const port = (nodeRequest2.ports as Array<MarkNodePortRequest>)![0];
    port.element.getBoundingClientRect = (): DOMRect => {
      return new DOMRect(200, 100, 0, 0);
    };

    canvas.updateEdge("edge-1");

    const container = canvasElement.children[0].children[0];
    const edgeSvg = container.children[2] as SVGSVGElement;

    expect(edgeSvg.style.width).toBe("200px");
  });

  it("should update port without arguments", () => {
    const canvas = createCanvas();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    const nodeRequest2 = createNodeRequest2();
    canvas.addNode(nodeRequest2);
    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-2" });

    const port = (nodeRequest2.ports as Array<MarkNodePortRequest>)![0];
    port.element.getBoundingClientRect = (): DOMRect => {
      return new DOMRect(200, 100, 0, 0);
    };

    canvas.updatePort("port-2");

    const container = canvasElement.children[0].children[0];
    const edgeSvg = container.children[2] as SVGSVGElement;

    expect(edgeSvg.style.width).toBe("200px");
  });

  it("should update node without arguments", () => {
    const canvas = createCanvas();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    const nodeRequest2 = createNodeRequest2();
    canvas.addNode(nodeRequest2);
    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-2" });

    const port = (nodeRequest2.ports as Array<MarkNodePortRequest>)![0];
    port.element.getBoundingClientRect = (): DOMRect => {
      return new DOMRect(200, 100, 0, 0);
    };

    canvas.updateNode("node-2");

    const container = canvasElement.children[0].children[0];
    const edgeSvg = container.children[2] as SVGSVGElement;

    expect(edgeSvg.style.width).toBe("200px");
  });

  it("should remove edge", () => {
    const canvas = createCanvas();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    canvas.addNode(createNodeRequest2());
    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-2" });
    canvas.removeEdge("edge-1");

    const container = canvasElement.children[0].children[0];
    expect(container.children.length).toBe(2);
  });

  it("should mark port", () => {
    const canvas = createCanvas();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(addNodeRequest);
    canvas.markPort(markPortRequest);

    expect(() => {
      canvas.addEdge({ from: "port-1", to: "port-1" });
    }).not.toThrow(HtmlGraphError);
  });

  it("should update port direction", () => {
    const canvas = createCanvas();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(addNodeRequest);
    canvas.markPort(markPortRequest);

    const shape = new EdgeShapeMock();
    canvas.addEdge({ from: "port-1", to: "port-1", shape });

    const spy = jest.spyOn(shape, "render");

    canvas.updatePort("port-1", { direction: Math.PI });

    const expected: EdgeRenderParams = {
      from: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        portId: "port-1",
        nodeId: "node-1",
        direction: Math.PI,
      },
      to: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        portId: "port-1",
        nodeId: "node-1",
        direction: Math.PI,
      },
    };

    expect(spy).toHaveBeenCalledWith(expected);
  });

  it("should unmark port", () => {
    const canvas = createCanvas();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(addNodeRequest);
    canvas.markPort(markPortRequest);
    canvas.unmarkPort("port-1");

    expect(() => {
      canvas.addEdge({ from: "port-1", to: "port-1" });
    }).toThrow(HtmlGraphError);
  });

  it("should patch viewport matrix", () => {
    const canvas = createCanvas();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.patchViewportMatrix({ scale: 2, x: 2, y: 2 });

    const container = canvasElement.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(0.5, 0, 0, 0.5, -1, -1)");
  });

  it("should patch content matrix", () => {
    const canvas = createCanvas();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.patchContentMatrix({ scale: 2, x: 3, y: 4 });

    const container = canvasElement.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(2, 0, 0, 2, 3, 4)");
  });

  it("should clear canvas", () => {
    const canvas = createCanvas();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.addNode(createNodeRequest1());
    canvas.addNode(createNodeRequest2());
    canvas.addEdge({ from: "port-1", to: "port-2" });
    canvas.clear();

    const container = canvasElement.children[0].children[0];
    expect(container.children.length).toBe(0);
  });

  it("should clear canvas on destroy", () => {
    const canvas = createCanvas();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    canvas.addNode(createNodeRequest2());
    canvas.addEdge({ from: "port-1", to: "port-2" });
    canvas.destroy();

    expect(canvasElement.children.length).toBe(0);
  });
});
