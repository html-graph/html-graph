import { EdgeRenderParams } from "@/edges";
import { CoreCanvasController } from "./core-canvas-controller";
import { AddNodeRequest } from "../add-node-request";
import { MarkPortRequest } from "../mark-port-request";
import { standardCenterFn } from "@/center-fn";
import { AddEdgeRequest } from "../add-edge-request";
import { BezierEdgeShape } from "@/edges";
import { GraphStore } from "@/graph-store";
import { ViewportTransformer } from "@/viewport-transformer";
import { CoreHtmlView } from "@/html-view";
import { createElement } from "@/mocks";

const createCanvasController = (): CoreCanvasController => {
  const graphStore = new GraphStore();
  const viewportTransformer = new ViewportTransformer();

  return new CoreCanvasController(
    graphStore,
    viewportTransformer,
    new CoreHtmlView(graphStore, viewportTransformer),
  );
};

const createNodeRequest1 = (): AddNodeRequest => {
  return {
    id: "node-1",
    element: createElement(),
    x: 0,
    y: 0,
    centerFn: standardCenterFn,
    priority: 0,
  };
};

const createPortRequest1 = (): MarkPortRequest => {
  return {
    id: "port-1",
    nodeId: "node-1",
    element: createElement(),
    direction: 0,
  };
};

const createNodeRequest2 = (): AddNodeRequest => {
  return {
    id: "node-2",
    element: createElement(),
    x: 500,
    y: 500,
    centerFn: standardCenterFn,
    priority: 0,
  };
};

const createPortRequest2 = (): MarkPortRequest => {
  return {
    id: "port-2",
    nodeId: "node-2",
    element: createElement(),
    direction: 0,
  };
};

const createEdge12 = (): AddEdgeRequest => {
  return {
    id: "edge-1",
    from: "port-1",
    to: "port-2",
    shape: new BezierEdgeShape(),
    priority: 0,
  };
};

const createNodeRequest = (): AddNodeRequest => {
  return {
    id: "node-1",
    element: createElement(),
    x: 0,
    y: 0,
    centerFn: standardCenterFn,
    priority: 0,
  };
};

const createPortRequest = (): MarkPortRequest => {
  return {
    id: "port-1",
    element: createElement(),
    nodeId: "node-1",
    direction: 0,
  };
};

const createEdgeRequest = (): AddEdgeRequest => {
  return {
    id: "edge-1",
    from: "port-1",
    to: "port-1",
    shape: new BezierEdgeShape(),
    priority: 0,
  };
};

describe("CoreCanvasController", () => {
  it("should attach canvas", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);

    expect(canvasElement.children.length).toBe(1);
  });

  it("should detach canvas", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.detach();

    expect(canvasElement.children.length).toBe(0);
  });

  it("should create node", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());

    const container = canvasElement.children[0].children[0];
    expect(container.children.length).toBe(1);
  });

  it("should update node coordinates", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    canvas.updateNode("node-1", { x: 100, y: 100 });

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;
    expect(nodeWrapper.style.transform).toBe("translate(100px, 100px)");
  });

  it("should update node priority", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    canvas.updateNode("node-1", { priority: 10 });

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;
    expect(nodeWrapper.style.zIndex).toBe("10");
  });

  it("should update node centerFn", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode({
      id: "node-1",
      element: createElement({ width: 100, height: 100 }),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });
    canvas.updateNode("node-1", { centerFn: () => ({ x: 0, y: 0 }) });

    const container = canvasElement.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;
    expect(nodeWrapper.style.transform).toBe("translate(0px, 0px)");
  });

  it("should remove node", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    canvas.removeNode("node-1");

    const container = canvasElement.children[0].children[0];
    expect(container.children.length).toBe(0);
  });

  it("should unmark port when removing node", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    canvas.markPort(createPortRequest1());

    const spy = jest.spyOn(canvas, "unmarkPort");

    canvas.removeNode("node-1");

    expect(spy).toHaveBeenCalledWith("port-1");
  });

  it("should create edge", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    canvas.markPort(createPortRequest1());
    canvas.addNode(createNodeRequest2());
    canvas.markPort(createPortRequest2());
    canvas.addEdge(createEdge12());

    const container = canvasElement.children[0].children[0];
    expect(container.children.length).toBe(3);
  });

  it("should update edge shape", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    canvas.markPort(createPortRequest1());
    canvas.addNode(createNodeRequest2());
    canvas.markPort(createPortRequest2());
    canvas.addEdge(createEdge12());

    const shape = new BezierEdgeShape();

    canvas.updateEdge("edge-1", { shape });

    const container = canvasElement.children[0].children[0];
    const edgeSvg = container.children[2];
    expect(edgeSvg).toBe(shape.svg);
  });

  it("should update edge source", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    canvas.markPort(createPortRequest1());
    canvas.addNode(createNodeRequest2());
    canvas.markPort(createPortRequest2());
    const addEdge = createEdge12();
    canvas.addEdge(addEdge);

    const spy = jest.spyOn(addEdge.shape, "render");
    canvas.updateEdge("edge-1", { from: "port-2" });

    expect(spy).toHaveBeenCalledWith({
      from: {
        direction: 0,
        height: 0,
        nodeId: "node-2",
        portId: "port-2",
        width: 0,
        x: 0,
        y: 0,
      },
      to: {
        direction: 0,
        height: 0,
        nodeId: "node-2",
        portId: "port-2",
        width: 0,
        x: 0,
        y: 0,
      },
    });
  });

  it("should update edge target", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    canvas.markPort(createPortRequest1());
    canvas.addNode(createNodeRequest2());
    canvas.markPort(createPortRequest2());
    const addEdge = createEdge12();
    canvas.addEdge(addEdge);

    const spy = jest.spyOn(addEdge.shape, "render");
    canvas.updateEdge("edge-1", { to: "port-1" });

    expect(spy).toHaveBeenCalledWith({
      from: {
        direction: 0,
        height: 0,
        nodeId: "node-1",
        portId: "port-1",
        width: 0,
        x: 0,
        y: 0,
      },
      to: {
        direction: 0,
        height: 0,
        nodeId: "node-1",
        portId: "port-1",
        width: 0,
        x: 0,
        y: 0,
      },
    });
  });

  it("should update edge priority", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    canvas.markPort(createPortRequest1());
    canvas.addNode(createNodeRequest2());
    canvas.markPort(createPortRequest2());
    canvas.addEdge(createEdge12());

    canvas.updateEdge("edge-1", {
      priority: 10,
    });

    const container = canvasElement.children[0].children[0];
    const edgeSvg = container.children[2] as SVGSVGElement;
    expect(edgeSvg.style.zIndex).toBe("10");
  });

  it("should update edge without arguments", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    canvas.markPort(createPortRequest1());
    canvas.addNode(createNodeRequest2());
    const addPort2 = createPortRequest2();
    canvas.markPort(addPort2);
    canvas.addEdge(createEdge12());

    addPort2.element.getBoundingClientRect = (): DOMRect => {
      return new DOMRect(200, 100, 0, 0);
    };

    canvas.updateEdge("edge-1", {});

    const container = canvasElement.children[0].children[0];
    const edgeSvg = container.children[2] as SVGSVGElement;
    expect(edgeSvg.style.width).toBe("200px");
  });

  it("should update port without arguments", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    canvas.markPort(createPortRequest1());
    canvas.addNode(createNodeRequest2());
    const addPort2 = createPortRequest2();
    canvas.markPort(addPort2);
    canvas.addEdge(createEdge12());

    addPort2.element.getBoundingClientRect = (): DOMRect => {
      return new DOMRect(200, 100, 0, 0);
    };

    canvas.updatePort("port-2", {});

    const container = canvasElement.children[0].children[0];
    const edgeSvg = container.children[2] as SVGSVGElement;

    expect(edgeSvg.style.width).toBe("200px");
  });

  it("should update node without arguments", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    canvas.markPort(createPortRequest1());
    canvas.addNode(createNodeRequest2());
    const addPort2 = createPortRequest2();
    canvas.markPort(addPort2);
    canvas.addEdge(createEdge12());

    addPort2.element.getBoundingClientRect = (): DOMRect => {
      return new DOMRect(200, 100, 0, 0);
    };

    canvas.updateNode("node-2", {});

    const container = canvasElement.children[0].children[0];
    const edgeSvg = container.children[2] as SVGSVGElement;
    expect(edgeSvg.style.width).toBe("200px");
  });

  it("should remove edge", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    canvas.markPort(createPortRequest1());
    canvas.addNode(createNodeRequest2());
    canvas.markPort(createPortRequest2());
    canvas.addEdge(createEdge12());

    canvas.removeEdge("edge-1");

    const container = canvasElement.children[0].children[0];
    expect(container.children.length).toBe(2);
  });

  it("should mark port", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest());
    canvas.markPort(createPortRequest());

    expect(() => {
      canvas.addEdge(createEdgeRequest());
    }).not.toThrow();
  });

  it("should update port direction", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest());
    canvas.markPort(createPortRequest());

    const addEdge = createEdgeRequest();
    canvas.addEdge(addEdge);

    const spy = jest.spyOn(addEdge.shape, "render");

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
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest());
    canvas.markPort(createPortRequest());
    canvas.unmarkPort("port-1");

    expect(() => {
      canvas.addEdge(createEdgeRequest());
    }).toThrow();
  });

  it("should remove edge when port gest unmarked", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    canvas.markPort(createPortRequest1());
    canvas.addNode(createNodeRequest2());
    canvas.markPort(createPortRequest2());
    canvas.addEdge(createEdge12());

    canvas.unmarkPort("port-1");

    const container = canvasElement.children[0].children[0];
    expect(container.children.length).toBe(2);
  });

  it("should patch viewport matrix", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.patchViewportMatrix({ scale: 2, x: 2, y: 2 });

    const container = canvasElement.children[0].children[0] as HTMLElement;
    expect(container.style.transform).toBe("matrix(0.5, 0, 0, 0.5, -1, -1)");
  });

  it("should patch content matrix", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");
    canvas.attach(canvasElement);

    canvas.patchContentMatrix({ scale: 2, x: 3, y: 4 });

    const container = canvasElement.children[0].children[0] as HTMLElement;
    expect(container.style.transform).toBe("matrix(2, 0, 0, 2, 3, 4)");
  });

  it("should clear canvas", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.attach(canvasElement);
    canvas.addNode(createNodeRequest1());
    canvas.markPort(createPortRequest1());
    canvas.addNode(createNodeRequest2());
    canvas.markPort(createPortRequest2());
    canvas.addEdge(createEdge12());

    canvas.clear();

    const container = canvasElement.children[0].children[0];
    expect(container.children.length).toBe(0);
  });

  it("should clear canvas on destroy", () => {
    const canvas = createCanvasController();
    const canvasElement = document.createElement("div");

    canvas.addNode(createNodeRequest1());
    canvas.markPort(createPortRequest1());
    canvas.addNode(createNodeRequest2());
    canvas.markPort(createPortRequest2());
    canvas.addEdge(createEdge12());

    canvas.destroy();

    expect(canvasElement.children.length).toBe(0);
  });
});
