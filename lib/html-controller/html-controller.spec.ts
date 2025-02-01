import {
  AddEdgeRequest,
  AddNodeRequest,
  AddPortRequest,
  GraphStore,
} from "@/graph-store";
import { HtmlController } from "./html-controller";
import { ViewportTransformer } from "@/viewport-transformer";
import { Point } from "@/point";
import { EdgeShapeMock } from "@/edges";

const createHtmlController = (params?: {
  transformer?: ViewportTransformer;
  store?: GraphStore;
}): HtmlController => {
  return new HtmlController(
    params?.store ?? new GraphStore(),
    params?.transformer ?? new ViewportTransformer(),
  );
};

const centerFn = (): Point => ({ x: 0, y: 0 });

const addNodeRequest1: AddNodeRequest = {
  nodeId: "node-1",
  element: document.createElement("div"),
  x: 0,
  y: 0,
  centerFn,
  priority: 0,
};

const addNodeRequest2: AddNodeRequest = {
  nodeId: "node-2",
  element: document.createElement("div"),
  x: 100,
  y: 100,
  centerFn,
  priority: 0,
};

const addPortRequest1: AddPortRequest = {
  portId: "port-1",
  nodeId: "node-1",
  element: document.createElement("div"),
  centerFn,
  direction: 0,
};

addPortRequest1.element.getBoundingClientRect = (): DOMRect => {
  return new DOMRect(0, 0, 0, 0);
};

const addPortRequest2: AddPortRequest = {
  portId: "port-2",
  nodeId: "node-2",
  element: document.createElement("div"),
  centerFn,
  direction: 0,
};

addPortRequest2.element.getBoundingClientRect = (): DOMRect => {
  return new DOMRect(100, 100, 0, 0);
};

const addEdgeRequest12: AddEdgeRequest = {
  edgeId: "edge-12",
  from: "port-1",
  to: "port-2",
  shape: new EdgeShapeMock(),
  priority: 0,
};

const addEdgeRequest21: AddEdgeRequest = {
  edgeId: "edge-21",
  from: "port-2",
  to: "port-1",
  shape: new EdgeShapeMock(),
  priority: 0,
};

describe("HtmlController", () => {
  it("should attach host to wrapper element", () => {
    const htmlController = createHtmlController();

    const div = document.createElement("div");
    htmlController.attach(div);

    expect(div.children.length).toBe(1);
  });

  it("should detach host to wrapper element", () => {
    const htmlController = createHtmlController();

    const div = document.createElement("div");
    htmlController.attach(div);
    htmlController.detach();

    expect(div.children.length).toBe(0);
  });

  it("should detach before attaching", () => {
    const htmlController = createHtmlController();

    const spy = jest.spyOn(htmlController, "detach");

    const div = document.createElement("div");
    htmlController.attach(div);

    expect(spy).toHaveBeenCalled();
  });

  it("should apply transform to container", () => {
    const transformer = new ViewportTransformer();

    transformer.patchContentMatrix({
      scale: 2,
      dx: 3,
      dy: 4,
    });

    const htmlController = createHtmlController({ transformer });
    const div = document.createElement("div");
    htmlController.attach(div);

    htmlController.applyTransform();

    const container = div.children[0].children[0] as HTMLDivElement;

    expect(container.style.transform).toBe("matrix(2, 0, 0, 2, 3, 4)");
  });

  it("should attach node", () => {
    const store = new GraphStore();
    const htmlController = createHtmlController({ store });
    const div = document.createElement("div");
    htmlController.attach(div);

    store.addNode(addNodeRequest1);
    htmlController.attachNode(addNodeRequest1.nodeId);

    const container = div.children[0].children[0];

    expect(container.children[0] instanceof HTMLDivElement).toBe(true);
  });

  it("should detach node", () => {
    const store = new GraphStore();
    const htmlController = createHtmlController({ store });

    const div = document.createElement("div");
    htmlController.attach(div);

    store.addNode(addNodeRequest1);
    htmlController.attachNode(addNodeRequest1.nodeId);
    htmlController.detachNode(addNodeRequest1.nodeId);

    const container = div.children[0].children[0];

    expect(container.children[0]).toBe(undefined);
  });

  it("should attach edge", () => {
    const store: GraphStore = new GraphStore();
    const htmlController = createHtmlController({ store });
    const div = document.createElement("div");
    htmlController.attach(div);

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    htmlController.attachNode(addNodeRequest1.nodeId);
    htmlController.attachNode(addNodeRequest2.nodeId);
    htmlController.attachEdge(addEdgeRequest12.edgeId);

    const container = div.children[0].children[0];

    expect(container.children[2]).toBe(addEdgeRequest12.shape.svg);
  });

  it("should detach edge", () => {
    const store: GraphStore = new GraphStore();
    const htmlController = createHtmlController({ store });
    const div = document.createElement("div");
    htmlController.attach(div);

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    htmlController.attachNode(addNodeRequest1.nodeId);
    htmlController.attachNode(addNodeRequest2.nodeId);
    htmlController.attachEdge(addEdgeRequest12.edgeId);
    htmlController.detachEdge(addEdgeRequest12.edgeId);

    const container = div.children[0].children[0];

    expect(container.children[2]).toBe(undefined);
  });

  it("should clear nodes and edges", () => {
    const store: GraphStore = new GraphStore();
    const htmlController = createHtmlController({ store });
    const div = document.createElement("div");
    htmlController.attach(div);

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    htmlController.attachNode(addNodeRequest1.nodeId);
    htmlController.attachNode(addNodeRequest2.nodeId);
    htmlController.attachEdge(addEdgeRequest12.edgeId);
    htmlController.clear();

    const container = div.children[0].children[0];

    expect(container.children.length).toBe(0);
  });

  it("should remove subelements on destroy", () => {
    const htmlController = createHtmlController();

    const div = document.createElement("div");
    htmlController.attach(div);
    htmlController.destroy();

    expect(div.children.length).toBe(0);
  });

  it("should clear on destroy", () => {
    const htmlController = createHtmlController();

    const spy = jest.spyOn(htmlController, "clear");

    htmlController.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should detach on destroy", () => {
    const htmlController = createHtmlController();

    const spy = jest.spyOn(htmlController, "detach");

    htmlController.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should update node coordinates", () => {
    const store = new GraphStore();
    const htmlController = createHtmlController({ store });
    const div = document.createElement("div");
    htmlController.attach(div);

    store.addNode(addNodeRequest1);
    htmlController.attachNode(addNodeRequest1.nodeId);

    const node = store.getNode(addNodeRequest1.nodeId)!;
    node.x = 100;
    node.y = 100;

    htmlController.updateNodeCoordinates(addNodeRequest1.nodeId);

    const container = div.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLDivElement;

    expect(nodeWrapper.style.transform).toBe("translate(100px, 100px)");
  });

  it("should update node priority", () => {
    const store = new GraphStore();
    const htmlController = createHtmlController({ store });
    const div = document.createElement("div");
    htmlController.attach(div);

    store.addNode(addNodeRequest1);
    htmlController.attachNode(addNodeRequest1.nodeId);

    const container = div.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLDivElement;

    const node = store.getNode(addNodeRequest1.nodeId)!;
    node.priority = 10;
    htmlController.updateNodePriority(addNodeRequest1.nodeId);

    expect(nodeWrapper.style.zIndex).toBe("10");
  });

  it("should update edge shape", () => {
    const store: GraphStore = new GraphStore();
    const htmlController = createHtmlController({ store });
    const div = document.createElement("div");
    htmlController.attach(div);

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    htmlController.attachNode(addNodeRequest1.nodeId);
    htmlController.attachNode(addNodeRequest2.nodeId);
    htmlController.attachEdge(addEdgeRequest12.edgeId);

    const edge = store.getEdge(addEdgeRequest12.edgeId)!;

    const newShape = new EdgeShapeMock();
    edge.shape = newShape;

    htmlController.updateEdgeShape(addEdgeRequest12.edgeId);

    const container = div.children[0].children[0];

    expect(container.children[2]).toBe(newShape.svg);
  });

  it("should update edge coordinates", () => {
    const store: GraphStore = new GraphStore();
    const htmlController = createHtmlController({ store });
    const div = document.createElement("div");
    htmlController.attach(div);

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    htmlController.attachNode(addNodeRequest1.nodeId);
    htmlController.attachNode(addNodeRequest2.nodeId);
    htmlController.attachEdge(addEdgeRequest12.edgeId);

    const spy = jest.spyOn(addEdgeRequest12.shape, "update");

    htmlController.updateEdge(addEdgeRequest12.edgeId);

    expect(spy).toHaveBeenCalledWith(
      { x: 100, y: 100 },
      1,
      1,
      addPortRequest1.direction,
      addPortRequest2.direction,
    );
  });

  it("should update edge priority", () => {
    const store: GraphStore = new GraphStore();
    const htmlController = createHtmlController({ store });
    const div = document.createElement("div");
    htmlController.attach(div);

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    htmlController.attachNode(addNodeRequest1.nodeId);
    htmlController.attachNode(addNodeRequest2.nodeId);
    htmlController.attachEdge(addEdgeRequest12.edgeId);

    const edge = store.getEdge(addEdgeRequest12.edgeId)!;
    edge.priority = 10;
    htmlController.updateEdgePriority(addEdgeRequest12.edgeId);

    const container = div.children[0].children[0];
    const edgeSvg = container.children[2] as SVGSVGElement;

    expect(edgeSvg.style.zIndex).toBe("10");
  });

  it("should flip edge", () => {
    const store: GraphStore = new GraphStore();
    const htmlController = createHtmlController({ store });
    const div = document.createElement("div");
    htmlController.attach(div);

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest21);

    htmlController.attachNode(addNodeRequest1.nodeId);
    htmlController.attachNode(addNodeRequest2.nodeId);
    htmlController.attachEdge(addEdgeRequest21.edgeId);

    const spy = jest.spyOn(addEdgeRequest21.shape, "update");

    htmlController.updateEdge(addEdgeRequest21.edgeId);

    expect(spy).toHaveBeenCalledWith(
      { x: 100, y: 100 },
      -1,
      -1,
      addPortRequest2.direction,
      addPortRequest1.direction,
    );
  });
});
