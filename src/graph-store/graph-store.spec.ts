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

const createAddPortRequest1Out = (): AddPortRequest => {
  return {
    id: "port-1-out",
    nodeId: "node-1",
    element: document.createElement("div"),
    direction: 0,
  };
};

const createAddPortRequest1In = (): AddPortRequest => {
  return {
    id: "port-1-in",
    nodeId: "node-1",
    element: document.createElement("div"),
    direction: 0,
  };
};

const createAddPortRequest2In = (): AddPortRequest => {
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
    const addPortRequest1Out = createAddPortRequest1Out();
    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);

    const expected: StorePort = {
      element: addPortRequest1Out.element,
      payload: {
        direction: addPortRequest1Out.direction,
      },
      nodeId: addNodeRequest1.id,
    };

    expect(store.getPort(addPortRequest1Out.id)).toEqual(expected);
  });

  it("should emit after port added", () => {
    const store = new GraphStore();

    const handler = jest.fn();

    store.onAfterPortAdded.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1Out = createAddPortRequest1Out();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);

    expect(handler).toHaveBeenCalledWith(addPortRequest1Out.id);
  });

  it("should update port direction", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1Out = createAddPortRequest1Out();
    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);

    store.updatePort(addPortRequest1Out.id, {
      direction: Math.PI,
    });

    const expected: StorePort = {
      element: addPortRequest1Out.element,
      payload: {
        direction: Math.PI,
      },
      nodeId: addNodeRequest1.id,
    };

    expect(store.getPort(addPortRequest1Out.id)).toEqual(expected);
  });

  it("should emit after port direction updated", () => {
    const store = new GraphStore();

    const handler = jest.fn();

    store.onAfterPortUpdated.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1Out = createAddPortRequest1Out();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);

    store.updatePort(addPortRequest1Out.id, {
      direction: Math.PI,
    });

    expect(handler).toHaveBeenCalledWith(addPortRequest1Out.id);
  });

  it("should return all added port ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1Out = createAddPortRequest1Out();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);

    expect(store.getAllPortIds()).toEqual([addPortRequest1Out.id]);
  });

  it("should return undefined when getting ports of non-existing node", () => {
    const store = new GraphStore();

    expect(store.getNodePortIds(1)).toBe(undefined);
  });

  it("should return node port id for existing node", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1Out = createAddPortRequest1Out();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);

    expect(store.getNodePortIds(addNodeRequest1.id)).toEqual([
      addPortRequest1Out.id,
    ]);
  });

  it("should remove node port", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1Out = createAddPortRequest1Out();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.removePort(addPortRequest1Out.id);

    expect(store.getPort(addPortRequest1Out.id)).toEqual(undefined);
  });

  it("should emit before port removed", () => {
    const store = new GraphStore();

    const handler = jest.fn();

    store.onBeforePortRemoved.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1Out = createAddPortRequest1Out();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.removePort(addPortRequest1Out.id);

    expect(handler).toHaveBeenCalledWith(addPortRequest1Out.id);
  });

  it("should return undefined when getting non-existing id", () => {
    const store = new GraphStore();

    expect(store.getEdge(1)).toBe(undefined);
  });

  it("should return specified edge", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest2In = createAddPortRequest2In();
    const addEdgeRequest1Out2In = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest2In);
    store.addEdge(addEdgeRequest1Out2In);

    const expected: StoreEdge = {
      from: addEdgeRequest1Out2In.from,
      to: addEdgeRequest1Out2In.to,
      payload: {
        shape: addEdgeRequest1Out2In.shape,
        priority: addEdgeRequest1Out2In.priority,
      },
    };

    expect(store.getEdge(addEdgeRequest1Out2In.id)).toEqual(expected);
  });

  it("should emit event after edge added", () => {
    const store = new GraphStore();

    const handler = jest.fn();

    store.onAfterEdgeAdded.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest2In = createAddPortRequest2In();
    const addEdgeRequest1Out2In = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest2In);
    store.addEdge(addEdgeRequest1Out2In);

    expect(handler).toHaveBeenCalledWith(addEdgeRequest1Out2In.id);
  });

  it("should update edge shape", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest2In = createAddPortRequest2In();
    const addEdgeRequest1Out2In = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest2In);
    store.addEdge(addEdgeRequest1Out2In);

    const shape = new HorizontalEdgeShape();

    store.updateEdge(addEdgeRequest1Out2In.id, {
      from: undefined,
      to: undefined,
      shape,
      priority: undefined,
    });

    const expected: StoreEdge = {
      from: addEdgeRequest1Out2In.from,
      to: addEdgeRequest1Out2In.to,
      payload: {
        shape: shape,
        priority: addEdgeRequest1Out2In.priority,
      },
    };

    expect(store.getEdge(addEdgeRequest1Out2In.id)).toEqual(expected);
  });

  it("should emit event after edge shape updated", () => {
    const store = new GraphStore();

    const handler = jest.fn();

    store.onAfterEdgeShapeUpdated.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest2In = createAddPortRequest2In();
    const addEdgeRequest1Out2In = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest2In);
    store.addEdge(addEdgeRequest1Out2In);

    const shape = new HorizontalEdgeShape();

    store.updateEdge(addEdgeRequest1Out2In.id, {
      from: undefined,
      to: undefined,
      shape,
      priority: undefined,
    });

    expect(handler).toHaveBeenCalledWith(addEdgeRequest1Out2In.id);
  });

  it("should update edge priority", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest2In = createAddPortRequest2In();
    const addEdgeRequest1Out2In = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest2In);
    store.addEdge(addEdgeRequest1Out2In);

    store.updateEdge(addEdgeRequest1Out2In.id, {
      from: undefined,
      to: undefined,
      shape: undefined,
      priority: 10,
    });

    const expected: StoreEdge = {
      from: addEdgeRequest1Out2In.from,
      to: addEdgeRequest1Out2In.to,
      payload: {
        shape: addEdgeRequest1Out2In.shape,
        priority: 10,
      },
    };

    expect(store.getEdge(addEdgeRequest1Out2In.id)).toEqual(expected);
  });

  it("should emit event after edge priority updated", () => {
    const store = new GraphStore();

    const handler = jest.fn();

    store.onAfterEdgePriorityUpdated.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest2In = createAddPortRequest2In();
    const addEdgeRequest1Out2In = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest2In);
    store.addEdge(addEdgeRequest1Out2In);

    store.updateEdge(addEdgeRequest1Out2In.id, {
      from: undefined,
      to: undefined,
      shape: undefined,
      priority: 10,
    });

    expect(handler).toHaveBeenCalledWith(addEdgeRequest1Out2In.id);
  });

  it("should return all edge ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest2In = createAddPortRequest2In();
    const addEdgeRequest1Out2In = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest2In);
    store.addEdge(addEdgeRequest1Out2In);

    expect(store.getAllEdgeIds()).toEqual([addEdgeRequest1Out2In.id]);
  });

  it("should remove edge", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest2In = createAddPortRequest2In();
    const addEdgeRequest1Out2In = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest2In);
    store.addEdge(addEdgeRequest1Out2In);
    store.removeEdge(addEdgeRequest1Out2In.id);

    expect(store.getEdge(addEdgeRequest1Out2In.id)).toEqual(undefined);
  });

  it("should emit event before edge removed", () => {
    const store = new GraphStore();

    const handler = jest.fn();

    store.onBeforeEdgeRemoved.subscribe(handler);

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest2In = createAddPortRequest2In();
    const addEdgeRequest1Out2In = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest2In);
    store.addEdge(addEdgeRequest1Out2In);

    store.removeEdge(addEdgeRequest1Out2In.id);

    expect(handler).toHaveBeenCalledWith(addEdgeRequest1Out2In.id);
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
    const addPortRequest1Out = createAddPortRequest1Out();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.clear();

    expect(store.getPort(addPortRequest1Out.id)).toEqual(undefined);
  });

  it("should clear node ports", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1Out = createAddPortRequest1Out();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);

    store.clear();

    expect(store.getNodePortIds(addNodeRequest1.id)).toEqual(undefined);
  });

  it("should clear edge", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest2In = createAddPortRequest2In();
    const addEdgeRequest1Out2In = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest2In);
    store.addEdge(addEdgeRequest1Out2In);
    store.clear();

    expect(store.getEdge(addEdgeRequest1Out2In.id)).toEqual(undefined);
  });

  it("should return port incoming edge ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest2In = createAddPortRequest2In();
    const addEdgeRequest1Out2In = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest2In);
    store.addEdge(addEdgeRequest1Out2In);

    expect(store.getPortIncomingEdgeIds(addPortRequest2In.id)).toEqual([
      addEdgeRequest1Out2In.id,
    ]);
  });

  it("should return port outgoing edge ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest2In = createAddPortRequest2In();
    const addEdgeRequest1Out2In = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest2In);
    store.addEdge(addEdgeRequest1Out2In);

    expect(store.getPortOutgoingEdgeIds(addPortRequest1Out.id)).toEqual([
      addEdgeRequest1Out2In.id,
    ]);
  });

  it("should return port cycle edge ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addEdgeRequest1Out1Out = createAddEdgeRequest1Out1Out();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addEdge(addEdgeRequest1Out1Out);

    expect(store.getPortCycleEdgeIds(addPortRequest1Out.id)).toEqual([
      addEdgeRequest1Out1Out.id,
    ]);
  });

  it("should return port incoming edge ids as adjacent edge", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest2In = createAddPortRequest2In();
    const addEdgeRequest1Out2In = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest2In);
    store.addEdge(addEdgeRequest1Out2In);

    expect(store.getPortAdjacentEdgeIds(addPortRequest2In.id)).toEqual([
      addEdgeRequest1Out2In.id,
    ]);
  });

  it("should return port outgoing edge ids as adjacent edge", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest2In = createAddPortRequest2In();
    const addEdgeRequest1Out2In = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest2In);
    store.addEdge(addEdgeRequest1Out2In);

    expect(store.getPortAdjacentEdgeIds(addPortRequest1Out.id)).toEqual([
      addEdgeRequest1Out2In.id,
    ]);
  });

  it("should return port cycle edge ids as adjacent edge", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addEdgeRequest1Out1Out = createAddEdgeRequest1Out1Out();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addEdge(addEdgeRequest1Out1Out);

    expect(store.getPortAdjacentEdgeIds(addPortRequest1Out.id)).toEqual([
      addEdgeRequest1Out1Out.id,
    ]);
  });

  it("should return node incoming edge ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest2In = createAddPortRequest2In();
    const addEdgeRequest1Out2In = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest2In);
    store.addEdge(addEdgeRequest1Out2In);

    expect(store.getNodeIncomingEdgeIds(addNodeRequest2.id)).toEqual([
      addEdgeRequest1Out2In.id,
    ]);
  });

  it("should not include node cycle edges to node incoming edges", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest1In = createAddPortRequest1In();
    const addEdgeRequest1Out1In = createAddEdgeRequest1Out1In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addPort(addPortRequest1In);
    store.addEdge(addEdgeRequest1Out1In);

    expect(store.getNodeIncomingEdgeIds(addNodeRequest1.id)).toEqual([]);
  });

  it("should return node outgoing edge ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest2In = createAddPortRequest2In();
    const addEdgeRequest1Out2In = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest2In);
    store.addEdge(addEdgeRequest1Out2In);

    expect(store.getNodeOutgoingEdgeIds(addNodeRequest1.id)).toEqual([
      addEdgeRequest1Out2In.id,
    ]);
  });

  it("should not include node cycle edges to node outgoing edges", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest1In = createAddPortRequest1In();
    const addEdgeRequest1Out1In = createAddEdgeRequest1Out1In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addPort(addPortRequest1In);
    store.addEdge(addEdgeRequest1Out1In);

    expect(store.getNodeOutgoingEdgeIds(addNodeRequest1.id)).toEqual([]);
  });

  it("should include port cycle edge in node cycle edges", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addEdgeRequestOut1Out1 = createAddEdgeRequest1Out1Out();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addEdge(addEdgeRequestOut1Out1);

    expect(store.getNodeCycleEdgeIds(addNodeRequest1.id)).toEqual([
      addEdgeRequestOut1Out1.id,
    ]);
  });

  it("should include port incoming edge with the same source node in cycle edges", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest1In = createAddPortRequest1In();
    const addEdgeRequestOut1In1 = createAddEdgeRequest1Out1In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addPort(addPortRequest1In);
    store.addEdge(addEdgeRequestOut1In1);

    expect(store.getNodeCycleEdgeIds(addNodeRequest1.id)).toEqual([
      addEdgeRequestOut1In1.id,
    ]);
  });

  it("should not include incoming edges from different node to node cycle edges", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest2In = createAddPortRequest2In();
    const addEdgeRequest1Out2In = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1Out);
    store.addPort(addPortRequest2In);
    store.addEdge(addEdgeRequest1Out2In);

    expect(store.getNodeCycleEdgeIds(addNodeRequest1.id)).toEqual([]);
  });

  it("should return node incoming edge ids as adjacent edges", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest2In = createAddPortRequest2In();
    const addEdgeRequest1Out2In = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest2In);
    store.addEdge(addEdgeRequest1Out2In);

    expect(store.getNodeAdjacentEdgeIds(addNodeRequest2.id)).toEqual([
      addEdgeRequest1Out2In.id,
    ]);
  });

  it("should return node outgoing edge ids as adjacent edges", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest2In = createAddPortRequest2In();
    const addEdgeRequest1Out2In = createAddEdgeRequest1Out2In();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest2In);
    store.addEdge(addEdgeRequest1Out2In);

    expect(store.getNodeAdjacentEdgeIds(addNodeRequest1.id)).toEqual([
      addEdgeRequest1Out2In.id,
    ]);
  });

  it("should return node cycle edge ids as adjacent edges", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addEdgeRequest1Out1Out = createAddEdgeRequest1Out1Out();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.addEdge(addEdgeRequest1Out1Out);

    expect(store.getNodeAdjacentEdgeIds(addNodeRequest1.id)).toEqual([
      addEdgeRequest1Out1Out.id,
    ]);
  });

  it("should update edge from", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest2In = createAddPortRequest2In();
    const addEdgeRequest1Out1Out = createAddEdgeRequest1Out1Out();

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1Out);
    store.addPort(addPortRequest2In);
    store.addEdge(addEdgeRequest1Out1Out);

    store.updateEdge(addEdgeRequest1Out1Out.id, {
      from: addPortRequest2In.id,
      to: undefined,
      shape: undefined,
      priority: undefined,
    });

    expect(store.getPortAdjacentEdgeIds(addPortRequest2In.id)).toEqual([
      addEdgeRequest1Out1Out.id,
    ]);
  });

  it("should update edge to", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addNodeRequest2 = createAddNodeRequest2();
    const addPortRequest1Out = createAddPortRequest1Out();
    const addPortRequest2In = createAddPortRequest2In();
    const addEdgeRequest1Out1Out = createAddEdgeRequest1Out1Out();

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1Out);
    store.addPort(addPortRequest2In);
    store.addEdge(addEdgeRequest1Out1Out);

    store.updateEdge(addEdgeRequest1Out1Out.id, {
      from: undefined,
      to: addPortRequest2In.id,
      shape: undefined,
      priority: undefined,
    });

    expect(store.getPortAdjacentEdgeIds(addPortRequest2In.id)).toEqual([
      addEdgeRequest1Out1Out.id,
    ]);
  });

  it("should return element port ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1Out = {
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    };

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);

    expect(store.getElementPortIds(addPortRequest1Out.element)).toEqual([
      "port-1",
    ]);
  });

  it("should remove element port ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1Out = {
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    };

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.removePort(addPortRequest1Out.id);

    expect(store.getElementPortIds(addPortRequest1Out.element)).toEqual([]);
  });

  it("should clear element port ids", () => {
    const store = new GraphStore();

    const addNodeRequest1 = createAddNodeRequest1();
    const addPortRequest1Out = {
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    };

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest1Out);
    store.clear();

    expect(store.getElementPortIds(addPortRequest1Out.element)).toEqual([]);
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
