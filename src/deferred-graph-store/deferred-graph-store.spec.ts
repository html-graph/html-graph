import {
  AddNodeRequest,
  GraphStore,
  StoreNode,
  UpdateNodeRequest,
} from "@/graph-store";
import { DeferredGraphStore } from "./deferred-graph-store";
import { standardCenterFn } from "@/center-fn";

const createDeferredGraphStore = (): DeferredGraphStore => {
  const store = new GraphStore<number>();

  return new DeferredGraphStore(store);
};

describe("DeferredGraphStore", () => {
  it("should add new node to deferred graph", () => {
    const deferredStore = createDeferredGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: undefined,
      y: undefined,
      priority: 0,
      centerFn: standardCenterFn,
    };

    deferredStore.addNode(addNodeRequest);

    const expected: StoreNode<number | undefined> = {
      element: addNodeRequest.element,
      payload: {
        x: addNodeRequest.x,
        y: addNodeRequest.y,
        priority: addNodeRequest.priority,
        centerFn: addNodeRequest.centerFn,
      },
      ports: new Map(),
    };

    expect(deferredStore.getNode("node-1")).toEqual(expected);
  });

  it("should update existing node in deferred graph", () => {
    const deferredStore = createDeferredGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: undefined,
      y: undefined,
      priority: 0,
      centerFn: standardCenterFn,
    };

    deferredStore.addNode(addNodeRequest);

    const updateNodeRequest: UpdateNodeRequest<number> = {
      x: 10,
    };

    deferredStore.updateNode("node-1", updateNodeRequest);

    const expected: StoreNode<number | undefined> = {
      element: addNodeRequest.element,
      payload: {
        x: updateNodeRequest.x,
        y: addNodeRequest.y,
        priority: addNodeRequest.priority,
        centerFn: addNodeRequest.centerFn,
      },
      ports: new Map(),
    };

    expect(deferredStore.getNode("node-1")).toEqual(expected);
  });

  it("should remove existing node from deferred graph", () => {
    const deferredStore = createDeferredGraphStore();

    const addNodeRequest: AddNodeRequest<number | undefined> = {
      id: "node-1",
      element: document.createElement("div"),
      x: undefined,
      y: undefined,
      priority: 0,
      centerFn: standardCenterFn,
    };

    deferredStore.addNode(addNodeRequest);
    deferredStore.removeNode("node-1");

    expect(deferredStore.getNode("node-1")).toBe(undefined);
  });
});
