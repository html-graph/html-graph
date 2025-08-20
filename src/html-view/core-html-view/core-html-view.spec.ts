import {
  AddEdgeRequest,
  AddNodeRequest,
  AddPortRequest,
  GraphStore,
} from "@/graph-store";
import { CoreHtmlView } from "./core-html-view";
import { ViewportStore } from "@/viewport-store";
import { Point } from "@/point";
import { BezierEdgeShape, EdgeRenderParams } from "@/edges";
import { ConnectionCategory } from "@/edges/connection-category";

const createHtmlController = (params?: {
  transformer?: ViewportStore;
  store?: GraphStore;
  element?: HTMLElement;
}): CoreHtmlView => {
  return new CoreHtmlView(
    params?.store ?? new GraphStore(),
    params?.transformer ?? new ViewportStore(),
    params?.element ?? document.createElement("div"),
  );
};

const centerFn = (): Point => ({ x: 0, y: 0 });

const createAddNode1Request = (): AddNodeRequest => {
  return {
    id: "node-1",
    element: document.createElement("div"),
    x: 0,
    y: 0,
    centerFn,
    priority: 0,
  };
};

const createAddNode2Request = (): AddNodeRequest => {
  return {
    id: "node-2",
    element: document.createElement("div"),
    x: 100,
    y: 100,
    centerFn,
    priority: 0,
  };
};

const createAddPort11Request = (): AddPortRequest => {
  const addPortRequest: AddPortRequest = {
    id: "port-1",
    nodeId: "node-1",
    element: document.createElement("div"),
    direction: 0,
  };

  addPortRequest.element.getBoundingClientRect = (): DOMRect => {
    return new DOMRect(0, 0, 0, 0);
  };
  return addPortRequest;
};

const createAddPort21Request = (): AddPortRequest => {
  const addPortRequest: AddPortRequest = {
    id: "port-2",
    nodeId: "node-1",
    element: document.createElement("div"),
    direction: 0,
  };

  addPortRequest.element.getBoundingClientRect = (): DOMRect => {
    return new DOMRect(0, 0, 0, 0);
  };
  return addPortRequest;
};

const createAddPort22Request = (): AddPortRequest => {
  const addPortRequest: AddPortRequest = {
    id: "port-2",
    nodeId: "node-2",
    element: document.createElement("div"),
    direction: 0,
  };

  addPortRequest.element.getBoundingClientRect = (): DOMRect => {
    return new DOMRect(100, 100, 0, 0);
  };

  return addPortRequest;
};

const createAddEdgeRequest12 = (): AddEdgeRequest => {
  return {
    id: "edge-12",
    from: "port-1",
    to: "port-2",
    shape: new BezierEdgeShape(),
    priority: 0,
  };
};

const createAddEdgeRequest11 = (): AddEdgeRequest => {
  return {
    id: "edge-11",
    from: "port-1",
    to: "port-1",
    shape: new BezierEdgeShape(),
    priority: 0,
  };
};

describe("CoreHtmlView", () => {
  it("should attach host to wrapper element", () => {
    const element = document.createElement("div");
    createHtmlController({ element });

    expect(element.children.length).toBe(1);
  });

  it("should apply transform to container", () => {
    const transformer = new ViewportStore();
    const element = document.createElement("div");

    createHtmlController({ transformer, element });

    transformer.patchContentMatrix({
      scale: 2,
      x: 3,
      y: 4,
    });

    const container = element.children[0].children[0] as HTMLDivElement;

    expect(container.style.transform).toBe("matrix(2, 0, 0, 2, 3, 4)");
  });

  it("should attach node", () => {
    const store = new GraphStore();
    const element = document.createElement("div");
    const htmlView = createHtmlController({ store, element });

    const addNodeRequest1 = createAddNode1Request();

    store.addNode(addNodeRequest1);
    htmlView.attachNode(addNodeRequest1.id);

    const container = element.children[0].children[0];

    expect(container.children[0] instanceof HTMLDivElement).toBe(true);
  });

  it("should detach node", () => {
    const store = new GraphStore();
    const element = document.createElement("div");
    const htmlView = createHtmlController({ store, element });

    const addNodeRequest1 = createAddNode1Request();

    store.addNode(addNodeRequest1);
    htmlView.attachNode(addNodeRequest1.id);
    htmlView.detachNode(addNodeRequest1.id);

    const container = element.children[0].children[0];

    expect(container.children[0]).toBe(undefined);
  });

  it("should attach edge", () => {
    const store: GraphStore = new GraphStore();
    const element = document.createElement("div");
    const htmlView = createHtmlController({ store, element });

    const addNodeRequest1 = createAddNode1Request();
    const addNodeRequest2 = createAddNode2Request();
    const addPortRequest1 = createAddPort11Request();
    const addPortRequest2 = createAddPort22Request();
    const addEdgeRequest12 = createAddEdgeRequest12();

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    htmlView.attachNode(addNodeRequest1.id);
    htmlView.attachNode(addNodeRequest2.id);
    htmlView.attachEdge(addEdgeRequest12.id);

    const container = element.children[0].children[0];

    expect(container.children[2]).toBe(addEdgeRequest12.shape.svg);
  });

  it("should detach edge", () => {
    const store: GraphStore = new GraphStore();
    const element = document.createElement("div");
    const htmlView = createHtmlController({ store, element });

    const addNodeRequest1 = createAddNode1Request();
    const addNodeRequest2 = createAddNode2Request();
    const addPortRequest1 = createAddPort11Request();
    const addPortRequest2 = createAddPort22Request();
    const addEdgeRequest12 = createAddEdgeRequest12();

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    htmlView.attachNode(addNodeRequest1.id);
    htmlView.attachNode(addNodeRequest2.id);
    htmlView.attachEdge(addEdgeRequest12.id);
    htmlView.detachEdge(addEdgeRequest12.id);

    const container = element.children[0].children[0];

    expect(container.children[2]).toBe(undefined);
  });

  it("should clear nodes and edges", () => {
    const store: GraphStore = new GraphStore();
    const element = document.createElement("div");
    const htmlView = createHtmlController({ store, element });

    const addNodeRequest1 = createAddNode1Request();
    const addNodeRequest2 = createAddNode2Request();
    const addPortRequest1 = createAddPort11Request();
    const addPortRequest2 = createAddPort22Request();
    const addEdgeRequest12 = createAddEdgeRequest12();

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    htmlView.attachNode(addNodeRequest1.id);
    htmlView.attachNode(addNodeRequest2.id);
    htmlView.attachEdge(addEdgeRequest12.id);
    htmlView.clear();

    const container = element.children[0].children[0];

    expect(container.children.length).toBe(0);
  });

  it("should remove child elements on destroy", () => {
    const element = document.createElement("div");
    const htmlView = createHtmlController({ element });

    htmlView.destroy();

    expect(element.children.length).toBe(0);
  });

  it("should update node coordinates", () => {
    const store = new GraphStore();
    const element = document.createElement("div");
    const htmlView = createHtmlController({ store, element });

    const addNodeRequest1 = createAddNode1Request();

    store.addNode(addNodeRequest1);
    htmlView.attachNode(addNodeRequest1.id);

    const node = store.getNode(addNodeRequest1.id)!;
    node.payload.x = 100;
    node.payload.y = 100;

    htmlView.updateNodePosition(addNodeRequest1.id);

    const container = element.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLDivElement;

    expect(nodeWrapper.style.transform).toBe("translate(100px, 100px)");
  });

  it("should update node priority", () => {
    const store = new GraphStore();
    const element = document.createElement("div");
    const htmlView = createHtmlController({ store, element });

    const addNodeRequest1 = createAddNode1Request();

    store.addNode(addNodeRequest1);
    htmlView.attachNode(addNodeRequest1.id);

    const container = element.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLDivElement;

    const node = store.getNode(addNodeRequest1.id)!;
    node.payload.priority = 10;
    htmlView.updateNodePriority(addNodeRequest1.id);

    expect(nodeWrapper.style.zIndex).toBe("10");
  });

  it("should update edge shape", () => {
    const store: GraphStore = new GraphStore();
    const element = document.createElement("div");
    const htmlView = createHtmlController({ store, element });

    const addNodeRequest1 = createAddNode1Request();
    const addNodeRequest2 = createAddNode2Request();
    const addPortRequest1 = createAddPort11Request();
    const addPortRequest2 = createAddPort22Request();
    const addEdgeRequest12 = createAddEdgeRequest12();

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    htmlView.attachNode(addNodeRequest1.id);
    htmlView.attachNode(addNodeRequest2.id);
    htmlView.attachEdge(addEdgeRequest12.id);

    const edge = store.getEdge(addEdgeRequest12.id)!;

    const newShape = new BezierEdgeShape();
    edge.payload.shape = newShape;

    htmlView.updateEdgeShape(addEdgeRequest12.id);

    const container = element.children[0].children[0];

    expect(container.children[2]).toBe(newShape.svg);
  });

  it("should update edge coordinates for line category", () => {
    const store: GraphStore = new GraphStore();
    const htmlView = createHtmlController({ store });

    const addNodeRequest1 = createAddNode1Request();
    const addNodeRequest2 = createAddNode2Request();
    const addPortRequest1 = createAddPort11Request();
    const addPortRequest2 = createAddPort22Request();
    const addEdgeRequest12 = createAddEdgeRequest12();

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    htmlView.attachNode(addNodeRequest1.id);
    htmlView.attachNode(addNodeRequest2.id);
    htmlView.attachEdge(addEdgeRequest12.id);

    const spy = jest.spyOn(addEdgeRequest12.shape, "render");

    htmlView.renderEdge(addEdgeRequest12.id);

    const expected: EdgeRenderParams = {
      from: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        direction: 0,
      },
      category: ConnectionCategory.Line,
    };

    expect(spy).toHaveBeenCalledWith(expected);
  });

  it("should update edge coordinates for node cycle category", () => {
    const store: GraphStore = new GraphStore();
    const htmlView = createHtmlController({ store });

    const addNodeRequest1 = createAddNode1Request();
    const addPortRequest11 = createAddPort11Request();
    const addPortRequest21 = createAddPort21Request();
    const addEdgeRequest12 = createAddEdgeRequest12();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest11);
    store.addPort(addPortRequest21);
    store.addEdge(addEdgeRequest12);

    htmlView.attachNode(addNodeRequest1.id);
    htmlView.attachEdge(addEdgeRequest12.id);

    const spy = jest.spyOn(addEdgeRequest12.shape, "render");

    htmlView.renderEdge(addEdgeRequest12.id);

    const expected: EdgeRenderParams = {
      from: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
      },
      to: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
      },
      category: ConnectionCategory.NodeCycle,
    };

    expect(spy).toHaveBeenCalledWith(expected);
  });

  it("should update edge coordinates for port cycle category", () => {
    const store: GraphStore = new GraphStore();
    const htmlView = createHtmlController({ store });

    const addNodeRequest1 = createAddNode1Request();
    const addPortRequest11 = createAddPort11Request();
    const addEdgeRequest11 = createAddEdgeRequest11();

    store.addNode(addNodeRequest1);
    store.addPort(addPortRequest11);
    store.addEdge(addEdgeRequest11);

    htmlView.attachNode(addNodeRequest1.id);
    htmlView.attachEdge(addEdgeRequest11.id);

    const spy = jest.spyOn(addEdgeRequest11.shape, "render");

    htmlView.renderEdge(addEdgeRequest11.id);

    const expected: EdgeRenderParams = {
      from: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
      },
      to: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
      },
      category: ConnectionCategory.PortCycle,
    };

    expect(spy).toHaveBeenCalledWith(expected);
  });

  it("should update edge priority", () => {
    const store: GraphStore = new GraphStore();
    const element = document.createElement("div");
    const htmlView = createHtmlController({ store, element });

    const addNodeRequest1 = createAddNode1Request();
    const addNodeRequest2 = createAddNode2Request();
    const addPortRequest1 = createAddPort11Request();
    const addPortRequest2 = createAddPort22Request();
    const addEdgeRequest12 = createAddEdgeRequest12();

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    htmlView.attachNode(addNodeRequest1.id);
    htmlView.attachNode(addNodeRequest2.id);
    htmlView.attachEdge(addEdgeRequest12.id);

    const edge = store.getEdge(addEdgeRequest12.id)!;
    edge.payload.priority = 10;
    htmlView.updateEdgePriority(addEdgeRequest12.id);

    const container = element.children[0].children[0];
    const edgeSvg = container.children[2] as SVGSVGElement;

    expect(edgeSvg.style.zIndex).toBe("10");
  });
});
