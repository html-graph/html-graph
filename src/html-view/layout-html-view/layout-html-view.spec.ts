import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "../core-html-view";
import { ViewportStore } from "@/viewport-store";
import { LayoutHtmlView } from "./layout-html-view";
import { standardCenterFn } from "@/center-fn";
import { BezierEdgeShape } from "@/edges";

const create = (): {
  readonly graphStore: GraphStore;
  readonly coreHtmlView: CoreHtmlView;
  readonly layoutHtmlView: LayoutHtmlView;
} => {
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore();
  const element = document.createElement("div");
  const coreHtmlView = new CoreHtmlView(graphStore, viewportStore, element);
  const layoutHtmlView = new LayoutHtmlView(coreHtmlView, graphStore);

  return {
    graphStore,
    coreHtmlView,
    layoutHtmlView,
  };
};

describe("LayoutHtmlView", () => {
  it("should attach node on core view", () => {
    const { graphStore, layoutHtmlView, coreHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    const spy = jest.spyOn(coreHtmlView, "attachNode");

    layoutHtmlView.attachNode("node-1");

    expect(spy).toHaveBeenCalledWith("node-1");
  });

  it("should detach node from core view", () => {
    const { graphStore, layoutHtmlView, coreHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");

    const spy = jest.spyOn(coreHtmlView, "detachNode");
    layoutHtmlView.detachNode("node-1");

    expect(spy).toHaveBeenCalledWith("node-1");
  });

  it("should attach edge on core view", () => {
    const { graphStore, layoutHtmlView, coreHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    graphStore.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new BezierEdgeShape(),
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");

    const spy = jest.spyOn(coreHtmlView, "attachEdge");
    layoutHtmlView.attachEdge("edge-1");

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should detach edge from core view", () => {
    const { graphStore, layoutHtmlView, coreHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    graphStore.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new BezierEdgeShape(),
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");
    layoutHtmlView.attachEdge("edge-1");

    const spy = jest.spyOn(coreHtmlView, "detachEdge");
    layoutHtmlView.detachEdge("edge-1");

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should update node position on core view", () => {
    const { graphStore, layoutHtmlView, coreHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");
    const spy = jest.spyOn(coreHtmlView, "updateNodePosition");

    layoutHtmlView.updateNodePosition("node-1");

    expect(spy).toHaveBeenCalledWith("node-1");
  });

  it("should update node priority on core view", () => {
    const { graphStore, layoutHtmlView, coreHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");
    const spy = jest.spyOn(coreHtmlView, "updateNodePriority");

    layoutHtmlView.updateNodePriority("node-1");

    expect(spy).toHaveBeenCalledWith("node-1");
  });

  it("should update edge shape on core view", () => {
    const { graphStore, layoutHtmlView, coreHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    graphStore.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new BezierEdgeShape(),
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");
    layoutHtmlView.attachEdge("edge-1");

    const spy = jest.spyOn(coreHtmlView, "updateEdgeShape");
    layoutHtmlView.updateEdgeShape("edge-1");

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should render edge on core view", () => {
    const { graphStore, layoutHtmlView, coreHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    graphStore.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new BezierEdgeShape(),
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");
    layoutHtmlView.attachEdge("edge-1");

    const spy = jest.spyOn(coreHtmlView, "renderEdge");
    layoutHtmlView.renderEdge("edge-1");

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should update edge priority on core view", () => {
    const { graphStore, layoutHtmlView, coreHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    graphStore.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new BezierEdgeShape(),
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");
    layoutHtmlView.attachEdge("edge-1");

    const spy = jest.spyOn(coreHtmlView, "updateEdgePriority");
    layoutHtmlView.updateEdgePriority("edge-1");

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should clear core view", () => {
    const { layoutHtmlView, coreHtmlView } = create();

    const spy = jest.spyOn(coreHtmlView, "clear");
    layoutHtmlView.clear();

    expect(spy).toHaveBeenCalled();
  });

  it("should destroy core view", () => {
    const { layoutHtmlView, coreHtmlView } = create();

    const spy = jest.spyOn(coreHtmlView, "destroy");
    layoutHtmlView.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should not attach node on core view when x is null", () => {
    const { graphStore, layoutHtmlView, coreHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: null,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    const spy = jest.spyOn(coreHtmlView, "attachNode");

    layoutHtmlView.attachNode("node-1");

    expect(spy).not.toHaveBeenCalledWith("node-1");
  });

  it("should not attach node on core view when y is null", () => {
    const { graphStore, layoutHtmlView, coreHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: null,
      centerFn: standardCenterFn,
      priority: 0,
    });

    const spy = jest.spyOn(coreHtmlView, "attachNode");

    layoutHtmlView.attachNode("node-1");

    expect(spy).not.toHaveBeenCalledWith("node-1");
  });

  it("should not throw on detach deferred node", () => {
    const { graphStore, layoutHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: null,
      centerFn: standardCenterFn,
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");

    expect(() => {
      layoutHtmlView.detachNode("node-1");
    }).not.toThrow();
  });

  it("should throw on second detach of deferred node", () => {
    const { graphStore, layoutHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: null,
      centerFn: standardCenterFn,
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");
    layoutHtmlView.detachNode("node-1");

    expect(() => {
      layoutHtmlView.detachNode("node-1");
    }).toThrow();
  });

  it("should not throw on update position of not attached node", () => {
    const { graphStore, layoutHtmlView } = create();
    const element = document.createElement("div");

    graphStore.addNode({
      id: "node-1",
      element,
      x: null,
      y: null,
      centerFn: standardCenterFn,
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");

    layoutHtmlView.updateNodePosition("node-1");

    expect(element.style.transform).not.toBe("translate(0px, 0px)");
  });

  it("should not throw on update priority of not attached node", () => {
    const { graphStore, layoutHtmlView } = create();
    const element = document.createElement("div");

    graphStore.addNode({
      id: "node-1",
      element,
      x: null,
      y: null,
      centerFn: standardCenterFn,
      priority: 10,
    });

    layoutHtmlView.attachNode("node-1");

    layoutHtmlView.updateNodePriority("node-1");

    expect(element.style.zIndex).not.toBe("10");
  });

  it("should not attach edge on core view when source node has no coordinates", () => {
    const { graphStore, layoutHtmlView, coreHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: null,
      y: null,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    graphStore.addNode({
      id: "node-2",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addPort({
      id: "port-2",
      nodeId: "node-2",
      element: document.createElement("div"),
      direction: 0,
    });

    graphStore.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-2",
      shape: new BezierEdgeShape(),
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");
    layoutHtmlView.attachNode("node-2");

    const spy = jest.spyOn(coreHtmlView, "attachEdge");
    layoutHtmlView.attachEdge("edge-1");

    expect(spy).not.toHaveBeenCalledWith("edge-1");
  });

  it("should not attach edge on core view when target node has no coordinates", () => {
    const { graphStore, layoutHtmlView, coreHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    graphStore.addNode({
      id: "node-2",
      element: document.createElement("div"),
      x: null,
      y: null,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addPort({
      id: "port-2",
      nodeId: "node-2",
      element: document.createElement("div"),
      direction: 0,
    });

    graphStore.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-2",
      shape: new BezierEdgeShape(),
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");
    layoutHtmlView.attachNode("node-2");

    const spy = jest.spyOn(coreHtmlView, "attachEdge");
    layoutHtmlView.attachEdge("edge-1");

    expect(spy).not.toHaveBeenCalledWith("edge-1");
  });

  it("should not throw when trying to detach deferred edge", () => {
    const { graphStore, layoutHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    graphStore.addNode({
      id: "node-2",
      element: document.createElement("div"),
      x: null,
      y: null,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addPort({
      id: "port-2",
      nodeId: "node-2",
      element: document.createElement("div"),
      direction: 0,
    });

    graphStore.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-2",
      shape: new BezierEdgeShape(),
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");
    layoutHtmlView.attachNode("node-2");
    layoutHtmlView.attachEdge("edge-1");

    expect(() => {
      layoutHtmlView.detachEdge("edge-1");
    }).not.toThrow();
  });

  it("should detach reattached edge", () => {
    const { graphStore, layoutHtmlView, coreHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    graphStore.addNode({
      id: "node-2",
      element: document.createElement("div"),
      x: null,
      y: null,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addPort({
      id: "port-2",
      nodeId: "node-2",
      element: document.createElement("div"),
      direction: 0,
    });

    graphStore.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-2",
      shape: new BezierEdgeShape(),
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");
    layoutHtmlView.attachNode("node-2");
    layoutHtmlView.attachEdge("edge-1");

    layoutHtmlView.detachEdge("edge-1");
    layoutHtmlView.detachNode("node-2");
    graphStore.updateNode("node-2", { x: 0, y: 0 });

    layoutHtmlView.attachNode("node-2");
    layoutHtmlView.attachEdge("edge-1");

    const spy = jest.spyOn(coreHtmlView, "detachEdge");
    layoutHtmlView.detachEdge("edge-1");

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should not throw when trying to update deferred edge shape", () => {
    const { graphStore, layoutHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: null,
      y: null,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    graphStore.addPort({
      id: "port-2",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    graphStore.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new BezierEdgeShape(),
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");
    layoutHtmlView.attachEdge("edge-1");

    expect(() => {
      layoutHtmlView.updateEdgeShape("edge-1");
    }).not.toThrow();
  });

  it("should not render deferred edge", () => {
    const { graphStore, layoutHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: null,
      y: null,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    graphStore.addPort({
      id: "port-2",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    const shape = new BezierEdgeShape();

    graphStore.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape,
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");
    layoutHtmlView.attachEdge("edge-1");

    const spy = jest.spyOn(shape, "render");

    layoutHtmlView.renderEdge("edge-1");

    expect(spy).not.toHaveBeenCalled();
  });

  it("should update priority on deferred edge", () => {
    const { graphStore, layoutHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: null,
      y: null,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    graphStore.addPort({
      id: "port-2",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    const shape = new BezierEdgeShape();

    graphStore.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape,
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");
    layoutHtmlView.attachEdge("edge-1");

    graphStore.updateEdge("edge-1", { priority: 10 });
    layoutHtmlView.updateEdgePriority("edge-1");

    expect(shape.svg.style.zIndex).toBe("");
  });

  it("should throw on detach of deferred node after clear", () => {
    const { graphStore, layoutHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: null,
      centerFn: standardCenterFn,
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");
    layoutHtmlView.clear();

    expect(() => {
      layoutHtmlView.detachNode("node-1");
    }).toThrow();
  });

  it("should throw when trying to detach deferred edge after clear", () => {
    const { graphStore, layoutHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: null,
      y: null,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    graphStore.addPort({
      id: "port-2",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    graphStore.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new BezierEdgeShape(),
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");
    layoutHtmlView.attachEdge("edge-1");
    layoutHtmlView.clear();

    expect(() => {
      layoutHtmlView.detachEdge("edge-1");
    }).toThrow();
  });

  it("should update node position for detached node with defined coordinates", () => {
    const { graphStore, layoutHtmlView, coreHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: null,
      y: null,
      centerFn: standardCenterFn,
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");
    graphStore.updateNode("node-1", { x: 0, y: 0 });

    const spy = jest.spyOn(coreHtmlView, "updateNodePosition");

    layoutHtmlView.updateNodePosition("node-1");

    expect(spy).toHaveBeenCalledWith("node-1");
  });

  it("should detach node after updating node position", () => {
    const { graphStore, layoutHtmlView, coreHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: null,
      y: null,
      centerFn: standardCenterFn,
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");
    graphStore.updateNode("node-1", { x: 0, y: 0 });
    layoutHtmlView.updateNodePosition("node-1");

    const spy = jest.spyOn(coreHtmlView, "detachNode");

    layoutHtmlView.detachNode("node-1");

    expect(spy).toHaveBeenCalledWith("node-1");
  });

  it("should update node priority for detached node with defined coordinates", () => {
    const { graphStore, layoutHtmlView, coreHtmlView } = create();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: null,
      y: null,
      centerFn: standardCenterFn,
      priority: 0,
    });

    layoutHtmlView.attachNode("node-1");
    graphStore.updateNode("node-1", { x: 0, y: 0 });

    const spy = jest.spyOn(coreHtmlView, "updateNodePriority");

    layoutHtmlView.updateNodePriority("node-1");

    expect(spy).toHaveBeenCalledWith("node-1");
  });
});
