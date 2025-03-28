import { EdgeShapeMock } from "@/edges";
import {
  AddEdgeRequest,
  AddNodeRequest,
  AddPortRequest,
  GraphStore,
} from "../graph-store";
import { Graph } from "./graph";
import { Point } from "@/point";

const addNodeRequest1: AddNodeRequest = {
  id: "node-1",
  element: document.createElement("div"),
  x: 0,
  y: 0,
  centerFn: (): Point => ({ x: 0, y: 0 }),
  priority: 0,
};

const addPortRequest1: AddPortRequest = {
  id: "port-1",
  nodeId: "node-1",
  element: document.createElement("div"),
  direction: 0,
};

const addNodeRequest2: AddNodeRequest = {
  id: "node-2",
  element: document.createElement("div"),
  x: 0,
  y: 0,
  centerFn: (): Point => ({ x: 0, y: 0 }),
  priority: 0,
};

const addPortRequest2: AddPortRequest = {
  id: "port-2",
  nodeId: "node-2",
  element: document.createElement("div"),
  direction: 0,
};

const addEdgeRequest12: AddEdgeRequest = {
  id: "edge-1-2",
  from: "port-1",
  to: "port-2",
  shape: new EdgeShapeMock(),
  priority: 0,
};

const addEdgeRequest11: AddEdgeRequest = {
  id: "edge-1-1",
  from: "port-1",
  to: "port-1",
  shape: new EdgeShapeMock(),
  priority: 0,
};

describe("Graph", () => {
  it("should return null when no node in store", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    expect(publicStore.getNode(1)).toBe(null);
  });

  it("should return specified node", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    store.addNode(addNodeRequest1);

    expect(publicStore.getNode("node-1")).toStrictEqual({
      element: addNodeRequest1.element,
      x: addNodeRequest1.x,
      y: addNodeRequest1.y,
      centerFn: addNodeRequest1.centerFn,
      priority: addNodeRequest1.priority,
    });
  });

  it("should return specified node ids", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    store.addNode(addNodeRequest1);

    expect(publicStore.getAllNodeIds()).toEqual([addNodeRequest1.id]);
  });

  it("should return null for no port in store", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    expect(publicStore.getPort(1)).toBe(null);
  });

  it("should return specified port", () => {
    const store = new GraphStore();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);

    const publicStore = new Graph(store);

    expect(publicStore.getPort(addPortRequest1.id)).toStrictEqual({
      element: addPortRequest1.element,
      direction: addPortRequest1.direction,
    });
  });

  it("should return specified port ids", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);

    expect(publicStore.getAllPortIds()).toStrictEqual([addPortRequest1.id]);
  });

  it("should return specified node port ids", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);

    expect(publicStore.getNodePortIds(addNodeRequest1.id)).toEqual([
      addPortRequest1.id,
    ]);
  });

  it("should return null when accessing non-existing node port ids", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    expect(publicStore.getNodePortIds(addNodeRequest1.id)).toEqual(null);
  });

  it("should return null when no node in store", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    expect(publicStore.getPortNodeId(1)).toBe(null);
  });

  it("should return specified port node id", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);

    expect(publicStore.getPortNodeId(addPortRequest1.id)).toEqual(
      addNodeRequest1.id,
    );
  });

  it("should return specified edge ids", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    expect(publicStore.getAllEdgeIds()).toEqual([addEdgeRequest12.id]);
  });

  it("should return null for no edge in store", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    expect(publicStore.getEdge(1)).toBe(null);
  });

  it("should return specified edge", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    expect(publicStore.getEdge(addEdgeRequest12.id)).toStrictEqual({
      from: addEdgeRequest12.from,
      to: addEdgeRequest12.to,
      priority: addEdgeRequest12.priority,
    });
  });

  it("should return specified port incoming edge ids", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    expect(publicStore.getPortIncomingEdgeIds(addPortRequest2.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return specified port outcoming edge ids", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    expect(publicStore.getPortOutcomingEdgeIds(addPortRequest1.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return specified port cycle edge ids", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);
    store.addEdge(addEdgeRequest11);

    expect(publicStore.getPortCycleEdgeIds(addPortRequest1.id)).toEqual([
      addEdgeRequest11.id,
    ]);
  });

  it("should return specified port adjacent edge ids", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    expect(publicStore.getPortAdjacentEdgeIds(addPortRequest1.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return specified node incoming edge ids", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    expect(publicStore.getNodeIncomingEdgeIds(addNodeRequest2.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return specified node outcoming edge ids", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    expect(publicStore.getNodeOutcomingEdgeIds(addNodeRequest1.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return specified node cycle edge ids", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);
    store.addEdge(addEdgeRequest11);

    expect(publicStore.getNodeCycleEdgeIds(addNodeRequest1.id)).toEqual([
      addEdgeRequest11.id,
    ]);
  });

  it("should return specified node adjacent edge ids", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    expect(publicStore.getNodeAdjacentEdgeIds(addNodeRequest2.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return null when accessing non-existing port incoming edges", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    expect(publicStore.getPortIncomingEdgeIds("port-1")).toEqual(null);
  });

  it("should return null when accessing non-existing port outcoming edges", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    expect(publicStore.getPortOutcomingEdgeIds("port-1")).toEqual(null);
  });

  it("should return null when accessing non-existing port cycle edges", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    expect(publicStore.getPortCycleEdgeIds("port-1")).toEqual(null);
  });

  it("should return null when accessing non-existing port adjacent edges", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    expect(publicStore.getPortAdjacentEdgeIds("port-1")).toEqual(null);
  });

  it("should return null when accessing non-existing node incoming edges", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    expect(publicStore.getNodeIncomingEdgeIds("node-1")).toEqual(null);
  });

  it("should return null when accessing non-existing node outcoming edges", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    expect(publicStore.getNodeOutcomingEdgeIds("node-1")).toEqual(null);
  });

  it("should return null when accessing non-existing node cycle edges", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    expect(publicStore.getNodeCycleEdgeIds("node-1")).toEqual(null);
  });

  it("should return null when accessing non-existing node adjacent edges", () => {
    const store = new GraphStore();
    const publicStore = new Graph(store);

    expect(publicStore.getNodeAdjacentEdgeIds("node-1")).toEqual(null);
  });
});
