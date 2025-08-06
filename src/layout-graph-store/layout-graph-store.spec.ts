import {
  AddEdgeRequest,
  AddNodeRequest,
  AddPortRequest,
  GenericGraphStore,
  GenericStoreEdge,
  GenericStoreNode,
  GenericStorePort,
  UpdateEdgeRequest,
  UpdateNodeRequest,
} from "@/generic-graph-store";
import { LayoutGraphStore } from "./layout-graph-store";
import { standardCenterFn } from "@/center-fn";
import { UpdatePortRequest } from "@/canvas";
import { BezierEdgeShape } from "@/edges";
import { LayoutError } from "./layout-error";

const createLayoutGraphStore = (): {
  store: GenericGraphStore<number>;
  layoutStore: LayoutGraphStore;
} => {
  const store = new GenericGraphStore<number>();
  const layoutStore = new LayoutGraphStore(store);

  return { store, layoutStore };
};

describe("layoutGraphStore", () => {
  it("should add new node to layout graph", () => {
    const { layoutStore } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: undefined,
      y: undefined,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);

    const expected: GenericStoreNode<number | undefined> = {
      element: addNodeRequest.element,
      payload: {
        x: addNodeRequest.x,
        y: addNodeRequest.y,
        priority: addNodeRequest.priority,
        centerFn: addNodeRequest.centerFn,
      },
      ports: new Map(),
    };

    expect(layoutStore.getNode("node-1")).toEqual(expected);
  });

  it("should update existing node in layout graph", () => {
    const { layoutStore } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: undefined,
      y: undefined,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);

    const updateNodeRequest: UpdateNodeRequest<number> = {
      x: 10,
    };

    layoutStore.updateNode("node-1", updateNodeRequest);

    const expected: GenericStoreNode<number | undefined> = {
      element: addNodeRequest.element,
      payload: {
        x: updateNodeRequest.x,
        y: addNodeRequest.y,
        priority: addNodeRequest.priority,
        centerFn: addNodeRequest.centerFn,
      },
      ports: new Map(),
    };

    expect(layoutStore.getNode("node-1")).toEqual(expected);
  });

  it("should remove existing node from layout graph", () => {
    const { layoutStore } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: undefined,
      y: undefined,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);
    layoutStore.removeNode("node-1");

    expect(layoutStore.getNode("node-1")).toBe(undefined);
  });

  it("should add new port to layout graph", () => {
    const { layoutStore } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: undefined,
      y: undefined,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);

    const addPortRequest: AddPortRequest = {
      id: "port-1",
      element: document.createElement("div"),
      nodeId: "node-1",
      direction: 0,
    };

    layoutStore.addPort(addPortRequest);

    const expected: GenericStorePort = {
      element: addPortRequest.element,
      nodeId: addPortRequest.nodeId,
      payload: {
        direction: addPortRequest.direction,
      },
    };

    expect(layoutStore.getPort("port-1")).toEqual(expected);
  });

  it("should update existing port in layout graph", () => {
    const { layoutStore } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: undefined,
      y: undefined,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);

    const addPortRequest: AddPortRequest = {
      id: "port-1",
      element: document.createElement("div"),
      nodeId: "node-1",
      direction: 0,
    };

    layoutStore.addPort(addPortRequest);

    const updatePortRequest: UpdatePortRequest = {
      direction: Math.PI,
    };

    layoutStore.updatePort("port-1", updatePortRequest);

    const expected: GenericStorePort = {
      element: addPortRequest.element,
      nodeId: addPortRequest.nodeId,
      payload: {
        direction: updatePortRequest.direction!,
      },
    };

    expect(layoutStore.getPort("port-1")).toEqual(expected);
  });

  it("should remove existing port from layout graph", () => {
    const { layoutStore } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: undefined,
      y: undefined,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);

    const addPortRequest: AddPortRequest = {
      id: "port-1",
      element: document.createElement("div"),
      nodeId: "node-1",
      direction: 0,
    };

    layoutStore.addPort(addPortRequest);

    layoutStore.removePort("port-1");

    expect(layoutStore.getPort("port-1")).toEqual(undefined);
  });

  it("should add new edge to layout graph", () => {
    const { layoutStore } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: undefined,
      y: undefined,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);

    const addPortRequest: AddPortRequest = {
      id: "port-1",
      element: document.createElement("div"),
      nodeId: "node-1",
      direction: 0,
    };

    layoutStore.addPort(addPortRequest);

    const addEdgeRequest: AddEdgeRequest = {
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new BezierEdgeShape(),
      priority: 0,
    };

    layoutStore.addEdge(addEdgeRequest);

    const expected: GenericStoreEdge = {
      from: addEdgeRequest.from,
      to: addEdgeRequest.to,
      payload: {
        shape: addEdgeRequest.shape,
        priority: addEdgeRequest.priority,
      },
    };

    expect(layoutStore.getEdge("edge-1")).toEqual(expected);
  });

  it("should update existing edge in layout graph", () => {
    const { layoutStore } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: undefined,
      y: undefined,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);

    const addPortRequest: AddPortRequest = {
      id: "port-1",
      element: document.createElement("div"),
      nodeId: "node-1",
      direction: 0,
    };

    layoutStore.addPort(addPortRequest);

    const addEdgeRequest: AddEdgeRequest = {
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new BezierEdgeShape(),
      priority: 0,
    };

    layoutStore.addEdge(addEdgeRequest);

    const updateEdgeRequest: UpdateEdgeRequest = {
      priority: 10,
    };

    layoutStore.updateEdge("edge-1", updateEdgeRequest);

    const expected: GenericStoreEdge = {
      from: addEdgeRequest.from,
      to: addEdgeRequest.to,
      payload: {
        shape: addEdgeRequest.shape,
        priority: updateEdgeRequest.priority!,
      },
    };

    expect(layoutStore.getEdge("edge-1")).toEqual(expected);
  });

  it("should remove existing edge from layout graph", () => {
    const { layoutStore } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: undefined,
      y: undefined,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);

    const addPortRequest: AddPortRequest = {
      id: "port-1",
      element: document.createElement("div"),
      nodeId: "node-1",
      direction: 0,
    };

    layoutStore.addPort(addPortRequest);

    const addEdgeRequest: AddEdgeRequest = {
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new BezierEdgeShape(),
      priority: 0,
    };

    layoutStore.addEdge(addEdgeRequest);

    layoutStore.removeEdge("edge-1");

    expect(layoutStore.getEdge("edge-1")).toEqual(undefined);
  });

  it("should clear layout graph", () => {
    const { layoutStore } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: undefined,
      y: undefined,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);

    layoutStore.clear();

    expect(layoutStore.getNode("node-1")).toEqual(undefined);
  });

  it("should remove adjacent port hen removing related node", () => {
    const { layoutStore } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: undefined,
      y: undefined,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);

    const addPortRequest: AddPortRequest = {
      id: "port-1",
      element: document.createElement("div"),
      nodeId: "node-1",
      direction: 0,
    };

    layoutStore.addPort(addPortRequest);

    layoutStore.removeNode("node-1");

    expect(layoutStore.getPort("port-1")).toEqual(undefined);
  });

  it("should remove adjacent edge when removing port", () => {
    const { layoutStore } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: undefined,
      y: undefined,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);

    const addPortRequest: AddPortRequest = {
      id: "port-1",
      element: document.createElement("div"),
      nodeId: "node-1",
      direction: 0,
    };

    layoutStore.addPort(addPortRequest);

    const addEdgeRequest: AddEdgeRequest = {
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new BezierEdgeShape(),
      priority: 0,
    };

    layoutStore.addEdge(addEdgeRequest);

    layoutStore.removePort("port-1");

    expect(layoutStore.getEdge("edge-1")).toEqual(undefined);
  });

  it("should add new node to model after apply", () => {
    const { layoutStore, store } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);
    layoutStore.apply();

    const expected: GenericStoreNode<number | undefined> = {
      element: addNodeRequest.element,
      payload: {
        x: addNodeRequest.x,
        y: addNodeRequest.y,
        priority: addNodeRequest.priority,
        centerFn: addNodeRequest.centerFn,
      },
      ports: new Map(),
    };

    expect(store.getNode("node-1")).toEqual(expected);
  });

  it("should throw error when trying to add new node without x coordinate", () => {
    const { layoutStore } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: undefined,
      y: 0,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);

    expect(() => {
      layoutStore.apply();
    }).toThrow(LayoutError);
  });

  it("should throw error when trying to add new node without y coordinate", () => {
    const { layoutStore } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: undefined,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);

    expect(() => {
      layoutStore.apply();
    }).toThrow(LayoutError);
  });

  it("should update node in model after apply", () => {
    const { layoutStore, store } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);

    const updateNodeRequest: UpdateNodeRequest<number> = {
      x: 10,
      y: 10,
    };

    layoutStore.updateNode("node-1", updateNodeRequest);
    layoutStore.apply();

    const expected: GenericStoreNode<number | undefined> = {
      element: addNodeRequest.element,
      payload: {
        x: updateNodeRequest.x,
        y: updateNodeRequest.y,
        priority: addNodeRequest.priority,
        centerFn: addNodeRequest.centerFn,
      },
      ports: new Map(),
    };

    expect(store.getNode("node-1")).toEqual(expected);
  });

  it("should not throw error when coordinates of node specified later", () => {
    const { layoutStore } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: undefined,
      y: undefined,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);
    layoutStore.updateNode("node-1", { x: 0, y: 0 });

    expect(() => {
      layoutStore.apply();
    }).not.toThrow(LayoutError);
  });

  it("should remove node from model after apply", () => {
    const { layoutStore, store } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);
    layoutStore.removeNode("node-1");
    layoutStore.apply();

    expect(store.getNode("node-1")).toEqual(undefined);
  });

  it("should add new port to model after apply", () => {
    const { layoutStore, store } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);

    const addPortRequest: AddPortRequest = {
      id: "port-1",
      element: document.createElement("div"),
      nodeId: "node-1",
      direction: 0,
    };

    layoutStore.addPort(addPortRequest);
    layoutStore.apply();

    const expected: GenericStorePort = {
      element: addPortRequest.element,
      nodeId: addPortRequest.nodeId,
      payload: {
        direction: addPortRequest.direction,
      },
    };

    expect(store.getPort("port-1")).toEqual(expected);
  });

  it("should update model port after apply", () => {
    const { layoutStore, store } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);

    const addPortRequest: AddPortRequest = {
      id: "port-1",
      element: document.createElement("div"),
      nodeId: "node-1",
      direction: 0,
    };

    layoutStore.addPort(addPortRequest);

    const updatePortRequest: UpdatePortRequest = {
      direction: Math.PI,
    };

    layoutStore.updatePort("port-1", updatePortRequest);

    layoutStore.apply();

    const expected: GenericStorePort = {
      element: addPortRequest.element,
      nodeId: addPortRequest.nodeId,
      payload: {
        direction: updatePortRequest.direction!,
      },
    };

    expect(store.getPort("port-1")).toEqual(expected);
  });

  it("should remove port from model after apply", () => {
    const { layoutStore, store } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);

    const addPortRequest: AddPortRequest = {
      id: "port-1",
      element: document.createElement("div"),
      nodeId: "node-1",
      direction: 0,
    };

    layoutStore.addPort(addPortRequest);
    layoutStore.removePort("port-1");
    layoutStore.apply();

    expect(store.getPort("port-1")).toEqual(undefined);
  });

  it("should add new edge to model after apply", () => {
    const { layoutStore, store } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);

    const addPortRequest: AddPortRequest = {
      id: "port-1",
      element: document.createElement("div"),
      nodeId: "node-1",
      direction: 0,
    };

    layoutStore.addPort(addPortRequest);

    const addEdgeRequest: AddEdgeRequest = {
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new BezierEdgeShape(),
      priority: 0,
    };

    layoutStore.addEdge(addEdgeRequest);

    const expected: GenericStoreEdge = {
      from: addEdgeRequest.from,
      to: addEdgeRequest.to,
      payload: {
        shape: addEdgeRequest.shape,
        priority: addEdgeRequest.priority,
      },
    };

    layoutStore.apply();

    expect(store.getEdge("edge-1")).toEqual(expected);
  });

  it("should update model edge after apply", () => {
    const { layoutStore, store } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);

    const addPortRequest: AddPortRequest = {
      id: "port-1",
      element: document.createElement("div"),
      nodeId: "node-1",
      direction: 0,
    };

    layoutStore.addPort(addPortRequest);

    const addEdgeRequest: AddEdgeRequest = {
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new BezierEdgeShape(),
      priority: 0,
    };

    layoutStore.addEdge(addEdgeRequest);

    const updateEdgeRequest: UpdateEdgeRequest = {
      priority: 10,
    };

    layoutStore.updateEdge("edge-1", updateEdgeRequest);
    layoutStore.apply();

    const expected: GenericStoreEdge = {
      from: addEdgeRequest.from,
      to: addEdgeRequest.to,
      payload: {
        shape: addEdgeRequest.shape,
        priority: updateEdgeRequest.priority!,
      },
    };

    expect(store.getEdge("edge-1")).toEqual(expected);
  });

  it("should remove edge from model after apply", () => {
    const { layoutStore, store } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);

    const addPortRequest: AddPortRequest = {
      id: "port-1",
      element: document.createElement("div"),
      nodeId: "node-1",
      direction: 0,
    };

    layoutStore.addPort(addPortRequest);

    const addEdgeRequest: AddEdgeRequest = {
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new BezierEdgeShape(),
      priority: 0,
    };

    layoutStore.addEdge(addEdgeRequest);

    layoutStore.removeEdge("edge-1");
    layoutStore.apply();

    expect(store.getEdge("edge-1")).toEqual(undefined);
  });

  it("should clear model after apply", () => {
    const { layoutStore, store } = createLayoutGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      priority: 0,
      centerFn: standardCenterFn,
    };

    layoutStore.addNode(addNodeRequest);

    layoutStore.clear();
    layoutStore.apply();

    expect(store.getNode("node-1")).toEqual(undefined);
  });
});
