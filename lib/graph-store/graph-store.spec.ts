import { Point } from "@/point";
import { GraphStore } from "./graph-store";
import { BezierEdgeShape } from "@/edges";
import { AddNodeRequest } from "./add-node-request";
import { AddPortRequest } from "./add-port-request";
import { AddEdgeRequest } from "./add-edge-request";
import { PortPayload } from "./port-payload";
import { NodePayload } from "./node-payload";

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

describe("GraphStore", () => {
  it("should return undefined for non-existing node", () => {
    const store = new GraphStore();

    expect(store.getNode(1)).toBe(undefined);
  });

  it("should return specified node for existing node", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();

    store.addNode(addNodeRequest1);

    const expected: NodePayload = {
      element: addNodeRequest1.element,
      x: addNodeRequest1.x,
      y: addNodeRequest1.y,
      centerFn: addNodeRequest1.centerFn,
      priority: addNodeRequest1.priority,
      ports: new Map(),
    };

    expect(store.getNode(addNodeRequest1.id)).toEqual(expected);
  });

  it("should return all added node ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    store.addNode(addNodeRequest1);

    expect(store.getAllNodeIds()).toEqual([addNodeRequest1.id]);
  });

  it("should remove node", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    store.addNode(addNodeRequest1);
    store.removeNode(addNodeRequest1.id);

    expect(store.getNode(addNodeRequest1.id)).toBe(undefined);
  });

  it("should return undefined for non-existing port", () => {
    const store = new GraphStore();

    expect(store.getPort(1)).toBe(undefined);
  });

  it("should return specified port for existing port", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();
    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);

    const expected: PortPayload = {
      element: addPortRequest1.element,
      direction: addPortRequest1.direction,
      nodeId: addNodeRequest1.id,
    };

    expect(store.getPort(addPortRequest1.id)).toEqual(expected);
  });

  it("should return all added port ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();
    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);

    expect(store.getAllPortIds()).toEqual([addPortRequest1.id]);
  });

  it("should return undefined when getting ports of non-existing node", () => {
    const store = new GraphStore();

    expect(store.getNodePortIds(1)).toBe(undefined);
  });

  it("should return node port id for existing node", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();
    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);

    expect(store.getNodePortIds(addNodeRequest1.id)).toEqual([
      addPortRequest1.id,
    ]);
  });

  it("should remove node port", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();
    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);
    store.removePort(addPortRequest1.id);

    expect(store.getPort(addPortRequest1.id)).toEqual(undefined);
  });

  it("should return undefined when getting non-existing id", () => {
    const store = new GraphStore();

    expect(store.getEdge(1)).toBe(undefined);
  });

  it("should return specified edge", () => {
    const store = new GraphStore();

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

    expect(store.getEdge(addEdgeRequest12.id)).toEqual({
      from: addEdgeRequest12.from,
      to: addEdgeRequest12.to,
      shape: addEdgeRequest12.shape,
      priority: addEdgeRequest12.priority,
    });
  });

  it("should return all edge ids", () => {
    const store = new GraphStore();

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

    expect(store.getAllEdgeIds()).toEqual([addEdgeRequest12.id]);
  });

  it("should remove edge", () => {
    const store = new GraphStore();

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

    expect(store.getEdge(addEdgeRequest12.id)).toEqual(undefined);
  });

  it("should clear node", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    store.addNode(addNodeRequest1);
    store.clear();

    expect(store.getNode(addNodeRequest1.id)).toEqual(undefined);
  });

  it("should clear port", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();
    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);
    store.clear();

    expect(store.getPort(addPortRequest1.id)).toEqual(undefined);
  });

  it("should clear node ports", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();
    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);
    store.clear();

    expect(store.getNodePortIds(addNodeRequest1.id)).toEqual(undefined);
  });

  it("should clear edge", () => {
    const store = new GraphStore();

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
    store.clear();

    expect(store.getEdge(addEdgeRequest12.id)).toEqual(undefined);
  });

  it("should return port incoming edge ids", () => {
    const store = new GraphStore();

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

    expect(store.getPortIncomingEdgeIds(addPortRequest2.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return port outcoming edge ids", () => {
    const store = new GraphStore();

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

    expect(store.getPortOutcomingEdgeIds(addPortRequest1.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return port cycle edge ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();
    const addEdgeRequest11 = createAddEdgeRequest11();
    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);
    store.addEdge(addEdgeRequest11);

    expect(store.getPortCycleEdgeIds(addPortRequest1.id)).toEqual([
      addEdgeRequest11.id,
    ]);
  });

  it("should return port incoming edge ids as adjacent edge", () => {
    const store = new GraphStore();

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

    expect(store.getPortAdjacentEdgeIds(addPortRequest2.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return port outcoming edge ids as adjacent edge", () => {
    const store = new GraphStore();

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

    expect(store.getPortAdjacentEdgeIds(addPortRequest1.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return port cycle edge ids as adjacent edge", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();
    const addEdgeRequest11 = createAddEdgeRequest11();
    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);
    store.addEdge(addEdgeRequest11);

    expect(store.getPortAdjacentEdgeIds(addPortRequest1.id)).toEqual([
      addEdgeRequest11.id,
    ]);
  });

  it("should return node incoming edge ids", () => {
    const store = new GraphStore();

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

    expect(store.getNodeIncomingEdgeIds(addNodeRequest2.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return node outcoming edge ids", () => {
    const store = new GraphStore();

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

    expect(store.getNodeOutcomingEdgeIds(addNodeRequest1.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return node cycle edge ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();
    const addEdgeRequest11 = createAddEdgeRequest11();
    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);
    store.addEdge(addEdgeRequest11);

    expect(store.getNodeCycleEdgeIds(addNodeRequest1.id)).toEqual([
      addEdgeRequest11.id,
    ]);
  });

  it("should return node incoming edge ids as adjacent edges", () => {
    const store = new GraphStore();

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

    expect(store.getNodeAdjacentEdgeIds(addNodeRequest2.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return node outcoming edge ids as adjacent edges", () => {
    const store = new GraphStore();

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

    expect(store.getNodeAdjacentEdgeIds(addNodeRequest1.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return node cycle edge ids as adjacent edges", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1 = createAddPortRequest1();
    const addEdgeRequest11 = createAddEdgeRequest11();
    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1);
    store.addEdge(addEdgeRequest11);

    expect(store.getNodeAdjacentEdgeIds(addNodeRequest1.id)).toEqual([
      addEdgeRequest11.id,
    ]);
  });

  it("should update edge from", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1 = createAddPortRequest1();
    const addPortRequest2 = createAddPortRequest2();
    const addEdgeRequest11 = createAddEdgeRequest11();
    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest11);

    store.updateEdgeFrom(addEdgeRequest11.id, addPortRequest2.id);

    expect(store.getPortAdjacentEdgeIds(addPortRequest2.id)).toEqual([
      addEdgeRequest11.id,
    ]);
  });

  it("should update edge to", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1 = createAddPortRequest1();
    const addPortRequest2 = createAddPortRequest2();
    const addEdgeRequest11 = createAddEdgeRequest11();
    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest11);

    store.updateEdgeTo(addEdgeRequest11.id, addPortRequest2.id);

    expect(store.getPortAdjacentEdgeIds(addPortRequest2.id)).toEqual([
      addEdgeRequest11.id,
    ]);
  });
});
