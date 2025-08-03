import { AddNodeRequest, GraphStore } from "@/graph-store";
import { CoreHtmlView } from "../core-html-view";
import { ViewportStore } from "@/viewport-store";
import { EventSubject } from "@/event-subject";
import { RenderingBox } from "./rendering-box";
import { BoxHtmlView } from "./box-html-view";
import { standardCenterFn } from "@/center-fn";
import { BezierEdgeShape } from "@/edges";

const create = (config?: {
  onBeforeNodeAttached?: (nodeId: unknown) => void;
  onAfterNodeDetached?: (nodeId: unknown) => void;
}): {
  trigger: EventSubject<RenderingBox>;
  store: GraphStore<number>;
  coreView: CoreHtmlView;
  boxView: BoxHtmlView;
} => {
  const trigger = new EventSubject<RenderingBox>();
  const store = new GraphStore<number>();
  const transformer = new ViewportStore();
  const element = document.createElement("div");
  const coreView = new CoreHtmlView(store, transformer, element);
  const boxView = new BoxHtmlView(coreView, store, trigger, {
    onBeforeNodeAttached: config?.onBeforeNodeAttached ?? ((): void => {}),
    onAfterNodeDetached: config?.onAfterNodeDetached ?? ((): void => {}),
  });

  return { trigger, store, coreView, boxView };
};

const createAddNodeRequest = (): AddNodeRequest<number> => {
  return {
    id: "node-1",
    element: document.createElement("div"),
    x: 0,
    y: 0,
    centerFn: standardCenterFn,
    priority: 0,
  };
};

const configureEdgeGraph = (store: GraphStore<number>): void => {
  store.addNode({
    id: "node-1",
    element: document.createElement("div"),
    x: 0,
    y: 0,
    centerFn: standardCenterFn,
    priority: 0,
  });

  store.addNode({
    id: "node-2",
    element: document.createElement("div"),
    x: 10,
    y: 10,
    centerFn: standardCenterFn,
    priority: 0,
  });

  store.addPort({
    id: "port-1",
    nodeId: "node-1",
    element: document.createElement("div"),
    direction: 0,
  });

  store.addPort({
    id: "port-2",
    nodeId: "node-2",
    element: document.createElement("div"),
    direction: 0,
  });

  store.addEdge({
    from: "port-1",
    to: "port-2",
    id: "edge-1",
    shape: new BezierEdgeShape(),
    priority: 0,
  });
};

describe("BoxHtmlView", () => {
  it("should clear core view on clear", () => {
    const { coreView, boxView } = create();
    const spy = jest.spyOn(coreView, "clear");

    boxView.clear();

    expect(spy).toHaveBeenCalled();
  });

  it("should call clear on destroy", () => {
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

  it("should attach node inside of the viewbox", () => {
    const { trigger, coreView, store } = create();
    const addNodeRequest = createAddNodeRequest();
    store.addNode(addNodeRequest);

    const spy = jest.spyOn(coreView, "attachNode");
    trigger.emit({ x: -1, y: -1, width: 2, height: 2 });

    expect(spy).toHaveBeenCalledWith(addNodeRequest.id);
  });

  it("should call event handler before node attach", () => {
    const onBeforeNodeAttached = jest.fn();
    const { trigger, store } = create({ onBeforeNodeAttached });

    const addNodeRequest = createAddNodeRequest();
    store.addNode(addNodeRequest);
    trigger.emit({ x: -1, y: -1, width: 2, height: 2 });

    expect(onBeforeNodeAttached).toHaveBeenCalledWith(addNodeRequest.id);
  });

  it("should not attach node outside of the viewbox", () => {
    const { trigger, coreView, store, boxView } = create();
    const addNodeRequest = createAddNodeRequest();
    store.addNode(addNodeRequest);
    trigger.emit({ x: 9, y: 9, width: 2, height: 2 });

    const spy = jest.spyOn(coreView, "attachNode");
    boxView.attachNode(addNodeRequest.id);

    expect(spy).not.toHaveBeenCalledWith(addNodeRequest.id);
  });

  it("should detach node inside of the viewbox", () => {
    const { trigger, coreView, store, boxView } = create();
    const addNodeRequest = createAddNodeRequest();
    store.addNode(addNodeRequest);
    trigger.emit({ x: -1, y: -1, width: 2, height: 2 });

    const spy = jest.spyOn(coreView, "detachNode");
    boxView.detachNode("node-1");

    expect(spy).toHaveBeenCalledWith(addNodeRequest.id);
  });

  it("should call event handler after node detach", () => {
    const onAfterNodeDetached = jest.fn();
    const { trigger, store, boxView } = create({ onAfterNodeDetached });

    const addNodeRequest = createAddNodeRequest();
    store.addNode(addNodeRequest);
    trigger.emit({ x: -1, y: -1, width: 2, height: 2 });

    boxView.detachNode("node-1");

    expect(onAfterNodeDetached).toHaveBeenCalledWith(addNodeRequest.id);
  });

  it("should not detach not attached node", () => {
    const { coreView, store, boxView } = create();
    const addNodeRequest = createAddNodeRequest();
    store.addNode(addNodeRequest);

    const spy = jest.spyOn(coreView, "detachNode");
    boxView.detachNode("node-1");

    expect(spy).not.toHaveBeenCalledWith("node-1");
  });

  it("should reattach node inside of the viewbox", () => {
    const { trigger, coreView, store, boxView } = create();
    const addNodeRequest = createAddNodeRequest();
    store.addNode(addNodeRequest);
    trigger.emit({ x: -1, y: -1, width: 2, height: 2 });
    boxView.detachNode(addNodeRequest.id);
    const spy = jest.spyOn(coreView, "attachNode");

    boxView.attachNode(addNodeRequest.id);

    expect(spy).toHaveBeenCalledWith(addNodeRequest.id);
  });

  it("should attach source node before attaching edge inside of the viewbox", () => {
    const { trigger, coreView, store } = create();
    configureEdgeGraph(store);

    const spy = jest.spyOn(coreView, "attachNode");
    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });

    expect(spy).toHaveBeenCalledWith("node-1");
  });

  it("should not attach source node before attaching edge inside of the viewbox if already attached", () => {
    const { trigger, coreView, store, boxView } = create();
    configureEdgeGraph(store);
    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });
    boxView.detachEdge("edge-1");

    const spy = jest.spyOn(coreView, "attachNode");
    boxView.attachEdge("edge-1");

    expect(spy).not.toHaveBeenCalledWith("node-1");
  });

  it("should attach target node before attaching edge inside of the viewbox", () => {
    const { trigger, coreView, store } = create();
    configureEdgeGraph(store);

    const spy = jest.spyOn(coreView, "attachNode");
    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });

    expect(spy).toHaveBeenCalledWith("node-2");
  });

  it("should not attach tagret node before attaching edge inside of the viewbox if already attached", () => {
    const { trigger, coreView, store, boxView } = create();
    configureEdgeGraph(store);
    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });
    boxView.detachEdge("edge-1");

    const spy = jest.spyOn(coreView, "attachNode");
    boxView.attachEdge("edge-1");

    expect(spy).not.toHaveBeenCalledWith("node-2");
  });

  it("should attach edge inside of the viewbox", () => {
    const { trigger, coreView, store } = create();
    configureEdgeGraph(store);

    const spy = jest.spyOn(coreView, "attachEdge");
    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should attach edge outside of the viewbox", () => {
    const { trigger, coreView, store, boxView } = create();
    configureEdgeGraph(store);
    trigger.emit({ x: 11, y: 11, width: 10, height: 10 });

    const spy = jest.spyOn(coreView, "attachEdge");
    boxView.attachEdge("edge-1");

    expect(spy).not.toHaveBeenCalledWith("edge-1");
  });

  it("should not attach edge outside of the viewport", () => {
    const { trigger, coreView, store } = create();
    configureEdgeGraph(store);

    const spy = jest.spyOn(coreView, "attachEdge");
    trigger.emit({ x: 11, y: 11, width: 10, height: 10 });

    expect(spy).not.toHaveBeenCalledWith("edge-1");
  });

  it("should detach edge", () => {
    const { trigger, coreView, store, boxView } = create();
    configureEdgeGraph(store);
    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });

    const spy = jest.spyOn(coreView, "detachEdge");
    boxView.detachEdge("edge-1");

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should not detach edge twice", () => {
    const { trigger, coreView, store, boxView } = create();
    configureEdgeGraph(store);
    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });
    boxView.detachEdge("edge-1");

    const spy = jest.spyOn(coreView, "detachEdge");
    boxView.detachEdge("edge-1");

    expect(spy).not.toHaveBeenCalledWith("edge-1");
  });

  it("should clear nodes", () => {
    const { trigger, coreView, store, boxView } = create();
    const addNodeRequest = createAddNodeRequest();
    store.addNode(addNodeRequest);
    trigger.emit({ x: -1, y: -1, width: 2, height: 2 });
    boxView.clear();

    const spy = jest.spyOn(coreView, "attachNode");
    boxView.attachNode(addNodeRequest.id);

    expect(spy).toHaveBeenCalledWith(addNodeRequest.id);
  });

  it("should clear edges", () => {
    const { trigger, coreView, store, boxView } = create();
    configureEdgeGraph(store);
    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });
    boxView.clear();

    const spy = jest.spyOn(coreView, "attachEdge");
    boxView.attachEdge("edge-1");

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should update node coordinates if was attached", () => {
    const { trigger, coreView, store, boxView } = create();
    const addNodeRequest = createAddNodeRequest();
    store.addNode(addNodeRequest);
    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });

    const payload = store.getNode(addNodeRequest.id)!.payload;
    payload.x = 11;
    payload.y = 11;

    const spy = jest.spyOn(coreView, "updateNodePosition");
    boxView.updateNodePosition(addNodeRequest.id);

    expect(spy).toHaveBeenCalledWith(addNodeRequest.id);
  });

  it("should attach node when moved inside of the viewport", () => {
    const { trigger, coreView, store, boxView } = create();
    const addNodeRequest = createAddNodeRequest();
    store.addNode(addNodeRequest);
    trigger.emit({ x: 1, y: 1, width: 10, height: 10 });

    const payload = store.getNode(addNodeRequest.id)!.payload;
    payload.x = 2;
    payload.y = 2;

    const spy = jest.spyOn(coreView, "attachNode");
    boxView.updateNodePosition(addNodeRequest.id);

    expect(spy).toHaveBeenCalledWith(addNodeRequest.id);
  });

  it("should attach node adjacent edges when moved inside of the viewport", () => {
    const { trigger, coreView, store, boxView } = create();
    configureEdgeGraph(store);
    trigger.emit({ x: 11, y: 11, width: 10, height: 10 });

    const payload = store.getNode("node-1")!.payload;
    payload.x = 12;
    payload.y = 12;

    const spy = jest.spyOn(coreView, "attachEdge");
    boxView.updateNodePosition("node-1");
    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should update node priority for attached node", () => {
    const { trigger, coreView, store, boxView } = create();
    const addNodeRequest = createAddNodeRequest();
    store.addNode(addNodeRequest);
    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });

    const spy = jest.spyOn(coreView, "updateNodePriority");
    boxView.updateNodePriority(addNodeRequest.id);

    expect(spy).toHaveBeenCalledWith(addNodeRequest.id);
  });

  it("should not update node priority if not attached", () => {
    const { trigger, coreView, store, boxView } = create();
    const addNodeRequest = createAddNodeRequest();
    store.addNode(addNodeRequest);
    trigger.emit({ x: 1, y: 1, width: 10, height: 10 });

    const spy = jest.spyOn(coreView, "updateNodePriority");
    boxView.updateNodePriority(addNodeRequest.id);

    expect(spy).not.toHaveBeenCalledWith(addNodeRequest.id);
  });

  it("should update edge shape when attached", () => {
    const { trigger, coreView, store, boxView } = create();
    configureEdgeGraph(store);
    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });

    const spy = jest.spyOn(coreView, "updateEdgeShape");
    boxView.updateEdgeShape("edge-1");

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should not update edge shape when edge is not attached", () => {
    const { trigger, coreView, store, boxView } = create();
    configureEdgeGraph(store);
    trigger.emit({ x: 11, y: 11, width: 10, height: 10 });

    const spy = jest.spyOn(coreView, "updateEdgeShape");
    boxView.updateEdgeShape("edge-1");

    expect(spy).not.toHaveBeenCalledWith("edge-1");
  });

  it("should render edge shape", () => {
    const { trigger, coreView, store, boxView } = create();
    configureEdgeGraph(store);
    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });

    const spy = jest.spyOn(coreView, "renderEdge");
    boxView.renderEdge("edge-1");

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should not render edge shape when not attached", () => {
    const { trigger, coreView, store, boxView } = create();
    configureEdgeGraph(store);
    trigger.emit({ x: 11, y: 11, width: 10, height: 10 });

    const spy = jest.spyOn(coreView, "renderEdge");
    boxView.renderEdge("edge-1");

    expect(spy).not.toHaveBeenCalledWith("edge-1");
  });

  it("should update edge priority", () => {
    const { trigger, coreView, store, boxView } = create();
    configureEdgeGraph(store);
    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });

    const spy = jest.spyOn(coreView, "updateEdgePriority");
    boxView.updateEdgePriority("edge-1");

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should not update edge priority when kept outside of the viewport", () => {
    const { trigger, coreView, store, boxView } = create();
    configureEdgeGraph(store);
    trigger.emit({ x: 11, y: 11, width: 10, height: 10 });

    const spy = jest.spyOn(coreView, "updateEdgePriority");
    boxView.updateEdgePriority("edge-1");

    expect(spy).not.toHaveBeenCalledWith("edge-1");
  });

  it("should attach node moved to inside of the viewport", () => {
    const { trigger, coreView, store } = create();
    const addNodeRequest = createAddNodeRequest();
    store.addNode(addNodeRequest);
    const spy = jest.spyOn(coreView, "attachNode");

    trigger.emit({ x: -1, y: -1, width: 2, height: 2 });

    expect(spy).toHaveBeenCalledWith(addNodeRequest.id);
  });

  it("should not attach node moved to outside of the viewport", () => {
    const { trigger, coreView, store } = create();
    const addNodeRequest = createAddNodeRequest();
    store.addNode(addNodeRequest);

    const spy = jest.spyOn(coreView, "attachNode");

    trigger.emit({ x: 1, y: 1, width: 2, height: 2 });

    expect(spy).not.toHaveBeenCalledWith(addNodeRequest.id);
  });

  it("should detach node moved to outside of the viewport", () => {
    const { trigger, coreView, store } = create();
    const addNodeRequest = createAddNodeRequest();
    store.addNode(addNodeRequest);
    trigger.emit({ x: -1, y: -1, width: 2, height: 2 });

    const spy = jest.spyOn(coreView, "detachNode");
    trigger.emit({ x: 1, y: 1, width: 2, height: 2 });

    expect(spy).toHaveBeenCalledWith(addNodeRequest.id);
  });

  it("should attach edge moved to inside of the viewport", () => {
    const { trigger, coreView, store } = create();
    configureEdgeGraph(store);

    const spy = jest.spyOn(coreView, "attachEdge");
    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should detach edge moved to outside of the viewport", () => {
    const { trigger, coreView, store } = create();
    configureEdgeGraph(store);
    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });

    const spy = jest.spyOn(coreView, "detachEdge");
    trigger.emit({ x: 11, y: 11, width: 10, height: 10 });

    expect(spy).toHaveBeenCalledWith("edge-1");
  });

  it("should attach source node outside of the viewport when edge is inside of the viewport", () => {
    const { trigger, coreView, store } = create();
    configureEdgeGraph(store);

    const spy = jest.spyOn(coreView, "attachNode");
    trigger.emit({ x: 1, y: 1, width: 10, height: 10 });

    expect(spy).toHaveBeenCalledWith("node-1");
  });

  it("should attach target node outside of the viewport when edge is inside of the viewport", () => {
    const { trigger, coreView, store } = create();
    configureEdgeGraph(store);

    const spy = jest.spyOn(coreView, "attachNode");
    trigger.emit({ x: 0, y: 0, width: 9, height: 9 });

    expect(spy).toHaveBeenCalledWith("node-2");
  });

  it("should not detach source node outside of the viewport when edge is inside of the viewport", () => {
    const { trigger, coreView, store } = create();
    configureEdgeGraph(store);
    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });

    const spy = jest.spyOn(coreView, "detachNode");
    trigger.emit({ x: 1, y: 1, width: 10, height: 10 });

    expect(spy).not.toHaveBeenCalledWith("node-1");
  });

  it("should not detach target node outside of the viewport when edge is inside of the viewport", () => {
    const { trigger, coreView, store } = create();
    configureEdgeGraph(store);
    trigger.emit({ x: 0, y: 0, width: 10, height: 10 });

    const spy = jest.spyOn(coreView, "detachNode");
    trigger.emit({ x: 0, y: 0, width: 9, height: 9 });

    expect(spy).not.toHaveBeenCalledWith("node-1");
  });

  it("should not attach same node twice", () => {
    const { trigger, coreView, store } = create();
    configureEdgeGraph(store);

    trigger.emit({ x: 1, y: 1, width: 11, height: 11 });
    const spy = jest.spyOn(coreView, "attachNode");
    trigger.emit({ x: 1, y: 1, width: 11, height: 11 });

    expect(spy).not.toHaveBeenCalledWith("node-1");
  });
});
