import { Point } from "@/point";
import { GraphStore } from "./graph-store";
import { EdgeShapeMock } from "@/edges";
import { AddNodeRequest } from "./add-node-request";
import { AddPortRequest } from "./add-port-request";
import { AddEdgeRequest } from "./add-edge-request";

const node1Request: AddNodeRequest = {
  id: "node-1",
  element: document.createElement("div"),
  x: 0,
  y: 0,
  centerFn: (): Point => ({ x: 0, y: 0 }),
  priority: 0,
};

const port1Request: AddPortRequest = {
  id: "port-1",
  nodeId: "node-1",
  element: document.createElement("div"),
  direction: 0,
};

const node2Request: AddNodeRequest = {
  id: "node-2",
  element: document.createElement("div"),
  x: 0,
  y: 0,
  centerFn: (): Point => ({ x: 0, y: 0 }),
  priority: 0,
};

const port2Request: AddPortRequest = {
  id: "port-2",
  nodeId: "node-2",
  element: document.createElement("div"),
  direction: 0,
};

const edge1to2Request: AddEdgeRequest = {
  id: "edge-1",
  from: "port-1",
  to: "port-2",
  shape: new EdgeShapeMock(),
  priority: 0,
};

const edge1to1Request: AddEdgeRequest = {
  id: "edge-2",
  from: "port-1",
  to: "port-1",
  shape: new EdgeShapeMock(),
  priority: 0,
};

describe("GraphStore", () => {
  it("should return undefined for non-existing node", () => {
    const store = new GraphStore();

    expect(store.getNode(1)).toBe(undefined);
  });

  it("should return specidied node for existing node", () => {
    const store = new GraphStore();

    store.addNode(node1Request);

    expect(store.getNode(node1Request.id)).toEqual({
      element: node1Request.element,
      x: node1Request.x,
      y: node1Request.y,
      centerFn: node1Request.centerFn,
      priority: node1Request.priority,
    });
  });

  it("should return all added node ids", () => {
    const store = new GraphStore();

    store.addNode(node1Request);

    expect(store.getAllNodeIds()).toEqual([node1Request.id]);
  });

  it("should remove node", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.removeNode(node1Request.id);

    expect(store.getNode(node1Request.id)).toBe(undefined);
  });

  it("should return undefined for non-existing port", () => {
    const store = new GraphStore();

    expect(store.getPort(1)).toBe(undefined);
  });

  it("should return specidied port for existing port", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);

    expect(store.getPort(port1Request.id)).toEqual({
      element: port1Request.element,
      direction: port1Request.direction,
    });
  });

  it("should return all added port ids", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);

    expect(store.getAllPortIds()).toEqual([port1Request.id]);
  });

  it("should return undefined when getting ports of non-existing node", () => {
    const store = new GraphStore();

    expect(store.getNodePortIds(1)).toBe(undefined);
  });

  it("should return node port id for existing node", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);

    expect(store.getNodePortIds(node1Request.id)).toEqual([port1Request.id]);
  });

  it("should return undefined when getting node id of non-existing port", () => {
    const store = new GraphStore();

    expect(store.getPortNodeId(1)).toBe(undefined);
  });

  it("should remove node port", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);
    store.removePort(port1Request.id);

    expect(store.getPort(port1Request.id)).toEqual(undefined);
  });

  it("should return undefined when getting non-existing id", () => {
    const store = new GraphStore();

    expect(store.getEdge(1)).toBe(undefined);
  });

  it("should return specified edge", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);
    store.addNode(node2Request);
    store.addPort(port2Request);
    store.addEdge(edge1to2Request);

    expect(store.getEdge(edge1to2Request.id)).toEqual({
      from: edge1to2Request.from,
      to: edge1to2Request.to,
      shape: edge1to2Request.shape,
      priority: edge1to2Request.priority,
    });
  });

  it("should return all edge ids", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);
    store.addNode(node2Request);
    store.addPort(port2Request);
    store.addEdge(edge1to2Request);

    expect(store.getAllEdgeIds()).toEqual([edge1to2Request.id]);
  });

  it("should remove edge", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);
    store.addNode(node2Request);
    store.addPort(port2Request);
    store.addEdge(edge1to2Request);
    store.removeEdge(edge1to2Request.id);

    expect(store.getEdge(edge1to2Request.id)).toEqual(undefined);
  });

  it("should clear node", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.clear();

    expect(store.getNode(node1Request.id)).toEqual(undefined);
  });

  it("should clear port", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);
    store.clear();

    expect(store.getPort(port1Request.id)).toEqual(undefined);
  });

  it("should clear node ports", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);
    store.clear();

    expect(store.getNodePortIds(node1Request.id)).toEqual(undefined);
  });

  it("should clear port node id", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);
    store.clear();

    expect(store.getPortNodeId(port1Request.id)).toEqual(undefined);
  });

  it("should clear edge", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);
    store.addNode(node2Request);
    store.addPort(port2Request);
    store.addEdge(edge1to2Request);
    store.clear();

    expect(store.getEdge(edge1to2Request.id)).toEqual(undefined);
  });

  it("should return port incoming edge ids", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);
    store.addNode(node2Request);
    store.addPort(port2Request);
    store.addEdge(edge1to2Request);

    expect(store.getPortIncomingEdgeIds(port2Request.id)).toEqual([
      edge1to2Request.id,
    ]);
  });

  it("should return port outcoming edge ids", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);
    store.addNode(node2Request);
    store.addPort(port2Request);
    store.addEdge(edge1to2Request);

    expect(store.getPortOutcomingEdgeIds(port1Request.id)).toEqual([
      edge1to2Request.id,
    ]);
  });

  it("should return port cycle edge ids", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);
    store.addEdge(edge1to1Request);

    expect(store.getPortCycleEdgeIds(port1Request.id)).toEqual([
      edge1to1Request.id,
    ]);
  });

  it("should return port incoming edge ids as adjacent edge", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);
    store.addNode(node2Request);
    store.addPort(port2Request);
    store.addEdge(edge1to2Request);

    expect(store.getPortAdjacentEdgeIds(port2Request.id)).toEqual([
      edge1to2Request.id,
    ]);
  });

  it("should return port outcoming edge ids as adjacent edge", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);
    store.addNode(node2Request);
    store.addPort(port2Request);
    store.addEdge(edge1to2Request);

    expect(store.getPortAdjacentEdgeIds(port1Request.id)).toEqual([
      edge1to2Request.id,
    ]);
  });

  it("should return port cycle edge ids as adjacent edge", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);
    store.addEdge(edge1to1Request);

    expect(store.getPortAdjacentEdgeIds(port1Request.id)).toEqual([
      edge1to1Request.id,
    ]);
  });

  it("should return node incoming edge ids", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);
    store.addNode(node2Request);
    store.addPort(port2Request);
    store.addEdge(edge1to2Request);

    expect(store.getNodeIncomingEdgeIds(node2Request.id)).toEqual([
      edge1to2Request.id,
    ]);
  });

  it("should return node outcoming edge ids", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);
    store.addNode(node2Request);
    store.addPort(port2Request);
    store.addEdge(edge1to2Request);

    expect(store.getNodeOutcomingEdgeIds(node1Request.id)).toEqual([
      edge1to2Request.id,
    ]);
  });

  it("should return node cycle edge ids", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);
    store.addEdge(edge1to1Request);

    expect(store.getNodeCycleEdgeIds(node1Request.id)).toEqual([
      edge1to1Request.id,
    ]);
  });

  it("should return node incoming edge ids as adjacent edges", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);
    store.addNode(node2Request);
    store.addPort(port2Request);
    store.addEdge(edge1to2Request);

    expect(store.getNodeAdjacentEdgeIds(node2Request.id)).toEqual([
      edge1to2Request.id,
    ]);
  });

  it("should return node outcoming edge ids as adjacent edges", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);
    store.addNode(node2Request);
    store.addPort(port2Request);
    store.addEdge(edge1to2Request);

    expect(store.getNodeAdjacentEdgeIds(node1Request.id)).toEqual([
      edge1to2Request.id,
    ]);
  });

  it("should return node cycle edge ids as adjacent edges", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addPort(port1Request);
    store.addEdge(edge1to1Request);

    expect(store.getNodeAdjacentEdgeIds(node1Request.id)).toEqual([
      edge1to1Request.id,
    ]);
  });

  it("should update edge from", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addNode(node2Request);
    store.addPort(port1Request);
    store.addPort(port2Request);
    store.addEdge(edge1to1Request);

    store.updateEdgeFrom(edge1to1Request.id, port2Request.id);

    expect(store.getPortAdjacentEdgeIds(port2Request.id)).toEqual([
      edge1to1Request.id,
    ]);
  });

  it("should update edge to", () => {
    const store = new GraphStore();

    store.addNode(node1Request);
    store.addNode(node2Request);
    store.addPort(port1Request);
    store.addPort(port2Request);
    store.addEdge(edge1to1Request);

    store.updateEdgeTo(edge1to1Request.id, port2Request.id);

    expect(store.getPortAdjacentEdgeIds(port2Request.id)).toEqual([
      edge1to1Request.id,
    ]);
  });
});
