import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "../core-html-view";
import { ViewportTransformer } from "@/viewport-transformer";
import { ViewportHtmlView } from "./viewport-html-view";
import { EventSubject } from "@/event-subject";
import { ViewportBox } from "./viewport-box";
import { standardCenterFn } from "@/center-fn";
import { EdgeShapeMock } from "@/edges";

const create = (): {
  trigger: EventSubject<ViewportBox>;
  store: GraphStore;
  coreView: CoreHtmlView;
  viewportView: ViewportHtmlView;
} => {
  const trigger = new EventSubject<ViewportBox>();
  const store = new GraphStore();
  const transformer = new ViewportTransformer();
  const coreView = new CoreHtmlView(store, transformer);
  const viewportView = new ViewportHtmlView(coreView, store, trigger);

  return { trigger, store, coreView, viewportView };
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

describe("ViewportHtmlView", () => {
  it("should call attach on core view", () => {
    const { coreView, viewportView } = create();
    const canvasElement = document.createElement("div");
    const spy = jest.spyOn(coreView, "attach");

    viewportView.attach(canvasElement);

    expect(spy).toHaveBeenCalledWith(canvasElement);
  });

  it("should call detach on core view", () => {
    const { coreView, viewportView } = create();
    const spy = jest.spyOn(coreView, "detach");

    viewportView.detach();

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
    const { trigger, coreView, store, viewportView } = create();

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

    viewportView.attachNode("node-1");

    expect(spy).toHaveBeenCalledWith("node-1");
  });

  it("should not attach node outside of the viewport when added after viewport rendering", () => {
    const { trigger, coreView, store, viewportView } = create();

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

    viewportView.attachNode("node-1");

    expect(spy).not.toHaveBeenCalledWith();
  });

  it("should detach node added after viewport rendering", () => {
    const { trigger, coreView, store, viewportView } = create();

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

    viewportView.detachNode("node-1");

    expect(spy).toHaveBeenCalledWith("node-1");
  });

  it("should not detach node already outside of the viewport", () => {
    const { trigger, coreView, store, viewportView } = create();

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

    viewportView.detachNode("node-1");

    expect(spy).not.toHaveBeenCalled();
  });

  it("should attach edge inside of the viewport", () => {
    const { trigger, coreView, store, viewportView } = create();

    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });

    configureEdgeGraph(store);

    const spy = jest.spyOn(coreView, "attachEdge");

    viewportView.attachEdge("edge-1");

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should not attach edge which would be outside of the viewport", () => {
    const { trigger, coreView, store, viewportView } = create();

    trigger.emit({ x: 11, y: 11, width: 10, height: 10 });

    configureEdgeGraph(store);

    const spy = jest.spyOn(coreView, "attachEdge");

    viewportView.attachEdge("edge-1");

    expect(spy).not.toHaveBeenCalledWith("edge-1");
  });

  it("should detach edge inside of the viewport", () => {
    const { trigger, coreView, store, viewportView } = create();

    configureEdgeGraph(store);

    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });

    const spy = jest.spyOn(coreView, "detachEdge");

    viewportView.detachEdge("edge-1");

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should not detach edge which is already outside of the viewport", () => {
    const { trigger, coreView, store, viewportView } = create();

    configureEdgeGraph(store);

    trigger.emit({ x: 11, y: 11, width: 10, height: 10 });

    const spy = jest.spyOn(coreView, "detachEdge");

    viewportView.detachEdge("edge-1");

    expect(spy).not.toHaveBeenCalledWith("edge-1");
  });

  it("should clear core view on creal", () => {
    const { coreView, viewportView } = create();

    const spy = jest.spyOn(coreView, "clear");

    viewportView.clear();

    expect(spy).toHaveBeenCalled();
  });

  it("should clear on destroy", () => {
    const { viewportView } = create();

    const spy = jest.spyOn(viewportView, "clear");

    viewportView.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should destroy core view on destroy", () => {
    const { coreView, viewportView } = create();

    const spy = jest.spyOn(coreView, "destroy");

    viewportView.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should not react after destroy", () => {
    const { trigger, coreView, store, viewportView } = create();

    store.addNode({
      nodeId: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    viewportView.destroy();

    const spy = jest.spyOn(coreView, "attachNode");

    trigger.emit({ x: -1, y: -1, width: 2, height: 2 });

    expect(spy).not.toHaveBeenCalled();
  });
});
