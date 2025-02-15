import { GraphStore } from "@/graph-store";
import { CanvasController } from "./canvas-controller";
import { HtmlController } from "@/html-controller";
import { ViewportTransformer } from "@/viewport-transformer";
import { Point } from "@/point";
import { AddNodeRequest } from "./add-node-request";
import { CenterFn } from "@/center-fn";
import { HtmlGraphError } from "@/error";
import { PriorityFn } from "@/priority";
import { MarkNodePortRequest } from "./mark-node-port-request";
import { MarkPortRequest } from "./mark-port-request";
import { AddEdgeRequest } from "./add-edge-request";
import { EdgeShapeMock } from "@/edges";
import { UpdatePortRequest } from "./update-port-request";
import { UpdateNodeRequest } from "./update-node-request";

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

const createHtmlController = (params?: {
  graphStore?: GraphStore;
  viewportTransformer?: ViewportTransformer;
}): HtmlController => {
  const graphStore = params?.graphStore ?? new GraphStore();
  const viewportTransformer =
    params?.viewportTransformer ?? new ViewportTransformer();

  return new HtmlController(graphStore, viewportTransformer);
};

const createCanvasController = (params?: {
  graphStore?: GraphStore;
  viewportTransformer?: ViewportTransformer;
  htmlController?: HtmlController;
  nodesCenterFn?: CenterFn;
  portsCenterFn?: CenterFn;
  portsDirection?: number;
  nodesPriorityFn?: PriorityFn;
  edgesPriorityFn?: PriorityFn;
}): CanvasController => {
  const graphStore = params?.graphStore ?? new GraphStore();
  const viewportTransformer =
    params?.viewportTransformer ?? new ViewportTransformer();
  const htmlController =
    params?.htmlController ??
    createHtmlController({ graphStore, viewportTransformer });

  return new CanvasController(
    graphStore,
    htmlController,
    viewportTransformer,
    params?.nodesCenterFn ?? ((): Point => ({ x: 0, y: 0 })),
    params?.portsDirection ?? 0,
    params?.nodesPriorityFn ?? ((): number => 0),
    params?.edgesPriorityFn ?? ((): number => 0),
  );
};

describe("CanvasController", () => {
  it("should add node to store", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    const addNodeRequest: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: undefined,
      centerFn: () => ({ x: 0, y: 0 }),
      priority: 0,
    };

    canvasController.addNode(addNodeRequest);

    const node = graphStore.getNode(addNodeRequest.nodeId);

    expect(node).toStrictEqual({
      element: addNodeRequest.element,
      x: addNodeRequest.x,
      y: addNodeRequest.y,
      centerFn: addNodeRequest.centerFn,
      priority: addNodeRequest.priority,
    });
  });

  it("should throw error when trying to node with existing id", () => {
    const canvasController = createCanvasController();

    const addNodeRequest1: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: undefined,
      centerFn: () => ({ x: 0, y: 0 }),
      priority: 0,
    };

    canvasController.addNode(addNodeRequest1);

    expect(() => {
      canvasController.addNode(addNodeRequest1);
    }).toThrow(HtmlGraphError);
  });

  it("should use default node center fn when not specified", () => {
    const graphStore = new GraphStore();
    const nodesCenterFn = (): Point => ({ x: 0, y: 0 });
    const canvasController = createCanvasController({
      graphStore,
      nodesCenterFn,
    });

    const addNodeRequest: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: undefined,
      centerFn: undefined,
      priority: 0,
    };

    canvasController.addNode(addNodeRequest);

    const node = graphStore.getNode(addNodeRequest.nodeId);

    expect(node).toStrictEqual({
      element: addNodeRequest.element,
      x: addNodeRequest.x,
      y: addNodeRequest.y,
      centerFn: nodesCenterFn,
      priority: addNodeRequest.priority,
    });
  });

  it("should attach node element", () => {
    const canvasController = createCanvasController();

    const div = document.createElement("div");
    canvasController.attach(div);

    const addNodeRequest: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: undefined,
      centerFn: undefined,
      priority: 0,
    };

    canvasController.addNode(addNodeRequest);

    const container = div.children[0].children[0];
    const element = container.children[0].children[0];

    expect(element).toBe(addNodeRequest.element);
  });

  it("should add specified port to store", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    const div = document.createElement("div");
    canvasController.attach(div);

    const addNodeRequest: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: undefined,
      centerFn: undefined,
      priority: undefined,
    };

    canvasController.addNode(addNodeRequest);

    const markPortRequest: MarkPortRequest = {
      portId: "port-1",
      nodeId: addNodeRequest.nodeId,
      element: document.createElement("div"),
      direction: 0,
    };

    canvasController.markPort(markPortRequest);

    const port = graphStore.getPort(markPortRequest.portId);

    expect(port).toStrictEqual({
      element: markPortRequest.element,
      direction: markPortRequest.direction,
    });
  });

  it("should use default port direction if not specified", () => {
    const portsDirection = Math.PI;
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({
      graphStore,
      portsDirection,
    });

    const div = document.createElement("div");
    canvasController.attach(div);

    const addNodeRequest: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: undefined,
      centerFn: undefined,
      priority: undefined,
    };

    canvasController.addNode(addNodeRequest);

    const markPortRequest: MarkPortRequest = {
      portId: "port-1",
      nodeId: addNodeRequest.nodeId,
      element: document.createElement("div"),
      direction: undefined,
    };

    canvasController.markPort(markPortRequest);

    const port = graphStore.getPort(markPortRequest.portId)!;

    expect(port.direction).toStrictEqual(portsDirection);
  });

  it("should throw error when trying to add port with existing id", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    const div = document.createElement("div");
    canvasController.attach(div);

    const addNodeRequest: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: undefined,
      centerFn: undefined,
      priority: undefined,
    };

    canvasController.addNode(addNodeRequest);

    const markPortRequest1: MarkPortRequest = {
      portId: "port-1",
      nodeId: addNodeRequest.nodeId,
      element: document.createElement("div"),
      direction: 0,
    };

    canvasController.markPort(markPortRequest1);

    expect(() => {
      canvasController.markPort(markPortRequest1);
    }).toThrow(HtmlGraphError);
  });

  it("should throw error when trying to add port to nonexisting node", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    const div = document.createElement("div");
    canvasController.attach(div);

    const markPortRequest1: MarkPortRequest = {
      portId: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    };

    expect(() => {
      canvasController.markPort(markPortRequest1);
    }).toThrow(HtmlGraphError);
  });

  it("should mark specified ports", () => {
    const canvasController = createCanvasController();

    const div = document.createElement("div");
    canvasController.attach(div);

    const markPortRequest: MarkNodePortRequest = {
      id: "port-1",
      element: document.createElement("div"),
      direction: 0,
    };

    const addNodeRequest: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: [markPortRequest],
      centerFn: undefined,
      priority: 0,
    };

    const spy = jest.spyOn(canvasController, "markPort");

    canvasController.addNode(addNodeRequest);

    expect(spy).toHaveBeenCalledWith({
      portId: markPortRequest.id,
      element: markPortRequest.element,
      nodeId: addNodeRequest.nodeId,
      direction: markPortRequest.direction,
    });
  });

  it("should attach edge", () => {
    const canvasController = createCanvasController();
    const div = document.createElement("div");
    canvasController.attach(div);

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest1],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest1);

    const markPortRequest2: MarkNodePortRequest = {
      id: "port-2",
      element: createElement({ x: 100, y: 100 }),
      direction: 0,
    };

    const addNodeRequest2: AddNodeRequest = {
      nodeId: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest2],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest2);

    const shape = new EdgeShapeMock();

    const addEdgeRequest12: AddEdgeRequest = {
      edgeId: "edge-1",
      from: "port-1",
      to: "port-2",
      priority: undefined,
      shape,
    };

    canvasController.addEdge(addEdgeRequest12);

    const container = div.children[0].children[0];
    const edgeSvg = container.children[2] as SVGSVGElement;

    expect(edgeSvg).toBe(shape.svg);
  });

  it("should throw error when trying to add existing edge", () => {
    const canvasController = createCanvasController();

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest1],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest1);

    const markPortRequest2: MarkNodePortRequest = {
      id: "port-2",
      element: createElement({ x: 100, y: 100 }),
      direction: 0,
    };

    const addNodeRequest2: AddNodeRequest = {
      nodeId: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest2],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest2);

    const shape = new EdgeShapeMock();

    const addEdgeRequest12: AddEdgeRequest = {
      edgeId: "edge-1",
      from: "port-1",
      to: "port-2",
      priority: undefined,
      shape,
    };

    canvasController.addEdge(addEdgeRequest12);

    expect(() => {
      canvasController.addEdge(addEdgeRequest12);
    }).toThrow(HtmlGraphError);
  });

  it("should throw error when trying to attach edge to nonexisting port", () => {
    const canvasController = createCanvasController();

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest1],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest1);

    const shape = new EdgeShapeMock();

    const addEdgeRequest12: AddEdgeRequest = {
      edgeId: "edge-1",
      from: "port-1",
      to: "port-2",
      priority: undefined,
      shape,
    };

    expect(() => {
      canvasController.addEdge(addEdgeRequest12);
    }).toThrow(HtmlGraphError);
  });

  it("should throw error when trying to attach edge from nonexisting port", () => {
    const canvasController = createCanvasController();

    const markPortRequest2: MarkNodePortRequest = {
      id: "port-2",
      element: createElement({ x: 100, y: 100 }),
      direction: 0,
    };

    const addNodeRequest2: AddNodeRequest = {
      nodeId: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest2],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest2);

    const shape = new EdgeShapeMock();

    const addEdgeRequest12: AddEdgeRequest = {
      edgeId: "edge-1",
      from: "port-1",
      to: "port-2",
      priority: undefined,
      shape,
    };

    expect(() => {
      canvasController.addEdge(addEdgeRequest12);
    }).toThrow(HtmlGraphError);
  });

  it("should update edge coordinates", () => {
    const canvasController = createCanvasController();
    const div = document.createElement("div");
    canvasController.attach(div);

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest1],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest1);

    const markPortRequest2: MarkNodePortRequest = {
      id: "port-2",
      element: createElement({ x: 100, y: 100 }),
      direction: 0,
    };

    const addNodeRequest2: AddNodeRequest = {
      nodeId: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest2],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest2);

    const shape = new EdgeShapeMock();

    const addEdgeRequest12: AddEdgeRequest = {
      edgeId: "edge-1-2",
      from: "port-1",
      to: "port-2",
      priority: undefined,
      shape,
    };

    canvasController.addEdge(addEdgeRequest12);

    markPortRequest1.element.getBoundingClientRect = (): DOMRect => {
      return new DOMRect(-100, -100, 0, 0);
    };

    const spy = jest.spyOn(shape, "render");

    canvasController.updateEdge({
      edgeId: addEdgeRequest12.edgeId,
      shape: undefined,
      priority: undefined,
      from: undefined,
      to: undefined,
    });

    expect(spy).toHaveBeenCalledWith({
      source: {
        x: -100,
        y: -100,
        width: 0,
        height: 0,
        direction: 0,
        nodeId: "node-1",
        portId: "port-1",
      },
      target: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        direction: 0,
        nodeId: "node-2",
        portId: "port-2",
      },
    });
  });

  it("should update edge shape if specified", () => {
    const canvasController = createCanvasController();
    const div = document.createElement("div");
    canvasController.attach(div);

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest1],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest1);

    const markPortRequest2: MarkNodePortRequest = {
      id: "port-2",
      element: createElement({ x: 100, y: 100 }),
      direction: 0,
    };

    const addNodeRequest2: AddNodeRequest = {
      nodeId: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest2],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest2);

    const addEdgeRequest12: AddEdgeRequest = {
      edgeId: "edge-1-2",
      from: "port-1",
      to: "port-2",
      priority: undefined,
      shape: new EdgeShapeMock(),
    };

    canvasController.addEdge(addEdgeRequest12);

    const newShape = new EdgeShapeMock();

    canvasController.updateEdge({
      edgeId: addEdgeRequest12.edgeId,
      shape: newShape,
      priority: undefined,
      from: undefined,
      to: undefined,
    });

    const container = div.children[0].children[0];
    const edgeSvg = container.children[2] as SVGSVGElement;

    expect(edgeSvg).toBe(newShape.svg);
  });

  it("should update edge priority if specified", () => {
    const canvasController = createCanvasController();
    const div = document.createElement("div");
    canvasController.attach(div);

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest1],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest1);

    const markPortRequest2: MarkNodePortRequest = {
      id: "port-2",
      element: createElement({ x: 100, y: 100 }),
      direction: 0,
    };

    const addNodeRequest2: AddNodeRequest = {
      nodeId: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest2],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest2);

    const addEdgeRequest12: AddEdgeRequest = {
      edgeId: "edge-1-2",
      from: "port-1",
      to: "port-2",
      priority: undefined,
      shape: new EdgeShapeMock(),
    };

    canvasController.addEdge(addEdgeRequest12);

    canvasController.updateEdge({
      edgeId: addEdgeRequest12.edgeId,
      shape: undefined,
      priority: 10,
      from: undefined,
      to: undefined,
    });

    const container = div.children[0].children[0];
    const edgeSvg = container.children[2] as SVGSVGElement;

    expect(edgeSvg.style.zIndex).toBe("10");
  });

  it("should throw error when trying to update nonexisting edge", () => {
    const canvasController = createCanvasController();

    expect(() => {
      canvasController.updateEdge({
        edgeId: "edge-1",
        shape: undefined,
        priority: undefined,
        from: undefined,
        to: undefined,
      });
    }).toThrow(HtmlGraphError);
  });

  it("should update port direction", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest1],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest1);

    const updatePortRequest: UpdatePortRequest = {
      direction: Math.PI,
    };

    canvasController.updatePort(markPortRequest1.id, updatePortRequest);

    const port = graphStore.getPort(markPortRequest1.id)!;

    expect(port.direction).toBe(updatePortRequest.direction);
  });

  it("should update edge adjacent to port", () => {
    const canvasController = createCanvasController();
    const div = document.createElement("div");
    canvasController.attach(div);

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0, width: 50, height: 50 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest1],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest1);

    const markPortRequest2: MarkNodePortRequest = {
      id: "port-2",
      element: createElement({ x: 100, y: 100 }),
      direction: 0,
    };

    const addNodeRequest2: AddNodeRequest = {
      nodeId: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest2],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest2);

    const shape = new EdgeShapeMock();

    const addEdgeRequest12: AddEdgeRequest = {
      edgeId: "edge-1-2",
      from: "port-1",
      to: "port-2",
      priority: undefined,
      shape,
    };

    canvasController.addEdge(addEdgeRequest12);

    const updatePortRequest: UpdatePortRequest = {
      direction: undefined,
    };

    const spy = jest.spyOn(shape, "render");
    canvasController.updatePort(markPortRequest1.id, updatePortRequest);

    expect(spy).toHaveBeenCalledWith({
      source: {
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        direction: 0,
        nodeId: "node-1",
        portId: "port-1",
      },
      target: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        direction: 0,
        nodeId: "node-2",
        portId: "port-2",
      },
    });
  });

  it("should throw error when trying to update nonexisting port", () => {
    const canvasController = createCanvasController();

    expect(() => {
      canvasController.updatePort("port-1", {
        direction: undefined,
      });
    }).toThrow(HtmlGraphError);
  });

  it("should update node x coordinate if specified", () => {
    const canvasController = createCanvasController();
    const div = document.createElement("div");
    canvasController.attach(div);

    const addNodeRequest: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: undefined,
      centerFn: () => ({ x: 0, y: 0 }),
      priority: 0,
    };

    canvasController.addNode(addNodeRequest);

    const updateNodeRequest: UpdateNodeRequest = {
      x: 100,
      y: undefined,
      priority: undefined,
      centerFn: undefined,
    };

    canvasController.updateNode(addNodeRequest.nodeId, updateNodeRequest);

    const container = div.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(100px, 0px)");
  });

  it("should update node y coordinate if specified", () => {
    const canvasController = createCanvasController();
    const div = document.createElement("div");
    canvasController.attach(div);

    const addNodeRequest: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: undefined,
      centerFn: () => ({ x: 0, y: 0 }),
      priority: 0,
    };

    canvasController.addNode(addNodeRequest);

    const updateNodeRequest: UpdateNodeRequest = {
      x: undefined,
      y: 100,
      priority: undefined,
      centerFn: undefined,
    };

    canvasController.updateNode(addNodeRequest.nodeId, updateNodeRequest);

    const container = div.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(0px, 100px)");
  });

  it("should update node priority if specified", () => {
    const canvasController = createCanvasController();
    const div = document.createElement("div");
    canvasController.attach(div);

    const addNodeRequest: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: undefined,
      centerFn: () => ({ x: 0, y: 0 }),
      priority: 0,
    };

    canvasController.addNode(addNodeRequest);

    const updateNodeRequest: UpdateNodeRequest = {
      x: undefined,
      y: undefined,
      priority: 10,
      centerFn: undefined,
    };

    canvasController.updateNode(addNodeRequest.nodeId, updateNodeRequest);

    const container = div.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.zIndex).toBe("10");
  });

  it("should update node centerFn if specified", () => {
    const canvasController = createCanvasController();
    const div = document.createElement("div");
    canvasController.attach(div);

    const addNodeRequest: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement({ width: 100, height: 100 }),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: undefined,
      priority: 0,
    };

    canvasController.addNode(addNodeRequest);

    const updateNodeRequest: UpdateNodeRequest = {
      x: undefined,
      y: undefined,
      priority: undefined,
      centerFn: (width, height) => ({ x: width, y: height }),
    };

    canvasController.updateNode(addNodeRequest.nodeId, updateNodeRequest);

    const container = div.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLElement;

    expect(nodeWrapper.style.transform).toBe("translate(-100px, -100px)");
  });

  it("should throw error when trying to update nonexisting node", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    expect(() => {
      canvasController.updateNode(1);
    }).toThrow(HtmlGraphError);
  });

  it("should update edge adjacent to node", () => {
    const canvasController = createCanvasController();
    const div = document.createElement("div");
    canvasController.attach(div);

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0, width: 50, height: 50 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest1],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest1);

    const markPortRequest2: MarkNodePortRequest = {
      id: "port-2",
      element: createElement({ x: 100, y: 100 }),
      direction: 0,
    };

    const addNodeRequest2: AddNodeRequest = {
      nodeId: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest2],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest2);

    const shape = new EdgeShapeMock();

    const addEdgeRequest12: AddEdgeRequest = {
      edgeId: "edge-1-2",
      from: "port-1",
      to: "port-2",
      priority: undefined,
      shape,
    };

    canvasController.addEdge(addEdgeRequest12);

    const updateNodeRequest: UpdateNodeRequest = {
      x: undefined,
      y: undefined,
      centerFn: undefined,
      priority: undefined,
    };

    markPortRequest1.element.getBoundingClientRect = (): DOMRect => {
      return new DOMRect(50, 50, 0, 0);
    };

    const spy = jest.spyOn(shape, "render");

    canvasController.updateNode(addNodeRequest1.nodeId, updateNodeRequest);

    expect(spy).toHaveBeenCalledWith({
      source: {
        x: 50,
        y: 50,
        width: 0,
        height: 0,
        direction: 0,
        nodeId: "node-1",
        portId: "port-1",
      },
      target: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        direction: 0,
        nodeId: "node-2",
        portId: "port-2",
      },
    });
  });

  it("should remove edge from store", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0, width: 50, height: 50 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest1],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest1);

    const markPortRequest2: MarkNodePortRequest = {
      id: "port-2",
      element: createElement({ x: 100, y: 100 }),
      direction: 0,
    };

    const addNodeRequest2: AddNodeRequest = {
      nodeId: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest2],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest2);

    const addEdgeRequest12: AddEdgeRequest = {
      edgeId: "edge-1-2",
      from: "port-1",
      to: "port-2",
      priority: undefined,
      shape: new EdgeShapeMock(),
    };

    canvasController.addEdge(addEdgeRequest12);

    canvasController.removeEdge(addEdgeRequest12.edgeId);

    const edge = graphStore.getEdge(addEdgeRequest12.edgeId);

    expect(edge).toBe(undefined);
  });

  it("should remove edge from DOM", () => {
    const canvasController = createCanvasController();
    const div = document.createElement("div");
    canvasController.attach(div);

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0, width: 50, height: 50 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest1],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest1);

    const markPortRequest2: MarkNodePortRequest = {
      id: "port-2",
      element: createElement({ x: 100, y: 100 }),
      direction: 0,
    };

    const addNodeRequest2: AddNodeRequest = {
      nodeId: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest2],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest2);

    const addEdgeRequest12: AddEdgeRequest = {
      edgeId: "edge-1-2",
      from: "port-1",
      to: "port-2",
      priority: undefined,
      shape: new EdgeShapeMock(),
    };

    canvasController.addEdge(addEdgeRequest12);

    canvasController.removeEdge(addEdgeRequest12.edgeId);

    const container = div.children[0].children[0] as HTMLElement;

    expect(container.children.length).toBe(2);
  });

  it("should throw error when trying to remove nonexisting edge", () => {
    const canvasController = createCanvasController();

    expect(() => {
      canvasController.removeEdge("edge-1");
    }).toThrow(HtmlGraphError);
  });

  it("should remove port from store", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0, width: 50, height: 50 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest1],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest1);
    canvasController.unmarkPort(markPortRequest1.id);

    const port = graphStore.getPort(markPortRequest1.id);

    expect(port).toBe(undefined);
  });

  it("should remove adjacent to port edges", () => {
    const canvasController = createCanvasController();

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0, width: 50, height: 50 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest1],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest1);

    const markPortRequest2: MarkNodePortRequest = {
      id: "port-2",
      element: createElement({ x: 100, y: 100 }),
      direction: 0,
    };

    const addNodeRequest2: AddNodeRequest = {
      nodeId: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest2],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest2);

    const addEdgeRequest12: AddEdgeRequest = {
      edgeId: "edge-1-2",
      from: "port-1",
      to: "port-2",
      priority: undefined,
      shape: new EdgeShapeMock(),
    };

    canvasController.addEdge(addEdgeRequest12);

    const spy = jest.spyOn(canvasController, "removeEdge");

    canvasController.unmarkPort(markPortRequest1.id);

    expect(spy).toHaveBeenCalledWith(addEdgeRequest12.edgeId);
  });

  it("should throw error when trying to unmark nonexisting port", () => {
    const canvasController = createCanvasController();

    expect(() => {
      canvasController.unmarkPort("port-1");
    }).toThrow(HtmlGraphError);
  });

  it("should remove node from store", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    const addNodeRequest1: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: undefined,
      priority: 0,
    };

    canvasController.addNode(addNodeRequest1);

    canvasController.removeNode(addNodeRequest1.nodeId);

    const node = graphStore.getNode(addNodeRequest1.nodeId);

    expect(node).toBe(undefined);
  });

  it("should remove node from DOM", () => {
    const canvasController = createCanvasController();
    const div = document.createElement("div");
    canvasController.attach(div);

    const addNodeRequest1: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: undefined,
      priority: 0,
    };

    canvasController.addNode(addNodeRequest1);
    canvasController.removeNode(addNodeRequest1.nodeId);

    const container = div.children[0].children[0] as HTMLElement;

    expect(container.children.length).toBe(0);
  });

  it("should unmark node ports", () => {
    const canvasController = createCanvasController();

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0, width: 50, height: 50 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest1],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest1);

    const spy = jest.spyOn(canvasController, "unmarkPort");

    canvasController.removeNode(addNodeRequest1.nodeId);

    expect(spy).toHaveBeenCalledWith(markPortRequest1.id);
  });

  it("should update viewport transform in DOM", () => {
    const canvasController = createCanvasController();
    const div = document.createElement("div");
    canvasController.attach(div);

    canvasController.patchViewportMatrix({ scale: 2, dx: 2, dy: 2 });

    const container = div.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(0.5, 0, 0, 0.5, -1, -1)");
  });

  it("should update content transform in DOM", () => {
    const canvasController = createCanvasController();
    const div = document.createElement("div");
    canvasController.attach(div);

    canvasController.patchContentMatrix({ scale: 2, dx: 2, dy: 2 });

    const container = div.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(2, 0, 0, 2, 2, 2)");
  });

  it("should clear DOM", () => {
    const htmlController = createHtmlController();
    const canvasController = createCanvasController({ htmlController });

    const spy = jest.spyOn(htmlController, "clear");

    canvasController.clear();

    expect(spy).toHaveBeenCalled();
  });

  it("should clear store", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    const spy = jest.spyOn(graphStore, "clear");

    canvasController.clear();

    expect(spy).toHaveBeenCalled();
  });

  it("should clear on destroy", () => {
    const canvasController = createCanvasController();

    const spy = jest.spyOn(canvasController, "clear");

    canvasController.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should detach html controller", () => {
    const htmlController = createHtmlController();
    const canvasController = createCanvasController({ htmlController });

    const spy = jest.spyOn(htmlController, "detach");

    canvasController.detach();

    expect(spy).toHaveBeenCalled();
  });

  it("should add node with unspecified id", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    const addNodeRequest: AddNodeRequest = {
      nodeId: undefined,
      element: createElement(),
      x: 0,
      y: 0,
      ports: undefined,
      centerFn: () => ({ x: 0, y: 0 }),
      priority: 0,
    };

    canvasController.addNode(addNodeRequest);

    const nodes = graphStore.getAllNodeIds();

    expect(nodes.length).toBe(1);
  });

  it("should add port with unspecified id", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    const addNodeRequest: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: undefined,
      centerFn: () => ({ x: 0, y: 0 }),
      priority: 0,
    };

    canvasController.addNode(addNodeRequest);

    const markPortRequest1: MarkPortRequest = {
      portId: undefined,
      nodeId: addNodeRequest.nodeId,
      element: document.createElement("div"),
      direction: 0,
    };

    canvasController.markPort(markPortRequest1);

    const ports = graphStore.getAllPortIds();

    expect(ports.length).toBe(1);
  });

  it("should add edge with unspecified id", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });
    const div = document.createElement("div");
    canvasController.attach(div);

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest1],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest1);

    const markPortRequest2: MarkNodePortRequest = {
      id: "port-2",
      element: createElement({ x: 100, y: 100 }),
      direction: 0,
    };

    const addNodeRequest2: AddNodeRequest = {
      nodeId: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest2],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest2);

    const shape = new EdgeShapeMock();

    const addEdgeRequest12: AddEdgeRequest = {
      edgeId: undefined,
      from: "port-1",
      to: "port-2",
      priority: undefined,
      shape,
    };

    canvasController.addEdge(addEdgeRequest12);

    const edges = graphStore.getAllEdgeIds();

    expect(edges.length).toBe(1);
  });

  it("should throw error when trying to remove nonexisting node", () => {
    const canvasController = createCanvasController();

    expect(() => {
      canvasController.removeNode("node-1");
    }).toThrow(HtmlGraphError);
  });

  it("should update edge source", () => {
    const canvasController = createCanvasController();
    const div = document.createElement("div");
    canvasController.attach(div);

    const addNodeRequest1: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [
        {
          id: "port-1",
          element: createElement({ x: 0, y: 0 }),
          direction: 0,
        },
        {
          id: "port-2",
          element: createElement({ x: 100, y: 100 }),
          direction: 0,
        },
      ],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest1);

    const shape = new EdgeShapeMock();

    const addEdgeRequest: AddEdgeRequest = {
      edgeId: "con-1",
      from: "port-2",
      to: "port-2",
      priority: undefined,
      shape,
    };

    canvasController.addEdge(addEdgeRequest);

    const spy = jest.spyOn(shape, "render");

    canvasController.updateEdge({
      edgeId: "con-1",
      from: "port-1",
      to: undefined,
      shape: undefined,
      priority: undefined,
    });

    expect(spy).toHaveBeenCalledWith({
      source: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
        nodeId: "node-1",
        portId: "port-1",
      },
      target: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        direction: 0,
        nodeId: "node-1",
        portId: "port-2",
      },
    });
  });

  it("should update edge target", () => {
    const canvasController = createCanvasController();
    const div = document.createElement("div");
    canvasController.attach(div);

    const addNodeRequest1: AddNodeRequest = {
      nodeId: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [
        {
          id: "port-1",
          element: createElement({ x: 0, y: 0 }),
          direction: 0,
        },
        {
          id: "port-2",
          element: createElement({ x: 100, y: 100 }),
          direction: 0,
        },
      ],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest1);

    const shape = new EdgeShapeMock();

    const addEdgeRequest: AddEdgeRequest = {
      edgeId: "con-1",
      from: "port-1",
      to: "port-1",
      priority: undefined,
      shape,
    };

    canvasController.addEdge(addEdgeRequest);

    const spy = jest.spyOn(shape, "render");

    canvasController.updateEdge({
      edgeId: "con-1",
      from: undefined,
      to: "port-2",
      shape: undefined,
      priority: undefined,
    });

    expect(spy).toHaveBeenCalledWith({
      source: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
        nodeId: "node-1",
        portId: "port-1",
      },
      target: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        direction: 0,
        nodeId: "node-1",
        portId: "port-2",
      },
    });
  });
});
