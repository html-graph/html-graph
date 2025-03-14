import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "../core-html-view";
import { ViewportTransformer } from "@/viewport-transformer";
import { EventSubject } from "@/event-subject";
import { RenderingBox } from "./rendering-box";
import { standardCenterFn } from "@/center-fn";
import { EdgeShapeMock } from "@/edges";
import { BoxHtmlView } from ".";

const create = (): {
  trigger: EventSubject<RenderingBox>;
  store: GraphStore;
  coreView: CoreHtmlView;
  boxView: BoxHtmlView;
} => {
  const trigger = new EventSubject<RenderingBox>();
  const store = new GraphStore();
  const transformer = new ViewportTransformer();
  const coreView = new CoreHtmlView(store, transformer);
  const boxView = new BoxHtmlView(coreView, store, trigger);

  return { trigger, store, coreView, boxView };
};

const configureEdgeGraph = (store: GraphStore): void => {
  store.addNode({
    nodeId: "node-1",
    element: document.createElement("div"),
    x: 0,
    y: 0,
    centerFn: standardCenterFn,
    priority: 0,
  });

  store.addNode({
    nodeId: "node-2",
    element: document.createElement("div"),
    x: 10,
    y: 10,
    centerFn: standardCenterFn,
    priority: 0,
  });

  store.addPort({
    portId: "port-1",
    nodeId: "node-1",
    element: document.createElement("div"),
    direction: 0,
  });

  store.addPort({
    portId: "port-2",
    nodeId: "node-2",
    element: document.createElement("div"),
    direction: 0,
  });

  store.addEdge({
    from: "port-1",
    to: "port-2",
    edgeId: "edge-1",
    shape: new EdgeShapeMock(),
    priority: 0,
  });
};

describe("BoxHtmlView", () => {
  it("should call attach on core view", () => {
    const { coreView, boxView } = create();
    const canvasElement = document.createElement("div");
    const spy = jest.spyOn(coreView, "attach");

    boxView.attach(canvasElement);

    expect(spy).toHaveBeenCalledWith(canvasElement);
  });

  it("should call detach on core view", () => {
    const { coreView, boxView } = create();
    const spy = jest.spyOn(coreView, "detach");

    boxView.detach();

    expect(spy).toHaveBeenCalled();
  });

  it("should attach node inside of the viewbox", () => {
    const { trigger, coreView, store } = create();

    store.addNode({
      nodeId: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    const spy = jest.spyOn(coreView, "attachNode");

    trigger.emit({ x: -1, y: -1, width: 2, height: 2 });

    expect(spy).toHaveBeenCalledWith("node-1");
  });

  it("should not attach node outside of the viewbox", () => {
    const { trigger, coreView, store } = create();

    store.addNode({
      nodeId: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    const spy = jest.spyOn(coreView, "attachNode");

    trigger.emit({ x: 1, y: 1, width: 2, height: 2 });

    expect(spy).not.toHaveBeenCalled();
  });

  it("should detach node which once was outside of the viewbox", () => {
    const { trigger, coreView, store } = create();

    store.addNode({
      nodeId: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    trigger.emit({ x: -1, y: -1, width: 2, height: 2 });

    const spy = jest.spyOn(coreView, "detachNode");

    trigger.emit({ x: 1, y: 1, width: 2, height: 2 });

    expect(spy).toHaveBeenCalledWith("node-1");
  });

  it("should attach edge when both nodes are in the viewport", () => {
    const { trigger, coreView, store } = create();

    configureEdgeGraph(store);

    const spy = jest.spyOn(coreView, "attachEdge");

    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should attach edge when source node is outside of the viewport", () => {
    const { trigger, coreView, store } = create();

    configureEdgeGraph(store);

    const spy = jest.spyOn(coreView, "attachEdge");

    trigger.emit({ x: 1, y: 1, width: 10, height: 10 });

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should attach edge when target node is outside of the viewport", () => {
    const { trigger, coreView, store } = create();

    configureEdgeGraph(store);

    const spy = jest.spyOn(coreView, "attachEdge");

    trigger.emit({ x: 0, y: 0, width: 9, height: 9 });

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should attach node outside of the viewport when edge is inside of the viewport", () => {
    const { trigger, coreView, store } = create();

    configureEdgeGraph(store);

    const spy = jest.spyOn(coreView, "attachNode");

    trigger.emit({ x: 1, y: 1, width: 8, height: 8 });

    expect(spy).toHaveBeenCalledWith("node-1");
  });

  it("should detach edge which once was inside of the viewport", () => {
    const { trigger, coreView, store } = create();

    configureEdgeGraph(store);

    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });

    const spy = jest.spyOn(coreView, "detachEdge");

    trigger.emit({ x: 11, y: 11, width: 10, height: 10 });

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should attach node added after viewport rendering", () => {
    const { trigger, coreView, store, boxView } = create();

    trigger.emit({ x: -1, y: -1, width: 2, height: 2 });

    store.addNode({
      nodeId: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    const spy = jest.spyOn(coreView, "attachNode");

    boxView.attachNode("node-1");

    expect(spy).toHaveBeenCalledWith("node-1");
  });

  it("should not attach node outside of the viewport when added after viewport rendering", () => {
    const { trigger, coreView, store, boxView } = create();

    trigger.emit({ x: 1, y: 1, width: 2, height: 2 });

    store.addNode({
      nodeId: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    const spy = jest.spyOn(coreView, "attachNode");

    boxView.attachNode("node-1");

    expect(spy).not.toHaveBeenCalledWith();
  });

  it("should detach node added after viewport rendering", () => {
    const { trigger, coreView, store, boxView } = create();

    store.addNode({
      nodeId: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    trigger.emit({ x: -1, y: -1, width: 2, height: 2 });

    const spy = jest.spyOn(coreView, "detachNode");

    boxView.detachNode("node-1");

    expect(spy).toHaveBeenCalledWith("node-1");
  });

  it("should not detach node already outside of the viewport", () => {
    const { trigger, coreView, store, boxView } = create();

    store.addNode({
      nodeId: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    trigger.emit({ x: -1, y: -1, width: 2, height: 2 });
    trigger.emit({ x: 1, y: 1, width: 2, height: 2 });

    const spy = jest.spyOn(coreView, "detachNode");

    boxView.detachNode("node-1");

    expect(spy).not.toHaveBeenCalled();
  });

  it("should attach edge inside of the viewport", () => {
    const { trigger, coreView, store, boxView } = create();

    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });

    configureEdgeGraph(store);

    const spy = jest.spyOn(coreView, "attachEdge");

    boxView.attachEdge("edge-1");

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should not attach edge which would be outside of the viewport", () => {
    const { trigger, coreView, store, boxView } = create();

    trigger.emit({ x: 11, y: 11, width: 10, height: 10 });

    configureEdgeGraph(store);

    const spy = jest.spyOn(coreView, "attachEdge");

    boxView.attachEdge("edge-1");

    expect(spy).not.toHaveBeenCalledWith("edge-1");
  });

  it("should detach edge inside of the viewport", () => {
    const { trigger, coreView, store, boxView } = create();

    configureEdgeGraph(store);

    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });

    const spy = jest.spyOn(coreView, "detachEdge");

    boxView.detachEdge("edge-1");

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should not detach edge which is already outside of the viewport", () => {
    const { trigger, coreView, store, boxView } = create();

    configureEdgeGraph(store);

    trigger.emit({ x: 11, y: 11, width: 10, height: 10 });

    const spy = jest.spyOn(coreView, "detachEdge");

    boxView.detachEdge("edge-1");

    expect(spy).not.toHaveBeenCalledWith("edge-1");
  });

  it("should clear core view on creal", () => {
    const { coreView, boxView } = create();

    const spy = jest.spyOn(coreView, "clear");

    boxView.clear();

    expect(spy).toHaveBeenCalled();
  });

  it("should clear on destroy", () => {
    const { boxView } = create();

    const spy = jest.spyOn(boxView, "clear");

    boxView.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should destroy core view on destroy", () => {
    const { coreView, boxView } = create();

    const spy = jest.spyOn(coreView, "destroy");

    boxView.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should not react after destroy", () => {
    const { trigger, coreView, store, boxView } = create();

    store.addNode({
      nodeId: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    boxView.destroy();

    const spy = jest.spyOn(coreView, "attachNode");

    trigger.emit({ x: -1, y: -1, width: 2, height: 2 });

    expect(spy).not.toHaveBeenCalled();
  });

  it("should update node coordinates when kept inside of the viewport", () => {
    const { trigger, coreView, store, boxView } = create();

    store.addNode({
      nodeId: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    trigger.emit({ x: 0, y: 0, width: 2, height: 2 });

    const node = store.getNode("node-1")!;
    node.x = 2;
    node.y = 2;

    const spy = jest.spyOn(coreView, "updateNodeCoordinates");

    boxView.updateNodeCoordinates("node-1");

    expect(spy).toHaveBeenCalledWith("node-1");
  });

  it("should detach node when updating coordinates when gone outside of the viewport", () => {
    const { trigger, coreView, store, boxView } = create();

    store.addNode({
      nodeId: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    trigger.emit({ x: 0, y: 0, width: 2, height: 2 });

    const node = store.getNode("node-1")!;
    node.x = 3;
    node.y = 3;

    const spy = jest.spyOn(coreView, "detachNode");

    boxView.updateNodeCoordinates("node-1");

    expect(spy).toHaveBeenCalledWith("node-1");
  });

  it("should attach node when updating coordinates when goes inside of the viewport", () => {
    const { trigger, coreView, store, boxView } = create();

    store.addNode({
      nodeId: "node-1",
      element: document.createElement("div"),
      x: 3,
      y: 3,
      centerFn: standardCenterFn,
      priority: 0,
    });

    trigger.emit({ x: 0, y: 0, width: 2, height: 2 });

    const node = store.getNode("node-1")!;
    node.x = 0;
    node.y = 0;

    const spy = jest.spyOn(coreView, "attachNode");

    boxView.updateNodeCoordinates("node-1");

    expect(spy).toHaveBeenCalledWith("node-1");
  });

  it("should update node priority when inside of the viewport", () => {
    const { trigger, coreView, store, boxView } = create();

    store.addNode({
      nodeId: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    trigger.emit({ x: 0, y: 0, width: 2, height: 2 });

    const spy = jest.spyOn(coreView, "updateNodePriority");

    boxView.updateNodePriority("node-1");

    expect(spy).toHaveBeenCalledWith("node-1");
  });

  it("should not update node priority when outside of the viewport", () => {
    const { trigger, coreView, store, boxView } = create();

    store.addNode({
      nodeId: "node-1",
      element: document.createElement("div"),
      x: 3,
      y: 3,
      centerFn: standardCenterFn,
      priority: 0,
    });

    trigger.emit({ x: 0, y: 0, width: 2, height: 2 });

    const spy = jest.spyOn(coreView, "updateNodePriority");

    boxView.updateNodePriority("node-1");

    expect(spy).not.toHaveBeenCalled();
  });

  it("should update edge shape when inside of the viewport", () => {
    const { trigger, coreView, store, boxView } = create();

    configureEdgeGraph(store);

    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });

    const edge = store.getEdge("edge-1")!;

    edge.shape = new EdgeShapeMock();

    const spy = jest.spyOn(coreView, "updateEdgeShape");

    boxView.updateEdgeShape("edge-1");

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should not update edge shape when outside of the viewport", () => {
    const { trigger, coreView, store, boxView } = create();

    configureEdgeGraph(store);

    trigger.emit({ x: 11, y: 11, width: 10, height: 10 });

    const edge = store.getEdge("edge-1")!;

    edge.shape = new EdgeShapeMock();

    const spy = jest.spyOn(coreView, "updateEdgeShape");

    boxView.updateEdgeShape("edge-1");

    expect(spy).not.toHaveBeenCalled();
  });

  it("should attach edge when moved inside of the viewport", () => {
    const { trigger, coreView, store, boxView } = create();

    configureEdgeGraph(store);

    trigger.emit({ x: 11, y: 11, width: 10, height: 10 });

    const node = store.getNode("node-2")!;
    node.x = 12;
    node.y = 12;

    const spy = jest.spyOn(coreView, "attachEdge");

    boxView.renderEdge("edge-1");

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should detach edge when moved outside of the viewport", () => {
    const { trigger, coreView, store, boxView } = create();

    configureEdgeGraph(store);

    trigger.emit({ x: 0, y: 0, width: 8, height: 8 });

    const node = store.getNode("node-1")!;
    node.x = 9;
    node.y = 9;

    const spy = jest.spyOn(coreView, "detachEdge");

    boxView.renderEdge("edge-1");

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should render edge when kept inside of the viewport", () => {
    const { trigger, coreView, store, boxView } = create();

    configureEdgeGraph(store);

    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });

    const spy = jest.spyOn(coreView, "renderEdge");

    boxView.renderEdge("edge-1");

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should update edge priority when inside of the viewport", () => {
    const { trigger, coreView, store, boxView } = create();

    configureEdgeGraph(store);

    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });

    const spy = jest.spyOn(coreView, "updateEdgePriority");

    boxView.updateEdgePriority("edge-1");

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should not update edge priority when outside of the viewport", () => {
    const { trigger, coreView, store, boxView } = create();

    configureEdgeGraph(store);

    trigger.emit({ x: 11, y: 11, width: 10, height: 10 });

    const spy = jest.spyOn(coreView, "updateEdgePriority");

    boxView.updateEdgePriority("edge-1");

    expect(spy).not.toHaveBeenCalledWith("edge-1");
  });
});
