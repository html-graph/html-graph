import {
  AddEdgeRequest,
  AddNodeRequest,
  AddPortRequest,
  GraphStore,
} from "@/graph-store";
import { CoreHtmlView } from "./core-html-view";
import { ViewportTransformer } from "@/viewport-transformer";
import { Point } from "@/point";
import { EdgeShapeMock, EdgeRenderParams } from "@/edges";

const createHtmlController = (params?: {
  transformer?: ViewportTransformer;
  store?: GraphStore;
}): CoreHtmlView => {
  return new CoreHtmlView(
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
  direction: 0,
};

addPortRequest1.element.getBoundingClientRect = (): DOMRect => {
  return new DOMRect(0, 0, 0, 0);
};

const addPortRequest2: AddPortRequest = {
  portId: "port-2",
  nodeId: "node-2",
  element: document.createElement("div"),
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

describe("CoreHtmlView", () => {
  it("should attach host to wrapper element", () => {
    const htmlView = createHtmlController();

    const div = document.createElement("div");
    htmlView.attach(div);

    expect(div.children.length).toBe(1);
  });

  it("should detach host to wrapper element", () => {
    const htmlView = createHtmlController();

    const div = document.createElement("div");
    htmlView.attach(div);
    htmlView.detach();

    expect(div.children.length).toBe(0);
  });

  it("should detach before attaching", () => {
    const htmlView = createHtmlController();

    const spy = jest.spyOn(htmlView, "detach");

    const div = document.createElement("div");
    htmlView.attach(div);

    expect(spy).toHaveBeenCalled();
  });

  it("should apply transform to container", () => {
    const transformer = new ViewportTransformer();

    const htmlView = createHtmlController({ transformer });
    const div = document.createElement("div");

    transformer.patchContentMatrix({
      scale: 2,
      x: 3,
      y: 4,
    });

    htmlView.attach(div);

    const container = div.children[0].children[0] as HTMLDivElement;

    expect(container.style.transform).toBe("matrix(2, 0, 0, 2, 3, 4)");
  });

  it("should attach node", () => {
    const store = new GraphStore();
    const htmlView = createHtmlController({ store });
    const div = document.createElement("div");
    htmlView.attach(div);

    store.addNode(addNodeRequest1);
    htmlView.attachNode(addNodeRequest1.nodeId);

    const container = div.children[0].children[0];

    expect(container.children[0] instanceof HTMLDivElement).toBe(true);
  });

  it("should detach node", () => {
    const store = new GraphStore();
    const htmlView = createHtmlController({ store });

    const div = document.createElement("div");
    htmlView.attach(div);

    store.addNode(addNodeRequest1);
    htmlView.attachNode(addNodeRequest1.nodeId);
    htmlView.detachNode(addNodeRequest1.nodeId);

    const container = div.children[0].children[0];

    expect(container.children[0]).toBe(undefined);
  });

  it("should attach edge", () => {
    const store: GraphStore = new GraphStore();
    const htmlView = createHtmlController({ store });
    const div = document.createElement("div");
    htmlView.attach(div);

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    htmlView.attachNode(addNodeRequest1.nodeId);
    htmlView.attachNode(addNodeRequest2.nodeId);
    htmlView.attachEdge(addEdgeRequest12.edgeId);

    const container = div.children[0].children[0];

    expect(container.children[2]).toBe(addEdgeRequest12.shape.svg);
  });

  it("should detach edge", () => {
    const store: GraphStore = new GraphStore();
    const htmlView = createHtmlController({ store });
    const div = document.createElement("div");
    htmlView.attach(div);

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    htmlView.attachNode(addNodeRequest1.nodeId);
    htmlView.attachNode(addNodeRequest2.nodeId);
    htmlView.attachEdge(addEdgeRequest12.edgeId);
    htmlView.detachEdge(addEdgeRequest12.edgeId);

    const container = div.children[0].children[0];

    expect(container.children[2]).toBe(undefined);
  });

  it("should clear nodes and edges", () => {
    const store: GraphStore = new GraphStore();
    const htmlView = createHtmlController({ store });
    const div = document.createElement("div");
    htmlView.attach(div);

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    htmlView.attachNode(addNodeRequest1.nodeId);
    htmlView.attachNode(addNodeRequest2.nodeId);
    htmlView.attachEdge(addEdgeRequest12.edgeId);
    htmlView.clear();

    const container = div.children[0].children[0];

    expect(container.children.length).toBe(0);
  });

  it("should remove subelements on destroy", () => {
    const htmlView = createHtmlController();

    const div = document.createElement("div");
    htmlView.attach(div);
    htmlView.destroy();

    expect(div.children.length).toBe(0);
  });

  it("should clear on destroy", () => {
    const htmlView = createHtmlController();

    const spy = jest.spyOn(htmlView, "clear");

    htmlView.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should detach on destroy", () => {
    const htmlView = createHtmlController();

    const spy = jest.spyOn(htmlView, "detach");

    htmlView.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should update node coordinates", () => {
    const store = new GraphStore();
    const htmlView = createHtmlController({ store });
    const div = document.createElement("div");
    htmlView.attach(div);

    store.addNode(addNodeRequest1);
    htmlView.attachNode(addNodeRequest1.nodeId);

    const node = store.getNode(addNodeRequest1.nodeId)!;
    node.x = 100;
    node.y = 100;

    htmlView.updateNodeCoordinates(addNodeRequest1.nodeId);

    const container = div.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLDivElement;

    expect(nodeWrapper.style.transform).toBe("translate(100px, 100px)");
  });

  it("should update node priority", () => {
    const store = new GraphStore();
    const htmlView = createHtmlController({ store });
    const div = document.createElement("div");
    htmlView.attach(div);

    store.addNode(addNodeRequest1);
    htmlView.attachNode(addNodeRequest1.nodeId);

    const container = div.children[0].children[0];
    const nodeWrapper = container.children[0] as HTMLDivElement;

    const node = store.getNode(addNodeRequest1.nodeId)!;
    node.priority = 10;
    htmlView.updateNodePriority(addNodeRequest1.nodeId);

    expect(nodeWrapper.style.zIndex).toBe("10");
  });

  it("should update edge shape", () => {
    const store: GraphStore = new GraphStore();
    const htmlView = createHtmlController({ store });
    const div = document.createElement("div");
    htmlView.attach(div);

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    htmlView.attachNode(addNodeRequest1.nodeId);
    htmlView.attachNode(addNodeRequest2.nodeId);
    htmlView.attachEdge(addEdgeRequest12.edgeId);

    const edge = store.getEdge(addEdgeRequest12.edgeId)!;

    const newShape = new EdgeShapeMock();
    edge.shape = newShape;

    htmlView.updateEdgeShape(addEdgeRequest12.edgeId);

    const container = div.children[0].children[0];

    expect(container.children[2]).toBe(newShape.svg);
  });

  it("should update edge coordinates", () => {
    const store: GraphStore = new GraphStore();
    const htmlView = createHtmlController({ store });
    const div = document.createElement("div");
    htmlView.attach(div);

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    htmlView.attachNode(addNodeRequest1.nodeId);
    htmlView.attachNode(addNodeRequest2.nodeId);
    htmlView.attachEdge(addEdgeRequest12.edgeId);

    const spy = jest.spyOn(addEdgeRequest12.shape, "render");

    htmlView.renderEdge(addEdgeRequest12.edgeId);

    const expected: EdgeRenderParams = {
      from: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        portId: addPortRequest1.portId,
        nodeId: addPortRequest1.nodeId,
        direction: 0,
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        portId: addPortRequest2.portId,
        nodeId: addPortRequest2.nodeId,
        direction: 0,
      },
    };

    expect(spy).toHaveBeenCalledWith(expected);
  });

  it("should update edge priority", () => {
    const store: GraphStore = new GraphStore();
    const htmlView = createHtmlController({ store });
    const div = document.createElement("div");
    htmlView.attach(div);

    store.addNode(addNodeRequest1);
    store.addNode(addNodeRequest2);
    store.addPort(addPortRequest1);
    store.addPort(addPortRequest2);
    store.addEdge(addEdgeRequest12);

    htmlView.attachNode(addNodeRequest1.nodeId);
    htmlView.attachNode(addNodeRequest2.nodeId);
    htmlView.attachEdge(addEdgeRequest12.edgeId);

    const edge = store.getEdge(addEdgeRequest12.edgeId)!;
    edge.priority = 10;
    htmlView.updateEdgePriority(addEdgeRequest12.edgeId);

    const container = div.children[0].children[0];
    const edgeSvg = container.children[2] as SVGSVGElement;

    expect(edgeSvg.style.zIndex).toBe("10");
  });
});
