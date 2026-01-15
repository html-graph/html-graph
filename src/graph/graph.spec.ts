import { BezierEdgeShape, HorizontalEdgeShape } from "@/edges";
import {
  AddEdgeRequest,
  AddNodeRequest,
  AddPortRequest,
  GraphStore,
} from "@/graph-store";
import { Graph } from "./graph";
import { Point } from "@/point";
import { CanvasError } from "@/canvas-error";

const createAddNodeRequest1 = (): AddNodeRequest => {
  return {
    id: "node-1",
    element: document.createElement("div"),
    x: 0,
    y: 0,
    centerFn: (): Point => ({ x: 0, y: 0 }),
    priority: 0,
  };
};

const createAddNodeRequest2 = (): AddNodeRequest => {
  return {
    id: "node-2",
    element: document.createElement("div"),
    x: 0,
    y: 0,
    centerFn: (): Point => ({ x: 0, y: 0 }),
    priority: 0,
  };
};

const createAddPortRequest1 = (): AddPortRequest => {
  return {
    id: "port-1",
    nodeId: "node-1",
    element: document.createElement("div"),
    direction: 0,
  };
};

const createAddPortRequest2 = (): AddPortRequest => {
  return {
    id: "port-2",
    nodeId: "node-2",
    element: document.createElement("div"),
    direction: 0,
  };
};

const createAddEdgeRequest12 = (): AddEdgeRequest => {
  return {
    id: "edge-1",
    from: "port-1",
    to: "port-2",
    shape: new BezierEdgeShape(),
    priority: 0,
  };
};

const createAddEdgeRequest11 = (): AddEdgeRequest => {
  return {
    id: "edge-2",
    from: "port-1",
    to: "port-1",
    shape: new BezierEdgeShape(),
    priority: 0,
  };
};

describe("Graph", () => {
  it("should throw error when trying to access nonexistent node", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    expect(() => {
      graph.getNode(1);
    }).toThrow(CanvasError);
  });

  it("should return false for nonexisting node check", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    expect(graph.hasNode("node-1")).toBe(false);
  });

  it("should return true for existing node check", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const addNodeRequest1 = createAddNodeRequest1();

    store.addNode(addNodeRequest1);

    expect(graph.hasNode(addNodeRequest1.id)).toBe(true);
  });

  it("should return specified node", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const addNodeRequest1 = createAddNodeRequest1();

    store.addNode(addNodeRequest1);

    expect(graph.getNode(addNodeRequest1.id)).toStrictEqual({
      element: addNodeRequest1.element,
      x: addNodeRequest1.x,
      y: addNodeRequest1.y,
      centerFn: addNodeRequest1.centerFn,
      priority: addNodeRequest1.priority,
    });
  });

  it("should emit event after node added", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const handler = jest.fn();

    graph.onAfterNodeAdded.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();

    store.addNode(addNodeRequest1);

    expect(handler).toHaveBeenCalledWith(addNodeRequest1.id);
  });

  it("should emit event after updating node coordinates", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const handler = jest.fn();

    graph.onAfterNodeUpdated.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();

    store.addNode(addNodeRequest1);

    store.updateNode(addNodeRequest1.id, {
      x: undefined,
      y: undefined,
      centerFn: undefined,
      priority: undefined,
    });

    expect(handler).toHaveBeenCalledWith(addNodeRequest1.id);
  });

  it("should emit event after updating node priority", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const handler = jest.fn();

    graph.onAfterNodePriorityUpdated.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();

    store.addNode(addNodeRequest1);

    store.updateNode(addNodeRequest1.id, {
      x: undefined,
      y: undefined,
      centerFn: undefined,
      priority: 10,
    });

    expect(handler).toHaveBeenCalledWith(addNodeRequest1.id);
  });

  it("should return specified node ids", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const addNodeRequest1 = createAddNodeRequest1();

    store.addNode(addNodeRequest1);

    expect(graph.getAllNodeIds()).toEqual([addNodeRequest1.id]);
  });

  it("should emit before node removed", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const handler = jest.fn();

    graph.onBeforeNodeRemoved.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();

    store.addNode(addNodeRequest1);

    store.removeNode(addNodeRequest1.id);

    expect(handler).toHaveBeenCalledWith(addNodeRequest1.id);
  });

  it("should throw error when accessing nonexisting port", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    expect(() => {
      graph.getPort(1);
    }).toThrow(CanvasError);
  });

  it("should return false for nonexisting port check", () => {
    const store = new GraphStore();

    const graph = new Graph(store);

    expect(graph.hasPort("port-1")).toBe(false);
  });

  it("should return true for existing port check", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);

    const graph = new Graph(store);

    expect(graph.hasPort(addPortRequest1.id)).toBe(true);
  });

  it("should return specified port", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);

    const graph = new Graph(store);

    expect(graph.getPort(addPortRequest1.id)).toStrictEqual({
      element: addPortRequest1.element,
      direction: addPortRequest1.direction,
      nodeId: addNodeRequest1.id,
    });
  });

  it("should emit after port added", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const handler = jest.fn();

    graph.onAfterPortMarked.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);

    expect(handler).toHaveBeenCalledWith(addPortRequest1.id);
  });

  it("should emit after port direction updated", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const handler = jest.fn();

    graph.onAfterPortUpdated.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);

    store.updatePort(addPortRequest1.id, {
      direction: Math.PI,
    });

    expect(handler).toHaveBeenCalledWith(addPortRequest1.id);
  });

  it("should return specified port ids", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);

    expect(graph.getAllPortIds()).toStrictEqual([addPortRequest1.id]);
  });

  it("should return specified node port ids", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);

    expect(graph.getNodePortIds(addNodeRequest1.id)).toEqual([
      addPortRequest1.id,
    ]);
  });

  it("should throw error when accessing nonexisting node port ids", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const addNodeRequest1 = createAddNodeRequest1();

    expect(() => {
      graph.getNodePortIds(addNodeRequest1.id);
    }).toThrow(CanvasError);
  });

  it("should emit before port removed", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const handler = jest.fn();

    graph.onBeforePortUnmarked.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);
    store.removePort(addPortRequest1.id);

    expect(handler).toHaveBeenCalledWith(addPortRequest1.id);
  });

  it("should emit event after edge added", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const handler = jest.fn();

    graph.onAfterEdgeAdded.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1 = createAddPortRequest1();
    const addPortRequest2 = createAddPortRequest2();
    const addEdgeRequest12 = createAddEdgeRequest12();
    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    expect(handler).toHaveBeenCalledWith(addEdgeRequest12.id);
  });

  it("should emit event after edge shape updated", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const handler = jest.fn();

    graph.onAfterEdgeShapeUpdated.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1 = createAddPortRequest1();
    const addPortRequest2 = createAddPortRequest2();
    const addEdgeRequest12 = createAddEdgeRequest12();
    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    const shape = new HorizontalEdgeShape();

    store.updateEdge(addEdgeRequest12.id, {
      from: undefined,
      to: undefined,
      shape,
      priority: undefined,
    });

    expect(handler).toHaveBeenCalledWith(addEdgeRequest12.id);
  });

  it("should emit event after edge priority updated", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const handler = jest.fn();

    graph.onAfterEdgePriorityUpdated.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1 = createAddPortRequest1();
    const addPortRequest2 = createAddPortRequest2();
    const addEdgeRequest12 = createAddEdgeRequest12();
    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    store.updateEdge(addEdgeRequest12.id, {
      from: undefined,
      to: undefined,
      shape: undefined,
      priority: 10,
    });

    expect(handler).toHaveBeenCalledWith(addEdgeRequest12.id);
  });

  it("should return specified edge ids", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest2 = createAddPortRequest2();
    const addEdgeRequest12 = createAddEdgeRequest12();

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    expect(graph.getAllEdgeIds()).toEqual([addEdgeRequest12.id]);
  });

  it("should throw error when trying to access nonexisting edge", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    expect(() => {
      graph.getEdge(1);
    }).toThrow(CanvasError);
  });

  it("should return false for nonexisting edge check", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    expect(graph.hasEdge("edge-1")).toBe(false);
  });

  it("should return true for existing edge", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest2 = createAddPortRequest2();
    const addEdgeRequest12 = createAddEdgeRequest12();

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    expect(graph.hasEdge(addEdgeRequest12.id)).toBe(true);
  });

  it("should return specified edge", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest2 = createAddPortRequest2();
    const addEdgeRequest12 = createAddEdgeRequest12();

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    expect(graph.getEdge(addEdgeRequest12.id)).toStrictEqual({
      from: addEdgeRequest12.from,
      to: addEdgeRequest12.to,
      priority: addEdgeRequest12.priority,
      shape: addEdgeRequest12.shape,
    });
  });

  it("should emit event before edge removed", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const handler = jest.fn();

    graph.onBeforeEdgeRemoved.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1 = createAddPortRequest1();
    const addPortRequest2 = createAddPortRequest2();
    const addEdgeRequest12 = createAddEdgeRequest12();
    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    store.removeEdge(addEdgeRequest12.id);

    expect(handler).toHaveBeenCalledWith(addEdgeRequest12.id);
  });

  it("should return specified port incoming edge ids", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest2 = createAddPortRequest2();
    const addEdgeRequest12 = createAddEdgeRequest12();

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    expect(graph.getPortIncomingEdgeIds(addPortRequest2.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return specified port outgoing edge ids", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest2 = createAddPortRequest2();
    const addEdgeRequest12 = createAddEdgeRequest12();

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    expect(graph.getPortOutgoingEdgeIds(addPortRequest1.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return specified port cycle edge ids", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();
    const addEdgeRequest11 = createAddEdgeRequest11();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);
    store.addEdge(addEdgeRequest11);

    expect(graph.getPortCycleEdgeIds(addPortRequest1.id)).toEqual([
      addEdgeRequest11.id,
    ]);
  });

  it("should return specified port adjacent edge ids", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest2 = createAddPortRequest2();
    const addEdgeRequest12 = createAddEdgeRequest12();

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    expect(graph.getPortAdjacentEdgeIds(addPortRequest1.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return specified node incoming edge ids", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest2 = createAddPortRequest2();
    const addEdgeRequest12 = createAddEdgeRequest12();

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    expect(graph.getNodeIncomingEdgeIds(addNodeRequest2.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return specified node outgoing edge ids", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest2 = createAddPortRequest2();
    const addEdgeRequest12 = createAddEdgeRequest12();

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    expect(graph.getNodeOutgoingEdgeIds(addNodeRequest1.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return specified node cycle edge ids", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();
    const addEdgeRequest11 = createAddEdgeRequest11();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);
    store.addEdge(addEdgeRequest11);

    expect(graph.getNodeCycleEdgeIds(addNodeRequest1.id)).toEqual([
      addEdgeRequest11.id,
    ]);
  });

  it("should return specified node adjacent edge ids", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest2 = createAddPortRequest2();
    const addEdgeRequest12 = createAddEdgeRequest12();

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    expect(graph.getNodeAdjacentEdgeIds(addNodeRequest2.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return null when accessing non-existing port incoming edges", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    expect(graph.getPortIncomingEdgeIds("port-1")).toEqual(null);
  });

  it("should return null when accessing non-existing port outgoing edges", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    expect(graph.getPortOutgoingEdgeIds("port-1")).toEqual(null);
  });

  it("should return null when accessing non-existing port cycle edges", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    expect(graph.getPortCycleEdgeIds("port-1")).toEqual(null);
  });

  it("should return null when accessing non-existing port adjacent edges", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    expect(graph.getPortAdjacentEdgeIds("port-1")).toEqual(null);
  });

  it("should return null when accessing non-existing node incoming edges", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    expect(graph.getNodeIncomingEdgeIds("node-1")).toEqual(null);
  });

  it("should return null when accessing non-existing node outgoing edges", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    expect(graph.getNodeOutgoingEdgeIds("node-1")).toEqual(null);
  });

  it("should return null when accessing non-existing node cycle edges", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    expect(graph.getNodeCycleEdgeIds("node-1")).toEqual(null);
  });

  it("should return null when accessing non-existing node adjacent edges", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    expect(graph.getNodeAdjacentEdgeIds("node-1")).toEqual(null);
  });

  it("should emit event before clear", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const handler = jest.fn();

    graph.onBeforeClear.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    store.addNode(addNodeRequest1);
    store.clear();

    expect(handler).toHaveBeenCalled();
  });

  it("should return marked port ids for element", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);

    expect(graph.findPortIdsByElement(addPortRequest1.element)).toEqual([
      addPortRequest1.id,
    ]);
  });

  it("should return node id for element", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const addNodeRequest1 = createAddNodeRequest1();

    store.addNode(addNodeRequest1);

    expect(graph.findNodeIdByElement(addNodeRequest1.element)).toEqual(
      addNodeRequest1.id,
    );
  });

  it("should return undefined when element is not a node", () => {
    const store = new GraphStore();
    const graph = new Graph(store);

    const element = document.createElement("div");

    expect(graph.findNodeIdByElement(element)).toEqual(undefined);
  });
});
