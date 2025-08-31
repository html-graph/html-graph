import { GraphStore } from "./graph-store";
import { BezierEdgeShape, HorizontalEdgeShape } from "@/edges";
import { AddNodeRequest } from "./add-node-request";
import { AddPortRequest } from "./add-port-request";
import { AddEdgeRequest } from "./add-edge-request";
import { StorePort } from "./store-port";
import { StoreNode } from "./store-node";
import { CenterFn, standardCenterFn } from "@/center-fn";
import { StoreEdge } from "./store-edge";

const createAddNodeRequest1 = (): AddNodeRequest => {
  return {
    id: "node-1",
    element: document.createElement("div"),
    x: 0,
    y: 0,
    centerFn: standardCenterFn,
    priority: 0,
  };
};

const createAddNodeRequest2 = (): AddNodeRequest => {
  return {
    id: "node-2",
    element: document.createElement("div"),
    x: 0,
    y: 0,
    centerFn: standardCenterFn,
    priority: 0,
  };
};

const createAddPortRequestOut1 = (): AddPortRequest => {
  return {
    id: "port-1-out",
    nodeId: "node-1",
    element: document.createElement("div"),
    direction: 0,
  };
};

const createAddPortRequestIn1 = (): AddPortRequest => {
  return {
    id: "port-1-in",
    nodeId: "node-1",
    element: document.createElement("div"),
    direction: 0,
  };
};

const createAddPortRequestIn2 = (): AddPortRequest => {
  return {
    id: "port-2-in",
    nodeId: "node-2",
    element: document.createElement("div"),
    direction: 0,
  };
};

const createAddEdgeRequest1Out2In = (): AddEdgeRequest => {
  return {
    id: "edge-1-out-2-in",
    from: "port-1-out",
    to: "port-2-in",
    shape: new BezierEdgeShape(),
    priority: 0,
  };
};

const createAddEdgeRequest1Out1Out = (): AddEdgeRequest => {
  return {
    id: "edge-1-out-1-out",
    from: "port-1-out",
    to: "port-1-out",
    shape: new BezierEdgeShape(),
    priority: 0,
  };
};

const createAddEdgeRequest1Out1In = (): AddEdgeRequest => {
  return {
    id: "edge-1-out-1-in",
    from: "port-1-out",
    to: "port-1-in",
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

    const expected: StoreNode = {
      element: addNodeRequest1.element,
      payload: {
        x: 0,
        y: 0,
        centerFn: addNodeRequest1.centerFn,
        priority: addNodeRequest1.priority,
      },
      ports: new Map(),
    };

    expect(store.getNode(addNodeRequest1.id)).toEqual(expected);
  });

  it("should emit event after node added", () => {
    const store = new GraphStore();

    const handler = jest.fn();

    store.onAfterNodeAdded.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();

    store.addNode(addNodeRequest1);

    expect(handler).toHaveBeenCalledWith(addNodeRequest1.id);
  });

  it("should update node coordinates", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();

    store.addNode(addNodeRequest1);

    const centerFn: CenterFn = () => ({ x: 0, y: 0 });

    store.updateNode(addNodeRequest1.id, {
      x: 100,
      y: 100,
      centerFn,
      priority: undefined,
    });

    const expected: StoreNode = {
      element: addNodeRequest1.element,
      payload: {
        x: 100,
        y: 100,
        centerFn,
        priority: addNodeRequest1.priority,
      },
      ports: new Map(),
    };

    expect(store.getNode(addNodeRequest1.id)).toEqual(expected);
  });

  it("should emit event after updating node coordinates", () => {
    const store = new GraphStore();

    const handler = jest.fn();

    store.onAfterNodeUpdated.subscribe(handler);

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

  it("should update node priority", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();

    store.addNode(addNodeRequest1);

    store.updateNode(addNodeRequest1.id, {
      x: undefined,
      y: undefined,
      centerFn: undefined,
      priority: 10,
    });

    const expected: StoreNode = {
      element: addNodeRequest1.element,
      payload: {
        x: addNodeRequest1.x,
        y: addNodeRequest1.y,
        centerFn: addNodeRequest1.centerFn,
        priority: 10,
      },
      ports: new Map(),
    };

    expect(store.getNode(addNodeRequest1.id)).toEqual(expected);
  });

  it("should emit event after updating node priority", () => {
    const store = new GraphStore();

    const handler = jest.fn();

    store.onAfterNodePriorityUpdated.subscribe(handler);

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

  it("should emit before node removed", () => {
    const store = new GraphStore();

    const handler = jest.fn();

    store.onBeforeNodeRemoved.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();

    store.addNode(addNodeRequest1);

    store.removeNode(addNodeRequest1.id);

    expect(handler).toHaveBeenCalledWith(addNodeRequest1.id);
  });

  it("should return undefined for non-existing port", () => {
    const store = new GraphStore();

    expect(store.getPort(1)).toBe(undefined);
  });

  it("should return specified port for existing port", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequestOut1 = createAddPortRequestOut1();
    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);

    const expected: StorePort = {
      element: addPortRequestOut1.element,
      payload: {
        direction: addPortRequestOut1.direction,
      },
      nodeId: addNodeRequest1.id,
    };

    expect(store.getPort(addPortRequestOut1.id)).toEqual(expected);
  });

  it("should emit after port added", () => {
    const store = new GraphStore();

    const handler = jest.fn();

    store.onAfterPortAdded.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequestOut1 = createAddPortRequestOut1();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);

    expect(handler).toHaveBeenCalledWith(addPortRequestOut1.id);
  });

  it("should update port direction", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequestOut1 = createAddPortRequestOut1();
    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);

    store.updatePort(addPortRequestOut1.id, {
      direction: Math.PI,
    });

    const expected: StorePort = {
      element: addPortRequestOut1.element,
      payload: {
        direction: Math.PI,
      },
      nodeId: addNodeRequest1.id,
    };

    expect(store.getPort(addPortRequestOut1.id)).toEqual(expected);
  });

  it("should emit after port direction updated", () => {
    const store = new GraphStore();

    const handler = jest.fn();

    store.onAfterPortUpdated.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequestOut1 = createAddPortRequestOut1();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);

    store.updatePort(addPortRequestOut1.id, {
      direction: Math.PI,
    });

    expect(handler).toHaveBeenCalledWith(addPortRequestOut1.id);
  });

  it("should return all added port ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequestOut1 = createAddPortRequestOut1();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);

    expect(store.getAllPortIds()).toEqual([addPortRequestOut1.id]);
  });

  it("should return undefined when getting ports of non-existing node", () => {
    const store = new GraphStore();

    expect(store.getNodePortIds(1)).toBe(undefined);
  });

  it("should return node port id for existing node", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequestOut1 = createAddPortRequestOut1();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);

    expect(store.getNodePortIds(addNodeRequest1.id)).toEqual([
      addPortRequestOut1.id,
    ]);
  });

  it("should remove node port", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequestOut1 = createAddPortRequestOut1();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.removePort(addPortRequestOut1.id);

    expect(store.getPort(addPortRequestOut1.id)).toEqual(undefined);
  });

  it("should emit before port removed", () => {
    const store = new GraphStore();

    const handler = jest.fn();

    store.onBeforePortRemoved.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequestOut1 = createAddPortRequestOut1();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.removePort(addPortRequestOut1.id);

    expect(handler).toHaveBeenCalledWith(addPortRequestOut1.id);
  });

  it("should return undefined when getting non-existing id", () => {
    const store = new GraphStore();

    expect(store.getEdge(1)).toBe(undefined);
  });

  it("should return specified edge", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn2 = createAddPortRequestIn2();
    const addEdgeRequest12 = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequestIn2);
    store.addEdge(addEdgeRequest12);

    const expected: StoreEdge = {
      from: addEdgeRequest12.from,
      to: addEdgeRequest12.to,
      payload: {
        shape: addEdgeRequest12.shape,
        priority: addEdgeRequest12.priority,
      },
    };

    expect(store.getEdge(addEdgeRequest12.id)).toEqual(expected);
  });

  it("should emit event after edge added", () => {
    const store = new GraphStore();

    const handler = jest.fn();

    store.onAfterEdgeAdded.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn2 = createAddPortRequestIn2();
    const addEdgeRequest12 = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequestIn2);
    store.addEdge(addEdgeRequest12);

    expect(handler).toHaveBeenCalledWith(addEdgeRequest12.id);
  });

  it("should update edge shape", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn2 = createAddPortRequestIn2();
    const addEdgeRequest12 = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequestIn2);
    store.addEdge(addEdgeRequest12);

    const shape = new HorizontalEdgeShape();

    store.updateEdge(addEdgeRequest12.id, {
      from: undefined,
      to: undefined,
      shape,
      priority: undefined,
    });

    const expected: StoreEdge = {
      from: addEdgeRequest12.from,
      to: addEdgeRequest12.to,
      payload: {
        shape: shape,
        priority: addEdgeRequest12.priority,
      },
    };

    expect(store.getEdge(addEdgeRequest12.id)).toEqual(expected);
  });

  it("should emit event after edge shape updated", () => {
    const store = new GraphStore();

    const handler = jest.fn();

    store.onAfterEdgeShapeUpdated.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn2 = createAddPortRequestIn2();
    const addEdgeRequest12 = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequestIn2);
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

  it("should update edge priority", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn2 = createAddPortRequestIn2();
    const addEdgeRequest12 = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequestIn2);
    store.addEdge(addEdgeRequest12);

    store.updateEdge(addEdgeRequest12.id, {
      from: undefined,
      to: undefined,
      shape: undefined,
      priority: 10,
    });

    const expected: StoreEdge = {
      from: addEdgeRequest12.from,
      to: addEdgeRequest12.to,
      payload: {
        shape: addEdgeRequest12.shape,
        priority: 10,
      },
    };

    expect(store.getEdge(addEdgeRequest12.id)).toEqual(expected);
  });

  it("should emit event after edge priority updated", () => {
    const store = new GraphStore();

    const handler = jest.fn();

    store.onAfterEdgePriorityUpdated.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn2 = createAddPortRequestIn2();
    const addEdgeRequest12 = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequestIn2);
    store.addEdge(addEdgeRequest12);

    store.updateEdge(addEdgeRequest12.id, {
      from: undefined,
      to: undefined,
      shape: undefined,
      priority: 10,
    });

    expect(handler).toHaveBeenCalledWith(addEdgeRequest12.id);
  });

  it("should return all edge ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn2 = createAddPortRequestIn2();
    const addEdgeRequest12 = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequestIn2);
    store.addEdge(addEdgeRequest12);

    expect(store.getAllEdgeIds()).toEqual([addEdgeRequest12.id]);
  });

  it("should remove edge", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn2 = createAddPortRequestIn2();
    const addEdgeRequest12 = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequestIn2);
    store.addEdge(addEdgeRequest12);
    store.removeEdge(addEdgeRequest12.id);

    expect(store.getEdge(addEdgeRequest12.id)).toEqual(undefined);
  });

  it("should emit event before edge removed", () => {
    const store = new GraphStore();

    const handler = jest.fn();

    store.onBeforeEdgeRemoved.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn2 = createAddPortRequestIn2();
    const addEdgeRequest12 = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequestIn2);
    store.addEdge(addEdgeRequest12);

    store.removeEdge(addEdgeRequest12.id);

    expect(handler).toHaveBeenCalledWith(addEdgeRequest12.id);
  });

  it("should clear node", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    store.addNode(addNodeRequest1);
    store.clear();

    expect(store.getNode(addNodeRequest1.id)).toEqual(undefined);
  });

  it("should emit event before clear", () => {
    const store = new GraphStore();

    const handler = jest.fn();

    store.onBeforeClear.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    store.addNode(addNodeRequest1);
    store.clear();

    expect(handler).toHaveBeenCalled();
  });

  it("should clear port", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequestOut1 = createAddPortRequestOut1();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.clear();

    expect(store.getPort(addPortRequestOut1.id)).toEqual(undefined);
  });

  it("should clear node ports", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequestOut1 = createAddPortRequestOut1();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);

    store.clear();

    expect(store.getNodePortIds(addNodeRequest1.id)).toEqual(undefined);
  });

  it("should clear edge", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn2 = createAddPortRequestIn2();
    const addEdgeRequest12 = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequestIn2);
    store.addEdge(addEdgeRequest12);
    store.clear();

    expect(store.getEdge(addEdgeRequest12.id)).toEqual(undefined);
  });

  it("should return port incoming edge ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn2 = createAddPortRequestIn2();
    const addEdgeRequest12 = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequestIn2);
    store.addEdge(addEdgeRequest12);

    expect(store.getPortIncomingEdgeIds(addPortRequestIn2.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return port outgoing edge ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn2 = createAddPortRequestIn2();
    const addEdgeRequest12 = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequestIn2);
    store.addEdge(addEdgeRequest12);

    expect(store.getPortOutgoingEdgeIds(addPortRequestOut1.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return port cycle edge ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addEdgeRequest11 = createAddEdgeRequest1Out1Out();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addEdge(addEdgeRequest11);

    expect(store.getPortCycleEdgeIds(addPortRequestOut1.id)).toEqual([
      addEdgeRequest11.id,
    ]);
  });

  it("should return port incoming edge ids as adjacent edge", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn2 = createAddPortRequestIn2();
    const addEdgeRequest12 = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequestIn2);
    store.addEdge(addEdgeRequest12);

    expect(store.getPortAdjacentEdgeIds(addPortRequestIn2.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return port outgoing edge ids as adjacent edge", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn2 = createAddPortRequestIn2();
    const addEdgeRequest12 = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequestIn2);
    store.addEdge(addEdgeRequest12);

    expect(store.getPortAdjacentEdgeIds(addPortRequestOut1.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return port cycle edge ids as adjacent edge", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addEdgeRequest11 = createAddEdgeRequest1Out1Out();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addEdge(addEdgeRequest11);

    expect(store.getPortAdjacentEdgeIds(addPortRequestOut1.id)).toEqual([
      addEdgeRequest11.id,
    ]);
  });

  it("should return node incoming edge ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn2 = createAddPortRequestIn2();
    const addEdgeRequest12 = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequestIn2);
    store.addEdge(addEdgeRequest12);

    expect(store.getNodeIncomingEdgeIds(addNodeRequest2.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should not include node cycle edges to node incoming edges", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn1 = createAddPortRequestIn1();
    const addEdgeRequest1Out1In = createAddEdgeRequest1Out1In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addPort(addPortRequestIn1);
    store.addEdge(addEdgeRequest1Out1In);

    expect(store.getNodeIncomingEdgeIds(addNodeRequest1.id)).toEqual([]);
  });

  it("should return node outgoing edge ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn2 = createAddPortRequestIn2();
    const addEdgeRequest12 = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequestIn2);
    store.addEdge(addEdgeRequest12);

    expect(store.getNodeOutgoingEdgeIds(addNodeRequest1.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should not include node cycle edges to node outgoing edges", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn1 = createAddPortRequestIn1();
    const addEdgeRequest1Out1In = createAddEdgeRequest1Out1In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addPort(addPortRequestIn1);
    store.addEdge(addEdgeRequest1Out1In);

    expect(store.getNodeOutgoingEdgeIds(addNodeRequest1.id)).toEqual([]);
  });

  it("should return node cycle edge ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addEdgeRequest11 = createAddEdgeRequest1Out1Out();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addEdge(addEdgeRequest11);

    expect(store.getNodeCycleEdgeIds(addNodeRequest1.id)).toEqual([
      addEdgeRequest11.id,
    ]);
  });

  it("should not include port incoming edges to node cycle edges", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn1 = createAddPortRequestIn1();
    const addEdgeRequest1Out1In = createAddEdgeRequest1Out1In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addPort(addPortRequestIn1);
    store.addEdge(addEdgeRequest1Out1In);

    expect(store.getNodeCycleEdgeIds(addNodeRequest1.id)).toEqual([
      addEdgeRequest1Out1In.id,
    ]);
  });

  it("should return node incoming edge ids as adjacent edges", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn2 = createAddPortRequestIn2();
    const addEdgeRequest12 = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequestIn2);
    store.addEdge(addEdgeRequest12);

    expect(store.getNodeAdjacentEdgeIds(addNodeRequest2.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return node outgoing edge ids as adjacent edges", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn2 = createAddPortRequestIn2();
    const addEdgeRequest12 = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequestIn2);
    store.addEdge(addEdgeRequest12);

    expect(store.getNodeAdjacentEdgeIds(addNodeRequest1.id)).toEqual([
      addEdgeRequest12.id,
    ]);
  });

  it("should return node cycle edge ids as adjacent edges", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addEdgeRequest11 = createAddEdgeRequest1Out1Out();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.addEdge(addEdgeRequest11);

    expect(store.getNodeAdjacentEdgeIds(addNodeRequest1.id)).toEqual([
      addEdgeRequest11.id,
    ]);
  });

  it("should update edge from", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn2 = createAddPortRequestIn2();
    const addEdgeRequest11 = createAddEdgeRequest1Out1Out();

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequestOut1);
    store.addPort(addPortRequestIn2);
    store.addEdge(addEdgeRequest11);

    store.updateEdge(addEdgeRequest11.id, {
      from: addPortRequestIn2.id,
      to: undefined,
      shape: undefined,
      priority: undefined,
    });

    expect(store.getPortAdjacentEdgeIds(addPortRequestIn2.id)).toEqual([
      addEdgeRequest11.id,
    ]);
  });

  it("should update edge to", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequestOut1 = createAddPortRequestOut1();
    const addPortRequestIn2 = createAddPortRequestIn2();
    const addEdgeRequest11 = createAddEdgeRequest1Out1Out();

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequestOut1);
    store.addPort(addPortRequestIn2);
    store.addEdge(addEdgeRequest11);

    store.updateEdge(addEdgeRequest11.id, {
      from: undefined,
      to: addPortRequestIn2.id,
      shape: undefined,
      priority: undefined,
    });

    expect(store.getPortAdjacentEdgeIds(addPortRequestIn2.id)).toEqual([
      addEdgeRequest11.id,
    ]);
  });

  it("should return element port ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequestOut1 = {
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    };

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);

    expect(store.getElementPortIds(addPortRequestOut1.element)).toEqual([
      "port-1",
    ]);
  });

  it("should remove element port ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequestOut1 = {
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    };

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.removePort(addPortRequestOut1.id);

    expect(store.getElementPortIds(addPortRequestOut1.element)).toEqual([]);
  });

  it("should clear element port ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequestOut1 = {
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    };

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequestOut1);
    store.clear();

    expect(store.getElementPortIds(addPortRequestOut1.element)).toEqual([]);
  });

  it("should return element node id", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();

    store.addNode(addNodeRequest1);

    expect(store.getElementNodeId(addNodeRequest1.element)).toEqual("node-1");
  });

  it("should remove node element", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();

    store.addNode(addNodeRequest1);
    store.removeNode(addNodeRequest1.id);

    expect(store.getElementNodeId(addNodeRequest1.element)).toEqual(undefined);
  });

  it("should clear node elements", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();

    store.addNode(addNodeRequest1);
    store.clear();

    expect(store.getElementNodeId(addNodeRequest1.element)).toEqual(undefined);
  });
});
