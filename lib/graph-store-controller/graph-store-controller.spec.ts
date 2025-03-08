import { GraphStore } from "@/graph-store";
import { GraphStoreController } from "./graph-store-controller";
import { Point } from "@/point";
import { AddNodeRequest } from "./add-node-request";
import { CenterFn } from "@/center-fn";
import { HtmlGraphError } from "@/error";
import { PriorityFn } from "@/priority";
import { MarkNodePortRequest } from "./mark-node-port-request";
import { MarkPortRequest } from "./mark-port-request";
import { AddEdgeRequest } from "./add-edge-request";
import { EdgeRenderParams, EdgeShape, EdgeShapeMock } from "@/edges";
import { UpdatePortRequest } from "./update-port-request";
import { UpdateNodeRequest } from "./update-node-request";
import { EdgeShapeFactory } from "./edge-shape-factory";

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

const createCanvasController = (params?: {
  graphStore?: GraphStore;
  nodesCenterFn?: CenterFn;
  portsCenterFn?: CenterFn;
  portsDirection?: number;
  nodesPriorityFn?: PriorityFn;
  edgesPriorityFn?: PriorityFn;
  edgesShapeFactory?: EdgeShapeFactory;
}): GraphStoreController => {
  const graphStore = params?.graphStore ?? new GraphStore();

  return new GraphStoreController(
    graphStore,
    {
      nodes: {
        centerFn: params?.nodesCenterFn ?? ((): Point => ({ x: 0, y: 0 })),
        priorityFn: params?.nodesPriorityFn ?? ((): number => 0),
      },
      ports: {
        direction: params?.portsDirection ?? 0,
      },
      edges: {
        priorityFn: params?.edgesPriorityFn ?? ((): number => 0),
        shapeFactory:
          params?.edgesShapeFactory ?? ((): EdgeShape => new EdgeShapeMock()),
      },
    },
    {
      onAfterNodeAdded: (): void => {
        //
      },
      onAfterEdgeAdded: (): void => {
        //
      },
      onAfterEdgeShapeUpdated: (): void => {
        //
      },
      onAfterEdgePriorityUpdated: (): void => {
        //
      },
      onAfterEdgeUpdated: (): void => {
        //
      },
      onAfterPortUpdated: (): void => {
        //
      },
      onAfterNodePriorityUpdated: (): void => {
        //
      },
      onAfterNodeUpdated: (): void => {
        //
      },
      onBeforeEdgeRemoved: (): void => {
        //
      },
      onBeforeNodeRemoved: (): void => {
        //
      },
    },
  );
};

describe("CanvasController", () => {
  it("should add node to store", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      priority: 0,
    };

    canvasController.addNode(addNodeRequest);

    const node = graphStore.getNode(addNodeRequest.id);

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
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
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
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      priority: 0,
    };

    canvasController.addNode(addNodeRequest);

    const node = graphStore.getNode(addNodeRequest.id);

    expect(node).toStrictEqual({
      element: addNodeRequest.element,
      x: addNodeRequest.x,
      y: addNodeRequest.y,
      centerFn: nodesCenterFn,
      priority: addNodeRequest.priority,
    });
  });

  it("should add specified port to store", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    };

    canvasController.addNode(addNodeRequest);

    const markPortRequest: MarkPortRequest = {
      id: "port-1",
      nodeId: addNodeRequest.id,
      element: document.createElement("div"),
      direction: 0,
    };

    canvasController.markPort(markPortRequest);

    const port = graphStore.getPort(markPortRequest.id);

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

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    };

    canvasController.addNode(addNodeRequest);

    const markPortRequest: MarkPortRequest = {
      id: "port-1",
      nodeId: addNodeRequest.id,
      element: document.createElement("div"),
    };

    canvasController.markPort(markPortRequest);

    const port = graphStore.getPort(markPortRequest.id)!;

    expect(port.direction).toStrictEqual(portsDirection);
  });

  it("should throw error when trying to add port with existing id", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    };

    canvasController.addNode(addNodeRequest);

    const markPortRequest1: MarkPortRequest = {
      id: "port-1",
      nodeId: addNodeRequest.id,
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

    const markPortRequest1: MarkPortRequest = {
      id: "port-1",
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

    const markPortRequest: MarkNodePortRequest = {
      id: "port-1",
      element: document.createElement("div"),
      direction: 0,
    };

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      ports: [markPortRequest],
      priority: 0,
    };

    const spy = jest.spyOn(canvasController, "markPort");

    canvasController.addNode(addNodeRequest);

    expect(spy).toHaveBeenCalledWith({
      id: markPortRequest.id,
      element: markPortRequest.element,
      nodeId: addNodeRequest.id,
      direction: markPortRequest.direction,
    });
  });

  it("should throw error when trying to add existing edge", () => {
    const canvasController = createCanvasController();

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      id: "node-1",
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
      id: "node-2",
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
      id: "edge-1",
      from: "port-1",
      to: "port-2",
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
      id: "node-1",
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
      id: "edge-1",
      from: "port-1",
      to: "port-2",
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
      id: "node-2",
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
      id: "edge-1",
      from: "port-1",
      to: "port-2",
      shape,
    };

    expect(() => {
      canvasController.addEdge(addEdgeRequest12);
    }).toThrow(HtmlGraphError);
  });

  it("should update edge coordinates", () => {
    const canvasController = createCanvasController();
    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      id: "node-1",
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
      id: "node-2",
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
      id: "edge-1-2",
      from: "port-1",
      to: "port-2",
      shape,
    };

    canvasController.addEdge(addEdgeRequest12);

    markPortRequest1.element.getBoundingClientRect = (): DOMRect => {
      return new DOMRect(-100, -100, 0, 0);
    };

    const spy = jest.spyOn(shape, "render");

    canvasController.updateEdge(addEdgeRequest12.id, {});

    const expected: EdgeRenderParams = {
      from: {
        x: -100,
        y: -100,
        width: 0,
        height: 0,
        direction: 0,
        nodeId: "node-1",
        portId: "port-1",
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        direction: 0,
        nodeId: "node-2",
        portId: "port-2",
      },
    };

    expect(spy).toHaveBeenCalledWith(expected);
  });

  it("should update edge shape if specified", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      id: "node-1",
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
      id: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest2],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest2);

    const addEdgeRequest12: AddEdgeRequest = {
      id: "edge-1-2",
      from: "port-1",
      to: "port-2",
      shape: new EdgeShapeMock(),
    };

    canvasController.addEdge(addEdgeRequest12);

    const newShape = new EdgeShapeMock();

    canvasController.updateEdge(addEdgeRequest12.id, {
      shape: newShape,
    });

    const edge = graphStore.getEdge("edge-1-2");
    expect(edge?.shape).toBe(newShape);
  });

  it("should update edge priority if specified", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      id: "node-1",
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
      id: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest2],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest2);

    const addEdgeRequest12: AddEdgeRequest = {
      id: "edge-1-2",
      from: "port-1",
      to: "port-2",
      shape: new EdgeShapeMock(),
    };

    canvasController.addEdge(addEdgeRequest12);

    canvasController.updateEdge(addEdgeRequest12.id, {
      priority: 10,
    });

    const edge = graphStore.getEdge("edge-1-2");

    expect(edge?.priority).toBe(10);
  });

  it("should throw error when trying to update nonexisting edge", () => {
    const canvasController = createCanvasController();

    expect(() => {
      canvasController.updateEdge("edge-1", {});
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
      id: "node-1",
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

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0, width: 50, height: 50 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      id: "node-1",
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
      id: "node-2",
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
      id: "edge-1-2",
      from: "port-1",
      to: "port-2",
      shape,
    };

    canvasController.addEdge(addEdgeRequest12);

    const updatePortRequest: UpdatePortRequest = {};

    const spy = jest.spyOn(shape, "render");
    canvasController.updatePort(markPortRequest1.id, updatePortRequest);

    const expected: EdgeRenderParams = {
      from: {
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        direction: 0,
        nodeId: "node-1",
        portId: "port-1",
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        direction: 0,
        nodeId: "node-2",
        portId: "port-2",
      },
    };

    expect(spy).toHaveBeenCalledWith(expected);
  });

  it("should throw error when trying to update nonexisting port", () => {
    const canvasController = createCanvasController();

    expect(() => {
      canvasController.updatePort("port-1", {});
    }).toThrow(HtmlGraphError);
  });

  it("should update node x coordinate if specified", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      priority: 0,
    };

    canvasController.addNode(addNodeRequest);

    const updateNodeRequest: UpdateNodeRequest = {
      x: 100,
    };

    canvasController.updateNode(addNodeRequest.id, updateNodeRequest);

    const node = graphStore.getNode("node-1")!;

    expect(node.x).toBe(100);
  });

  it("should update node y coordinate if specified", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      priority: 0,
    };

    canvasController.addNode(addNodeRequest);

    const updateNodeRequest: UpdateNodeRequest = {
      y: 100,
    };

    canvasController.updateNode(addNodeRequest.id, updateNodeRequest);

    const node = graphStore.getNode("node-1")!;

    expect(node.y).toBe(100);
  });

  it("should update node priority if specified", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      priority: 0,
    };

    canvasController.addNode(addNodeRequest);

    const updateNodeRequest: UpdateNodeRequest = {
      priority: 10,
    };

    canvasController.updateNode(addNodeRequest.id, updateNodeRequest);

    const node = graphStore.getNode("node-1")!;

    expect(node.priority).toBe(10);
  });

  it("should update node centerFn if specified", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: createElement({ width: 100, height: 100 }),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      priority: 0,
    };

    canvasController.addNode(addNodeRequest);

    const centerFn: CenterFn = (width, height) => ({ x: width, y: height });
    const updateNodeRequest: UpdateNodeRequest = {
      centerFn,
    };

    canvasController.updateNode(addNodeRequest.id, updateNodeRequest);

    const node = graphStore.getNode("node-1")!;

    expect(node.centerFn).toBe(centerFn);
  });

  it("should throw error when trying to update nonexisting node", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    expect(() => {
      canvasController.updateNode(1, {});
    }).toThrow(HtmlGraphError);
  });

  it("should update edge adjacent to node", () => {
    const canvasController = createCanvasController();

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0, width: 50, height: 50 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      id: "node-1",
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
      id: "node-2",
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
      id: "edge-1-2",
      from: "port-1",
      to: "port-2",
      shape,
    };

    canvasController.addEdge(addEdgeRequest12);

    const updateNodeRequest: UpdateNodeRequest = {};

    markPortRequest1.element.getBoundingClientRect = (): DOMRect => {
      return new DOMRect(50, 50, 0, 0);
    };

    const spy = jest.spyOn(shape, "render");

    canvasController.updateNode(addNodeRequest1.id, updateNodeRequest);

    const expected: EdgeRenderParams = {
      from: {
        x: 50,
        y: 50,
        width: 0,
        height: 0,
        direction: 0,
        nodeId: "node-1",
        portId: "port-1",
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        direction: 0,
        nodeId: "node-2",
        portId: "port-2",
      },
    };

    expect(spy).toHaveBeenCalledWith(expected);
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
      id: "node-1",
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
      id: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest2],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest2);

    const addEdgeRequest12: AddEdgeRequest = {
      id: "edge-1-2",
      from: "port-1",
      to: "port-2",
      shape: new EdgeShapeMock(),
    };

    canvasController.addEdge(addEdgeRequest12);

    canvasController.removeEdge(addEdgeRequest12.id);

    const edge = graphStore.getEdge(addEdgeRequest12.id);

    expect(edge).toBe(undefined);
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
      id: "node-1",
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
      id: "node-1",
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
      id: "node-2",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest2],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest2);

    const addEdgeRequest12: AddEdgeRequest = {
      id: "edge-1-2",
      from: "port-1",
      to: "port-2",
      shape: new EdgeShapeMock(),
    };

    canvasController.addEdge(addEdgeRequest12);

    const spy = jest.spyOn(canvasController, "removeEdge");

    canvasController.unmarkPort(markPortRequest1.id);

    expect(spy).toHaveBeenCalledWith(addEdgeRequest12.id);
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
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      priority: 0,
    };

    canvasController.addNode(addNodeRequest1);

    canvasController.removeNode(addNodeRequest1.id);

    const node = graphStore.getNode(addNodeRequest1.id);

    expect(node).toBe(undefined);
  });

  it("should unmark node ports", () => {
    const canvasController = createCanvasController();

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0, width: 50, height: 50 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      ports: [markPortRequest1],
      priority: 0,
    };

    canvasController.addNode(addNodeRequest1);

    const spy = jest.spyOn(canvasController, "unmarkPort");

    canvasController.removeNode(addNodeRequest1.id);

    expect(spy).toHaveBeenCalledWith(markPortRequest1.id);
  });

  it("should clear store", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    const spy = jest.spyOn(graphStore, "clear");

    canvasController.clear();

    expect(spy).toHaveBeenCalled();
  });

  it("should add node with unspecified id", () => {
    const graphStore = new GraphStore();
    const canvasController = createCanvasController({ graphStore });

    const addNodeRequest: AddNodeRequest = {
      element: createElement(),
      x: 0,
      y: 0,
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
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      priority: 0,
    };

    canvasController.addNode(addNodeRequest);

    const markPortRequest1: MarkPortRequest = {
      nodeId: addNodeRequest.id,
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

    const markPortRequest1: MarkNodePortRequest = {
      id: "port-1",
      element: createElement({ x: 0, y: 0 }),
      direction: 0,
    };

    const addNodeRequest1: AddNodeRequest = {
      id: "node-1",
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
      id: "node-2",
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
      from: "port-1",
      to: "port-2",
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

    const addNodeRequest1: AddNodeRequest = {
      id: "node-1",
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
      id: "con-1",
      from: "port-2",
      to: "port-2",
      shape,
    };

    canvasController.addEdge(addEdgeRequest);

    const spy = jest.spyOn(shape, "render");

    canvasController.updateEdge("con-1", {
      from: "port-1",
    });

    const expected: EdgeRenderParams = {
      from: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
        nodeId: "node-1",
        portId: "port-1",
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        direction: 0,
        nodeId: "node-1",
        portId: "port-2",
      },
    };

    expect(spy).toHaveBeenCalledWith(expected);
  });

  it("should update edge target", () => {
    const canvasController = createCanvasController();

    const addNodeRequest1: AddNodeRequest = {
      id: "node-1",
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
      id: "con-1",
      from: "port-1",
      to: "port-1",
      shape,
    };

    canvasController.addEdge(addEdgeRequest);

    const spy = jest.spyOn(shape, "render");

    canvasController.updateEdge("con-1", {
      to: "port-2",
    });

    const expected: EdgeRenderParams = {
      from: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
        nodeId: "node-1",
        portId: "port-1",
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        direction: 0,
        nodeId: "node-1",
        portId: "port-2",
      },
    };

    expect(spy).toHaveBeenCalledWith(expected);
  });
});
