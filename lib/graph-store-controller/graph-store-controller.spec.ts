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
import { EdgeShape, EdgeShapeMock } from "@/edges";
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

const createGraphStoreController = (params?: {
  graphStore?: GraphStore;
  nodesCenterFn?: CenterFn;
  portsCenterFn?: CenterFn;
  portsDirection?: number;
  nodesPriorityFn?: PriorityFn;
  edgesPriorityFn?: PriorityFn;
  edgesShapeFactory?: EdgeShapeFactory;
  onAfterNodeAdded?: (nodeId: unknown) => void;
  onAfterEdgeAdded?: (edgeId: unknown) => void;
  onAfterEdgeShapeUpdated?: (edgeId: unknown) => void;
  onAfterEdgePriorityUpdated?: (edgeId: unknown) => void;
  onAfterEdgeUpdated?: (edgeId: unknown) => void;
  onAfterPortUpdated?: (portId: unknown) => void;
  onAfterNodePriorityUpdated?: (nodeId: unknown) => void;
  onAfterNodeUpdated?: (nodeId: unknown) => void;
  onBeforeEdgeRemoved?: (edgeId: unknown) => void;
  onBeforeNodeRemoved?: (nodeId: unknown) => void;
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
      onAfterNodeAdded: params?.onAfterNodeAdded ?? ((): void => {}),
      onAfterEdgeAdded: params?.onAfterEdgeAdded ?? ((): void => {}),
      onAfterEdgeShapeUpdated:
        params?.onAfterEdgeShapeUpdated ?? ((): void => {}),
      onAfterEdgePriorityUpdated:
        params?.onAfterEdgePriorityUpdated ?? ((): void => {}),
      onAfterEdgeUpdated: params?.onAfterEdgeUpdated ?? ((): void => {}),
      onAfterPortUpdated: params?.onAfterPortUpdated ?? ((): void => {}),
      onAfterNodePriorityUpdated:
        params?.onAfterNodePriorityUpdated ?? ((): void => {}),
      onAfterNodeUpdated: params?.onAfterNodeUpdated ?? ((): void => {}),
      onBeforeEdgeRemoved: params?.onBeforeEdgeRemoved ?? ((): void => {}),
      onBeforeNodeRemoved: params?.onBeforeNodeRemoved ?? ((): void => {}),
    },
  );
};

const markNodePortRequest1: MarkNodePortRequest = {
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
  ports: [markNodePortRequest1],
  priority: 0,
};

const markNodePortRequest2: MarkNodePortRequest = {
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
  ports: [markNodePortRequest2],
  priority: 0,
};

const addEdgeRequest12: AddEdgeRequest = {
  id: "edge-1-2",
  from: "port-1",
  to: "port-2",
  priority: 0,
  shape: new EdgeShapeMock(),
};

describe("GraphStoreController", () => {
  it("should add node to store", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);

    const node = graphStore.getNode(addNodeRequest1.id);

    expect(node).toStrictEqual({
      element: addNodeRequest1.element,
      x: addNodeRequest1.x,
      y: addNodeRequest1.y,
      centerFn: addNodeRequest1.centerFn,
      priority: addNodeRequest1.priority,
    });
  });

  it("should call callback after node added", () => {
    const graphStore = new GraphStore();
    const onAfterNodeAdded = jest.fn();
    const graphStoreController = createGraphStoreController({
      graphStore,
      onAfterNodeAdded,
    });

    graphStoreController.addNode(addNodeRequest1);

    expect(onAfterNodeAdded).toHaveBeenCalledWith("node-1");
  });

  it("should throw error when trying to add node with existing id", () => {
    const graphStoreController = createGraphStoreController();

    graphStoreController.addNode(addNodeRequest1);

    expect(() => {
      graphStoreController.addNode(addNodeRequest1);
    }).toThrow(HtmlGraphError);
  });

  it("should use default node center fn when not specified", () => {
    const graphStore = new GraphStore();
    const nodesCenterFn = (): Point => ({ x: 0, y: 0 });
    const graphStoreController = createGraphStoreController({
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

    graphStoreController.addNode(addNodeRequest);

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
    const graphStoreController = createGraphStoreController({ graphStore });

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    };

    graphStoreController.addNode(addNodeRequest);

    const markPortRequest: MarkPortRequest = {
      id: "port-1",
      nodeId: addNodeRequest.id,
      element: document.createElement("div"),
      direction: 0,
    };

    graphStoreController.markPort(markPortRequest);

    const port = graphStore.getPort(markPortRequest.id);

    expect(port).toStrictEqual({
      element: markPortRequest.element,
      direction: markPortRequest.direction,
    });
  });

  it("should use default port direction if not specified", () => {
    const portsDirection = Math.PI;
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({
      graphStore,
      portsDirection,
    });

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    };

    graphStoreController.addNode(addNodeRequest);

    const markPortRequest: MarkPortRequest = {
      id: "port-1",
      nodeId: addNodeRequest.id,
      element: document.createElement("div"),
    };

    graphStoreController.markPort(markPortRequest);

    const port = graphStore.getPort(markPortRequest.id)!;

    expect(port.direction).toStrictEqual(portsDirection);
  });

  it("should throw error when trying to add port with existing id", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
    };

    graphStoreController.addNode(addNodeRequest);

    const markPortRequest: MarkPortRequest = {
      id: "port-1",
      nodeId: addNodeRequest.id,
      element: document.createElement("div"),
      direction: 0,
    };

    graphStoreController.markPort(markPortRequest);

    expect(() => {
      graphStoreController.markPort(markPortRequest);
    }).toThrow(HtmlGraphError);
  });

  it("should throw error when trying to add port to nonexisting node", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    const markPortRequest: MarkPortRequest = {
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    };

    expect(() => {
      graphStoreController.markPort(markPortRequest);
    }).toThrow(HtmlGraphError);
  });

  it("should mark specified ports", () => {
    const graphStoreController = createGraphStoreController();

    const spy = jest.spyOn(graphStoreController, "markPort");

    graphStoreController.addNode(addNodeRequest1);

    expect(spy).toHaveBeenCalledWith({
      id: markNodePortRequest1.id,
      element: markNodePortRequest1.element,
      nodeId: addNodeRequest1.id,
      direction: markNodePortRequest1.direction,
    });
  });

  it("should add edge to store", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.addEdge(addEdgeRequest12);

    const edge = graphStore.getEdge(addEdgeRequest12.id);

    expect(edge).toStrictEqual({
      from: addEdgeRequest12.from,
      to: addEdgeRequest12.to,
      priority: addEdgeRequest12.priority,
      shape: addEdgeRequest12.shape,
    });
  });

  it("should call callback after edge added", () => {
    const graphStore = new GraphStore();
    const onAfterEdgeAdded = jest.fn();
    const graphStoreController = createGraphStoreController({
      graphStore,
      onAfterEdgeAdded,
    });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.addEdge(addEdgeRequest12);

    expect(onAfterEdgeAdded).toHaveBeenCalledWith(addEdgeRequest12.id);
  });

  it("should throw error when trying to add existing edge", () => {
    const graphStoreController = createGraphStoreController();

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.addEdge(addEdgeRequest12);

    expect(() => {
      graphStoreController.addEdge(addEdgeRequest12);
    }).toThrow(HtmlGraphError);
  });

  it("should throw error when trying to attach edge to nonexisting port", () => {
    const graphStoreController = createGraphStoreController();

    graphStoreController.addNode(addNodeRequest1);

    expect(() => {
      graphStoreController.addEdge(addEdgeRequest12);
    }).toThrow(HtmlGraphError);
  });

  it("should throw error when trying to attach edge from nonexisting port", () => {
    const graphStoreController = createGraphStoreController();

    graphStoreController.addNode(addNodeRequest2);

    expect(() => {
      graphStoreController.addEdge(addEdgeRequest12);
    }).toThrow(HtmlGraphError);
  });

  it("should update edge shape if specified", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.addEdge(addEdgeRequest12);

    const newShape = new EdgeShapeMock();

    graphStoreController.updateEdge(addEdgeRequest12.id, {
      shape: newShape,
    });

    const edge = graphStore.getEdge(addEdgeRequest12.id);
    expect(edge?.shape).toBe(newShape);
  });

  it("should call callback after edge shape updated", () => {
    const graphStore = new GraphStore();
    const onAfterEdgeShapeUpdated = jest.fn();
    const graphStoreController = createGraphStoreController({
      graphStore,
      onAfterEdgeShapeUpdated,
    });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.addEdge(addEdgeRequest12);

    const newShape = new EdgeShapeMock();

    graphStoreController.updateEdge(addEdgeRequest12.id, {
      shape: newShape,
    });

    expect(onAfterEdgeShapeUpdated).toHaveBeenCalledWith(addEdgeRequest12.id);
  });

  it("should update edge priority if specified", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.addEdge(addEdgeRequest12);
    graphStoreController.updateEdge(addEdgeRequest12.id, {
      priority: 10,
    });

    const edge = graphStore.getEdge(addEdgeRequest12.id);

    expect(edge?.priority).toBe(10);
  });

  it("should call callback after edge priority update", () => {
    const graphStore = new GraphStore();
    const onAfterEdgePriorityUpdated = jest.fn();
    const graphStoreController = createGraphStoreController({
      graphStore,
      onAfterEdgePriorityUpdated,
    });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.addEdge(addEdgeRequest12);
    graphStoreController.updateEdge(addEdgeRequest12.id, {
      priority: 10,
    });

    expect(onAfterEdgePriorityUpdated).toHaveBeenCalledWith(
      addEdgeRequest12.id,
    );
  });

  it("should call callback after edge updated", () => {
    const graphStore = new GraphStore();
    const onAfterEdgeUpdated = jest.fn();
    const graphStoreController = createGraphStoreController({
      graphStore,
      onAfterEdgeUpdated,
    });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.addEdge(addEdgeRequest12);

    graphStoreController.updateEdge(addEdgeRequest12.id, {});

    expect(onAfterEdgeUpdated).toHaveBeenCalledWith(addEdgeRequest12.id);
  });

  it("should throw error when trying to update nonexisting edge", () => {
    const graphStoreController = createGraphStoreController();

    expect(() => {
      graphStoreController.updateEdge("edge-1", {});
    }).toThrow(HtmlGraphError);
  });

  it("should update port direction", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);

    const updatePortRequest: UpdatePortRequest = {
      direction: Math.PI,
    };

    graphStoreController.updatePort(markNodePortRequest1.id, updatePortRequest);

    const port = graphStore.getPort(markNodePortRequest1.id)!;

    expect(port.direction).toBe(updatePortRequest.direction);
  });

  it("should call callback after port update", () => {
    const graphStore = new GraphStore();
    const onAfterPortUpdated = jest.fn();
    const graphStoreController = createGraphStoreController({
      graphStore,
      onAfterPortUpdated,
    });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.updatePort(markNodePortRequest1.id, {});

    expect(onAfterPortUpdated).toHaveBeenCalledWith(markNodePortRequest1.id);
  });

  it("should throw error when trying to update nonexisting port", () => {
    const graphStoreController = createGraphStoreController();

    expect(() => {
      graphStoreController.updatePort("port-1", {});
    }).toThrow(HtmlGraphError);
  });

  it("should update node x coordinate if specified", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);

    const updateNodeRequest: UpdateNodeRequest = {
      x: 100,
    };

    graphStoreController.updateNode(addNodeRequest1.id, updateNodeRequest);

    const node = graphStore.getNode("node-1")!;

    expect(node.x).toBe(100);
  });

  it("should update node y coordinate if specified", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);

    const updateNodeRequest: UpdateNodeRequest = {
      y: 100,
    };

    graphStoreController.updateNode(addNodeRequest1.id, updateNodeRequest);

    const node = graphStore.getNode("node-1")!;

    expect(node.y).toBe(100);
  });

  it("should update node priority if specified", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);

    const updateNodeRequest: UpdateNodeRequest = {
      priority: 10,
    };

    graphStoreController.updateNode(addNodeRequest1.id, updateNodeRequest);

    const node = graphStore.getNode("node-1")!;

    expect(node.priority).toBe(10);
  });

  it("should call callback after node priority update", () => {
    const graphStore = new GraphStore();
    const onAfterNodePriorityUpdated = jest.fn();
    const graphStoreController = createGraphStoreController({
      graphStore,
      onAfterNodePriorityUpdated,
    });

    graphStoreController.addNode(addNodeRequest1);

    const updateNodeRequest: UpdateNodeRequest = {
      priority: 10,
    };

    graphStoreController.updateNode(addNodeRequest1.id, updateNodeRequest);

    expect(onAfterNodePriorityUpdated).toHaveBeenCalledWith(addNodeRequest1.id);
  });

  it("should update node centerFn if specified", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);

    const centerFn: CenterFn = (width, height) => ({ x: width, y: height });
    const updateNodeRequest: UpdateNodeRequest = {
      centerFn,
    };

    graphStoreController.updateNode(addNodeRequest1.id, updateNodeRequest);

    const node = graphStore.getNode("node-1")!;

    expect(node.centerFn).toBe(centerFn);
  });

  it("should call callback after node update", () => {
    const graphStore = new GraphStore();
    const onAfterNodeUpdated = jest.fn();
    const graphStoreController = createGraphStoreController({
      graphStore,
      onAfterNodeUpdated,
    });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.updateNode(addNodeRequest1.id, {});

    expect(onAfterNodeUpdated).toHaveBeenCalledWith(addNodeRequest1.id);
  });

  it("should throw error when trying to update nonexisting node", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    expect(() => {
      graphStoreController.updateNode(1, {});
    }).toThrow(HtmlGraphError);
  });

  it("should remove edge from store", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.addEdge(addEdgeRequest12);
    graphStoreController.removeEdge(addEdgeRequest12.id);

    const edge = graphStore.getEdge(addEdgeRequest12.id);

    expect(edge).toBe(undefined);
  });

  it("should call callback before edge removed", () => {
    const graphStore = new GraphStore();
    const onBeforeEdgeRemoved = jest.fn();
    const graphStoreController = createGraphStoreController({
      graphStore,
      onBeforeEdgeRemoved,
    });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.addEdge(addEdgeRequest12);
    graphStoreController.removeEdge(addEdgeRequest12.id);

    expect(onBeforeEdgeRemoved).toHaveBeenCalledWith(addEdgeRequest12.id);
  });

  it("should throw error when trying to remove nonexisting edge", () => {
    const graphStoreController = createGraphStoreController();

    expect(() => {
      graphStoreController.removeEdge("edge-1");
    }).toThrow(HtmlGraphError);
  });

  it("should remove port from store", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.unmarkPort(markNodePortRequest1.id);

    const port = graphStore.getPort(markNodePortRequest1.id);

    expect(port).toBe(undefined);
  });

  it("should remove adjacent to port edges", () => {
    const graphStoreController = createGraphStoreController();

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.addEdge(addEdgeRequest12);

    const spy = jest.spyOn(graphStoreController, "removeEdge");

    graphStoreController.unmarkPort(markNodePortRequest1.id);

    expect(spy).toHaveBeenCalledWith(addEdgeRequest12.id);
  });

  it("should throw error when trying to unmark nonexisting port", () => {
    const graphStoreController = createGraphStoreController();

    expect(() => {
      graphStoreController.unmarkPort("port-1");
    }).toThrow(HtmlGraphError);
  });

  it("should remove node from store", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.removeNode(addNodeRequest1.id);

    const node = graphStore.getNode(addNodeRequest1.id);

    expect(node).toBe(undefined);
  });

  it("should call callback before node removed", () => {
    const graphStore = new GraphStore();
    const onBeforeNodeRemoved = jest.fn();
    const graphStoreController = createGraphStoreController({
      graphStore,
      onBeforeNodeRemoved,
    });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.removeNode(addNodeRequest1.id);

    expect(onBeforeNodeRemoved).toHaveBeenCalledWith(addNodeRequest1.id);
  });

  it("should unmark node ports", () => {
    const graphStoreController = createGraphStoreController();

    graphStoreController.addNode(addNodeRequest1);

    const spy = jest.spyOn(graphStoreController, "unmarkPort");

    graphStoreController.removeNode(addNodeRequest1.id);

    expect(spy).toHaveBeenCalledWith(markNodePortRequest1.id);
  });

  it("should clear store", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    const spy = jest.spyOn(graphStore, "clear");

    graphStoreController.clear();

    expect(spy).toHaveBeenCalled();
  });

  it("should add node with unspecified id", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);

    const nodes = graphStore.getAllNodeIds();

    expect(nodes.length).toBe(1);
  });

  it("should add port with unspecified id", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    const addNodeRequest: AddNodeRequest = {
      id: "node-3",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      priority: 0,
    };

    graphStoreController.addNode(addNodeRequest);

    const markPortRequest: MarkPortRequest = {
      nodeId: addNodeRequest.id,
      element: document.createElement("div"),
      direction: 0,
    };

    graphStoreController.markPort(markPortRequest);

    const ports = graphStore.getAllPortIds();

    expect(ports.length).toBe(1);
  });

  it("should add edge with unspecified id", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.addEdge(addEdgeRequest12);

    const edges = graphStore.getAllEdgeIds();

    expect(edges.length).toBe(1);
  });

  it("should throw error when trying to remove nonexisting node", () => {
    const graphStoreController = createGraphStoreController();

    expect(() => {
      graphStoreController.removeNode("node-1");
    }).toThrow(HtmlGraphError);
  });

  it("should update edge source", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.addEdge(addEdgeRequest12);

    graphStoreController.updateEdge(addEdgeRequest12.id, {
      from: "port-1",
    });

    const edge = graphStore.getEdge(addEdgeRequest12.id)!;

    expect(edge.from).toBe("port-1");
  });

  it("should update edge target", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.addEdge(addEdgeRequest12);

    graphStoreController.updateEdge(addEdgeRequest12.id, {
      to: "port-2",
    });

    const edge = graphStore.getEdge(addEdgeRequest12.id)!;

    expect(edge.to).toBe("port-2");
  });
});
