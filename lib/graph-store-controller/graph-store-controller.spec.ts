import { GraphStore } from "@/graph-store";
import { GraphStoreController } from "./graph-store-controller";
import { Point } from "@/point";
import { AddNodeRequest } from "./add-node-request";
import { CenterFn, standardCenterFn } from "@/center-fn";
import { PriorityFn } from "@/priority";
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
}): GraphStoreController => {
  const graphStore = params?.graphStore ?? new GraphStore();

  const controller = new GraphStoreController(graphStore, {
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
  });

  return controller;
};

const addNodeRequest1: AddNodeRequest = {
  id: "node-1",
  element: createElement(),
  x: 0,
  y: 0,
  centerFn: () => ({ x: 0, y: 0 }),
  priority: 0,
};

const markPortRequest1: MarkPortRequest = {
  id: "port-1",
  nodeId: "node-1",
  element: createElement({ x: 0, y: 0 }),
  direction: 0,
};

const addNodeRequest2: AddNodeRequest = {
  id: "node-2",
  element: createElement(),
  x: 0,
  y: 0,
  centerFn: () => ({ x: 0, y: 0 }),
  priority: 0,
};

const markPortRequest2: MarkPortRequest = {
  id: "port-2",
  nodeId: "node-2",
  element: createElement({ x: 100, y: 100 }),
  direction: 0,
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
    graphStoreController.markPort(markPortRequest1);

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
    const graphStoreController = createGraphStoreController({
      graphStore,
    });
    const callback = jest.fn();
    graphStoreController.onAfterNodeAdded.subscribe(callback);

    graphStoreController.addNode(addNodeRequest1);

    expect(callback).toHaveBeenCalledWith("node-1");
  });

  it("should add specified port to store", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    const addNodeRequest: AddNodeRequest = {
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
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

  it("should mark specified ports", () => {
    const graphStoreController = createGraphStoreController();

    const spy = jest.spyOn(graphStoreController, "markPort");

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.markPort(markPortRequest1);

    expect(spy).toHaveBeenCalledWith({
      id: markPortRequest1.id,
      element: markPortRequest1.element,
      nodeId: addNodeRequest1.id,
      direction: markPortRequest1.direction,
    });
  });

  it("should add edge to store", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.markPort(markPortRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.markPort(markPortRequest2);
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
    const graphStoreController = createGraphStoreController({
      graphStore,
    });

    const callback = jest.fn();
    graphStoreController.onAfterEdgeAdded.subscribe(callback);

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.markPort(markPortRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.markPort(markPortRequest2);
    graphStoreController.addEdge(addEdgeRequest12);

    expect(callback).toHaveBeenCalledWith(addEdgeRequest12.id);
  });

  it("should update edge shape if specified", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.markPort(markPortRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.markPort(markPortRequest2);
    graphStoreController.addEdge(addEdgeRequest12);

    const newShape = new EdgeShapeMock();

    graphStoreController.updateEdge(addEdgeRequest12.id, {
      shape: newShape,
    });

    const edge = graphStore.getEdge(addEdgeRequest12.id)!;
    expect(edge.shape).toBe(newShape);
  });

  it("should call callback after edge shape updated", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({
      graphStore,
    });

    const callback = jest.fn();
    graphStoreController.onAfterEdgeShapeUpdated.subscribe(callback);

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.markPort(markPortRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.markPort(markPortRequest2);
    graphStoreController.addEdge(addEdgeRequest12);

    const newShape = new EdgeShapeMock();

    graphStoreController.updateEdge(addEdgeRequest12.id, {
      shape: newShape,
    });

    expect(callback).toHaveBeenCalledWith(addEdgeRequest12.id);
  });

  it("should update edge priority if specified", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.markPort(markPortRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.markPort(markPortRequest2);
    graphStoreController.addEdge(addEdgeRequest12);
    graphStoreController.updateEdge(addEdgeRequest12.id, {
      priority: 10,
    });

    const edge = graphStore.getEdge(addEdgeRequest12.id);

    expect(edge?.priority).toBe(10);
  });

  it("should call callback after edge priority update", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({
      graphStore,
    });

    const callback = jest.fn();
    graphStoreController.onAfterEdgePriorityUpdated.subscribe(callback);

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.markPort(markPortRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.markPort(markPortRequest2);
    graphStoreController.addEdge(addEdgeRequest12);
    graphStoreController.updateEdge(addEdgeRequest12.id, {
      priority: 10,
    });

    expect(callback).toHaveBeenCalledWith(addEdgeRequest12.id);
  });

  it("should call callback after edge updated", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({
      graphStore,
    });

    const callback = jest.fn();
    graphStoreController.onAfterEdgeUpdated.subscribe(callback);

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.markPort(markPortRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.markPort(markPortRequest2);
    graphStoreController.addEdge(addEdgeRequest12);

    graphStoreController.updateEdge(addEdgeRequest12.id, {});

    expect(callback).toHaveBeenCalledWith(addEdgeRequest12.id);
  });

  it("should update port direction", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.markPort(markPortRequest1);

    const updatePortRequest: UpdatePortRequest = {
      direction: Math.PI,
    };

    graphStoreController.updatePort(markPortRequest1.id, updatePortRequest);

    const port = graphStore.getPort(markPortRequest1.id)!;

    expect(port.direction).toBe(updatePortRequest.direction);
  });

  it("should call callback after port update", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({
      graphStore,
    });

    const callback = jest.fn();
    graphStoreController.onAfterPortUpdated.subscribe(callback);

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.markPort(markPortRequest1);
    graphStoreController.updatePort(markPortRequest1.id, {});

    expect(callback).toHaveBeenCalledWith(markPortRequest1.id);
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
    const graphStoreController = createGraphStoreController({
      graphStore,
    });

    const callback = jest.fn();
    graphStoreController.onAfterNodePriorityUpdated.subscribe(callback);

    graphStoreController.addNode(addNodeRequest1);

    const updateNodeRequest: UpdateNodeRequest = {
      priority: 10,
    };

    graphStoreController.updateNode(addNodeRequest1.id, updateNodeRequest);

    expect(callback).toHaveBeenCalledWith(addNodeRequest1.id);
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
    const graphStoreController = createGraphStoreController({
      graphStore,
    });

    const callback = jest.fn();
    graphStoreController.onAfterNodeUpdated.subscribe(callback);

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.updateNode(addNodeRequest1.id, {});

    expect(callback).toHaveBeenCalledWith(addNodeRequest1.id);
  });

  it("should remove edge from store", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.markPort(markPortRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.markPort(markPortRequest2);
    graphStoreController.addEdge(addEdgeRequest12);
    graphStoreController.removeEdge(addEdgeRequest12.id);

    const edge = graphStore.getEdge(addEdgeRequest12.id);

    expect(edge).toBe(undefined);
  });

  it("should call callback before edge removed", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({
      graphStore,
    });

    const callback = jest.fn();
    graphStoreController.onBeforeEdgeRemoved.subscribe(callback);

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.markPort(markPortRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.markPort(markPortRequest2);
    graphStoreController.addEdge(addEdgeRequest12);
    graphStoreController.removeEdge(addEdgeRequest12.id);

    expect(callback).toHaveBeenCalledWith(addEdgeRequest12.id);
  });

  it("should remove port from store", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.markPort(markPortRequest1);
    graphStoreController.unmarkPort(markPortRequest1.id);

    const port = graphStore.getPort(markPortRequest1.id);

    expect(port).toBe(undefined);
  });

  it("should remove adjacent to port edges", () => {
    const graphStoreController = createGraphStoreController();

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.markPort(markPortRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.markPort(markPortRequest2);
    graphStoreController.addEdge(addEdgeRequest12);

    const spy = jest.spyOn(graphStoreController, "removeEdge");

    graphStoreController.unmarkPort(markPortRequest1.id);

    expect(spy).toHaveBeenCalledWith(addEdgeRequest12.id);
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
    const graphStoreController = createGraphStoreController({
      graphStore,
    });

    const callback = jest.fn();
    graphStoreController.onBeforeNodeRemoved.subscribe(callback);

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.removeNode(addNodeRequest1.id);

    expect(callback).toHaveBeenCalledWith(addNodeRequest1.id);
  });

  it("should unmark node ports", () => {
    const graphStoreController = createGraphStoreController();

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.markPort(markPortRequest1);

    const spy = jest.spyOn(graphStoreController, "unmarkPort");

    graphStoreController.removeNode(addNodeRequest1.id);

    expect(spy).toHaveBeenCalledWith(markPortRequest1.id);
  });

  it("should clear store", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    const spy = jest.spyOn(graphStore, "clear");

    graphStoreController.clear();

    expect(spy).toHaveBeenCalled();
  });

  it("should update edge source", () => {
    const graphStore = new GraphStore();
    const graphStoreController = createGraphStoreController({ graphStore });

    graphStoreController.addNode(addNodeRequest1);
    graphStoreController.markPort(markPortRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.markPort(markPortRequest2);
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
    graphStoreController.markPort(markPortRequest1);
    graphStoreController.addNode(addNodeRequest2);
    graphStoreController.markPort(markPortRequest2);
    graphStoreController.addEdge(addEdgeRequest12);

    graphStoreController.updateEdge(addEdgeRequest12.id, {
      to: "port-2",
    });

    const edge = graphStore.getEdge(addEdgeRequest12.id)!;

    expect(edge.to).toBe("port-2");
  });
});
