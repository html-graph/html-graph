import { Point } from "@/point";
import { GraphStore } from "./graph-store";
import { EdgeShapeMock } from "@/edges";

describe("GraphStore", () => {
  it("should return undefined for non-existing node", () => {
    const store = new GraphStore();

    expect(store.getNode(1)).toBe(undefined);
  });

  it("should return specidied node for existing node", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);

    expect(store.getNode(1)).toEqual({
      element,
      x,
      y,
      centerFn,
      priority,
    });
  });

  it("should return all added node ids", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);

    expect(store.getAllNodeIds()).toEqual([nodeId]);
  });

  it("should remove node", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);
    store.removeNode(nodeId);

    expect(store.getNode(nodeId)).toBe(undefined);
  });

  it("should return undefined for non-existing port", () => {
    const store = new GraphStore();

    expect(store.getPort(1)).toBe(undefined);
  });

  it("should return specidied port for existing port", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);

    const portId = 1;
    const portElement = document.createElement("div");
    const direction = 0;

    store.addPort(portId, portElement, nodeId, centerFn, direction);

    expect(store.getPort(1)).toEqual({
      element,
      centerFn,
      direction,
    });
  });

  it("should return all added port ids", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);

    const portId = 1;
    const portElement = document.createElement("div");
    const direction = 0;

    store.addPort(portId, portElement, nodeId, centerFn, direction);

    expect(store.getAllPortIds()).toEqual([1]);
  });

  it("should return undefined when getting ports of non-existing node", () => {
    const store = new GraphStore();

    expect(store.getNodePortIds(1)).toBe(undefined);
  });

  it("should return node port id for existing node", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);

    const portId = 1;
    const portElement = document.createElement("div");
    const direction = 0;

    store.addPort(portId, portElement, nodeId, centerFn, direction);

    expect(store.getNodePortIds(1)).toEqual([1]);
  });

  it("should return undefined when getting node id of non-existing port", () => {
    const store = new GraphStore();

    expect(store.getPortNodeId(1)).toBe(undefined);
  });

  it("should remove node port", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);

    const portId = 1;
    const portElement = document.createElement("div");
    const direction = 0;

    store.addPort(portId, portElement, nodeId, centerFn, direction);
    store.removePort(portId);

    expect(store.getPort(1)).toEqual(undefined);
  });

  it("should return undefined when getting non-existing id", () => {
    const store = new GraphStore();

    expect(store.getEdge(1)).toBe(undefined);
  });

  it("should return specified edge", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);

    const portIdFrom = 1;
    const portIdTo = 2;
    const portElement = document.createElement("div");
    const direction = 0;

    store.addPort(portIdFrom, portElement, nodeId, centerFn, direction);
    store.addPort(portIdTo, portElement, nodeId, centerFn, direction);

    const edgeId = 1;
    const shape = new EdgeShapeMock();

    store.addEdge(edgeId, portIdFrom, portIdTo, shape, priority);

    expect(store.getEdge(edgeId)).toEqual({
      from: portIdFrom,
      to: portIdTo,
      shape,
      priority,
    });
  });

  it("should return all edge ids", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);

    const portIdFrom = 1;
    const portIdTo = 2;
    const portElement = document.createElement("div");
    const direction = 0;

    store.addPort(portIdFrom, portElement, nodeId, centerFn, direction);
    store.addPort(portIdTo, portElement, nodeId, centerFn, direction);

    const edgeId = 1;
    const shape = new EdgeShapeMock();

    store.addEdge(edgeId, portIdFrom, portIdTo, shape, priority);

    expect(store.getAllEdgeIds()).toEqual([edgeId]);
  });

  it("should remove edge", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);

    const portIdFrom = 1;
    const portIdTo = 2;
    const portElement = document.createElement("div");
    const direction = 0;

    store.addPort(portIdFrom, portElement, nodeId, centerFn, direction);
    store.addPort(portIdTo, portElement, nodeId, centerFn, direction);

    const edgeId = 1;
    const shape = new EdgeShapeMock();

    store.addEdge(edgeId, portIdFrom, portIdTo, shape, priority);
    store.removeEdge(edgeId);

    expect(store.getEdge(edgeId)).toEqual(undefined);
  });

  it("should clear node", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);

    store.clear();

    expect(store.getNode(nodeId)).toEqual(undefined);
  });

  it("should clear port", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);

    const portId = 1;
    const portElement = document.createElement("div");
    const direction = 0;

    store.addPort(portId, portElement, nodeId, centerFn, direction);

    store.clear();

    expect(store.getPort(portId)).toEqual(undefined);
  });

  it("should clear node ports", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);

    const portId = 1;
    const portElement = document.createElement("div");
    const direction = 0;

    store.addPort(portId, portElement, nodeId, centerFn, direction);

    store.clear();

    expect(store.getNodePortIds(nodeId)).toEqual(undefined);
  });

  it("should clear port node id", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);

    const portId = 1;
    const portElement = document.createElement("div");
    const direction = 0;

    store.addPort(portId, portElement, nodeId, centerFn, direction);

    store.clear();

    expect(store.getPortNodeId(portId)).toEqual(undefined);
  });

  it("should clear edge", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);

    const portIdFrom = 1;
    const portIdTo = 2;
    const portElement = document.createElement("div");
    const direction = 0;

    store.addPort(portIdFrom, portElement, nodeId, centerFn, direction);
    store.addPort(portIdTo, portElement, nodeId, centerFn, direction);

    const edgeId = 1;
    const shape = new EdgeShapeMock();

    store.addEdge(edgeId, portIdFrom, portIdTo, shape, priority);

    store.clear();

    expect(store.getEdge(edgeId)).toEqual(undefined);
  });

  it("should return port incoming edge ids", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);

    const portIdFrom = 1;
    const portIdTo = 2;
    const portElement = document.createElement("div");
    const direction = 0;

    store.addPort(portIdFrom, portElement, nodeId, centerFn, direction);
    store.addPort(portIdTo, portElement, nodeId, centerFn, direction);

    const edgeId = 1;
    const shape = new EdgeShapeMock();

    store.addEdge(edgeId, portIdFrom, portIdTo, shape, priority);

    expect(store.getPortIncomingEdgeIds(portIdTo)).toEqual([edgeId]);
  });

  it("should return port outcoming edge ids", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);

    const portIdFrom = 1;
    const portIdTo = 2;
    const portElement = document.createElement("div");
    const direction = 0;

    store.addPort(portIdFrom, portElement, nodeId, centerFn, direction);
    store.addPort(portIdTo, portElement, nodeId, centerFn, direction);

    const edgeId = 1;
    const shape = new EdgeShapeMock();

    store.addEdge(edgeId, portIdFrom, portIdTo, shape, priority);

    expect(store.getPortOutcomingEdgeIds(portIdFrom)).toEqual([edgeId]);
  });

  it("should return port cycle edge ids", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);

    const portId = 1;
    const portElement = document.createElement("div");
    const direction = 0;

    store.addPort(portId, portElement, nodeId, centerFn, direction);

    const edgeId = 1;
    const shape = new EdgeShapeMock();

    store.addEdge(edgeId, portId, portId, shape, priority);

    expect(store.getPortCycleEdgeIds(portId)).toEqual([edgeId]);
  });

  it("should return port incoming edge ids as adjacent edge", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);

    const portIdFrom = 1;
    const portIdTo = 2;
    const portElement = document.createElement("div");
    const direction = 0;

    store.addPort(portIdFrom, portElement, nodeId, centerFn, direction);
    store.addPort(portIdTo, portElement, nodeId, centerFn, direction);

    const edgeId = 1;
    const shape = new EdgeShapeMock();

    store.addEdge(edgeId, portIdFrom, portIdTo, shape, priority);

    expect(store.getPortAdjacentEdgeIds(portIdTo)).toEqual([edgeId]);
  });

  it("should return port outcoming edge ids as adjacent edge", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);

    const portIdFrom = 1;
    const portIdTo = 2;
    const portElement = document.createElement("div");
    const direction = 0;

    store.addPort(portIdFrom, portElement, nodeId, centerFn, direction);
    store.addPort(portIdTo, portElement, nodeId, centerFn, direction);

    const edgeId = 1;
    const shape = new EdgeShapeMock();

    store.addEdge(edgeId, portIdFrom, portIdTo, shape, priority);

    expect(store.getPortAdjacentEdgeIds(portIdFrom)).toEqual([edgeId]);
  });

  it("should return port cycle edge ids as adjacent edge", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);

    const portId = 1;
    const portElement = document.createElement("div");
    const direction = 0;

    store.addPort(portId, portElement, nodeId, centerFn, direction);

    const edgeId = 1;
    const shape = new EdgeShapeMock();

    store.addEdge(edgeId, portId, portId, shape, priority);

    expect(store.getPortAdjacentEdgeIds(portId)).toEqual([edgeId]);
  });

  it("should return node incoming edge ids", () => {
    const store = new GraphStore();

    const nodeId1 = 1;
    const element1 = document.createElement("div");
    const nodeId2 = 2;
    const element2 = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId1, element1, x, y, centerFn, priority);
    store.addNode(nodeId2, element2, x, y, centerFn, priority);

    const portIdFrom = 1;
    const portIdTo = 2;
    const portElement1 = document.createElement("div");
    const portElement2 = document.createElement("div");
    const direction = 0;

    store.addPort(portIdFrom, portElement1, nodeId1, centerFn, direction);
    store.addPort(portIdTo, portElement2, nodeId2, centerFn, direction);

    const edgeId = 1;
    const shape = new EdgeShapeMock();

    store.addEdge(edgeId, portIdFrom, portIdTo, shape, priority);

    expect(store.getNodeIncomingEdgeIds(nodeId2)).toEqual([edgeId]);
  });

  it("should return node outcoming edge ids", () => {
    const store = new GraphStore();

    const nodeId1 = 1;
    const element1 = document.createElement("div");
    const nodeId2 = 2;
    const element2 = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId1, element1, x, y, centerFn, priority);
    store.addNode(nodeId2, element2, x, y, centerFn, priority);

    const portIdFrom = 1;
    const portIdTo = 2;
    const portElement1 = document.createElement("div");
    const portElement2 = document.createElement("div");
    const direction = 0;

    store.addPort(portIdFrom, portElement1, nodeId1, centerFn, direction);
    store.addPort(portIdTo, portElement2, nodeId2, centerFn, direction);

    const edgeId = 1;
    const shape = new EdgeShapeMock();

    store.addEdge(edgeId, portIdFrom, portIdTo, shape, priority);

    expect(store.getNodeOutcomingEdgeIds(nodeId1)).toEqual([edgeId]);
  });

  it("should return node cycle edge ids", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);

    const portId = 1;
    const portElement = document.createElement("div");
    const direction = 0;

    store.addPort(portId, portElement, nodeId, centerFn, direction);

    const edgeId = 1;
    const shape = new EdgeShapeMock();

    store.addEdge(edgeId, portId, portId, shape, priority);

    expect(store.getNodeCycleEdgeIds(nodeId)).toEqual([edgeId]);
  });

  it("should return node incoming edge ids as adjacent edges", () => {
    const store = new GraphStore();

    const nodeId1 = 1;
    const element1 = document.createElement("div");
    const nodeId2 = 2;
    const element2 = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId1, element1, x, y, centerFn, priority);
    store.addNode(nodeId2, element2, x, y, centerFn, priority);

    const portIdFrom = 1;
    const portIdTo = 2;
    const portElement1 = document.createElement("div");
    const portElement2 = document.createElement("div");
    const direction = 0;

    store.addPort(portIdFrom, portElement1, nodeId1, centerFn, direction);
    store.addPort(portIdTo, portElement2, nodeId2, centerFn, direction);

    const edgeId = 1;
    const shape = new EdgeShapeMock();

    store.addEdge(edgeId, portIdFrom, portIdTo, shape, priority);

    expect(store.getNodeAdjacentEdgeIds(nodeId2)).toEqual([edgeId]);
  });

  it("should return node outcoming edge ids as adjacent edges", () => {
    const store = new GraphStore();

    const nodeId1 = 1;
    const element1 = document.createElement("div");
    const nodeId2 = 2;
    const element2 = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId1, element1, x, y, centerFn, priority);
    store.addNode(nodeId2, element2, x, y, centerFn, priority);

    const portIdFrom = 1;
    const portIdTo = 2;
    const portElement1 = document.createElement("div");
    const portElement2 = document.createElement("div");
    const direction = 0;

    store.addPort(portIdFrom, portElement1, nodeId1, centerFn, direction);
    store.addPort(portIdTo, portElement2, nodeId2, centerFn, direction);

    const edgeId = 1;
    const shape = new EdgeShapeMock();

    store.addEdge(edgeId, portIdFrom, portIdTo, shape, priority);

    expect(store.getNodeAdjacentEdgeIds(nodeId1)).toEqual([edgeId]);
  });

  it("should return node cycle edge ids as adjacent edges", () => {
    const store = new GraphStore();

    const nodeId = 1;
    const element = document.createElement("div");
    const x = 0;
    const y = 0;
    const centerFn = (): Point => ({ x: 0, y: 0 });
    const priority = 0;

    store.addNode(nodeId, element, x, y, centerFn, priority);

    const portId = 1;
    const portElement = document.createElement("div");
    const direction = 0;

    store.addPort(portId, portElement, nodeId, centerFn, direction);

    const edgeId = 1;
    const shape = new EdgeShapeMock();

    store.addEdge(edgeId, portId, portId, shape, priority);

    expect(store.getNodeAdjacentEdgeIds(nodeId)).toEqual([edgeId]);
  });
});
