import { GraphStore } from "@/graph-store";
import { RenderingBoxState } from "./rendering-box-state";
import { standardCenterFn } from "@/center-fn";
import { EdgeShapeMock } from "@/edges";

const create = (): {
  graphStore: GraphStore;
  renderingBoxState: RenderingBoxState;
} => {
  const graphStore = new GraphStore();
  const renderingBoxState = new RenderingBoxState(graphStore);

  return { graphStore, renderingBoxState };
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

describe("RenderingBoxState", () => {
  it("should not have nodes inside view box by default", () => {
    const { graphStore, renderingBoxState } = create();

    graphStore.addNode({
      nodeId: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    expect(renderingBoxState.hasNode("node-1")).toBe(false);
  });

  it("should have node inside view box", () => {
    const { graphStore, renderingBoxState } = create();

    graphStore.addNode({
      nodeId: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    renderingBoxState.setRenderingBox({ x: -1, y: -1, width: 2, height: 2 });

    expect(renderingBoxState.hasNode("node-1")).toBe(true);
  });

  it("should have node inside the box regarding for left border", () => {
    const { graphStore, renderingBoxState } = create();

    graphStore.addNode({
      nodeId: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    renderingBoxState.setRenderingBox({ x: 0, y: -1, width: 2, height: 2 });

    expect(renderingBoxState.hasNode("node-1")).toBe(true);
  });

  it("should have node inside the box regarding for right border", () => {
    const { graphStore, renderingBoxState } = create();

    graphStore.addNode({
      nodeId: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    renderingBoxState.setRenderingBox({ x: -2, y: -1, width: 2, height: 2 });

    expect(renderingBoxState.hasNode("node-1")).toBe(true);
  });

  it("should have node inside the box regarding for top border", () => {
    const { graphStore, renderingBoxState } = create();

    graphStore.addNode({
      nodeId: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    renderingBoxState.setRenderingBox({ x: -1, y: 0, width: 2, height: 2 });

    expect(renderingBoxState.hasNode("node-1")).toBe(true);
  });

  it("should have node inside the box regarding for bottom border", () => {
    const { graphStore, renderingBoxState } = create();

    graphStore.addNode({
      nodeId: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    renderingBoxState.setRenderingBox({ x: -1, y: -2, width: 2, height: 2 });

    expect(renderingBoxState.hasNode("node-1")).toBe(true);
  });

  it("should have edge inside the box", () => {
    const { graphStore, renderingBoxState } = create();

    configureEdgeGraph(graphStore);

    renderingBoxState.setRenderingBox({ x: 0, y: 0, width: 10, height: 10 });

    expect(renderingBoxState.hasEdge("edge-1")).toBe(true);
  });

  it("should have edge inside the box partially", () => {
    const { graphStore, renderingBoxState } = create();

    configureEdgeGraph(graphStore);

    renderingBoxState.setRenderingBox({ x: -1, y: 0, width: 2, height: 10 });

    expect(renderingBoxState.hasEdge("edge-1")).toBe(true);
  });

  it("should have edge inside the box partially", () => {
    const { graphStore, renderingBoxState } = create();

    configureEdgeGraph(graphStore);

    renderingBoxState.setRenderingBox({ x: 9, y: 0, width: 2, height: 10 });

    expect(renderingBoxState.hasEdge("edge-1")).toBe(true);
  });

  it("should not have edge inside the box", () => {
    const { graphStore, renderingBoxState } = create();

    configureEdgeGraph(graphStore);

    renderingBoxState.setRenderingBox({ x: -3, y: 0, width: 2, height: 10 });

    expect(renderingBoxState.hasEdge("edge-1")).toBe(false);
  });

  it("should not have edge inside the box", () => {
    const { graphStore, renderingBoxState } = create();

    configureEdgeGraph(graphStore);

    renderingBoxState.setRenderingBox({ x: 11, y: 0, width: 2, height: 10 });

    expect(renderingBoxState.hasEdge("edge-1")).toBe(false);
  });

  it("should have edge inside the box partially", () => {
    const { graphStore, renderingBoxState } = create();

    configureEdgeGraph(graphStore);

    renderingBoxState.setRenderingBox({ x: 0, y: -1, width: 10, height: 2 });

    expect(renderingBoxState.hasEdge("edge-1")).toBe(true);
  });

  it("should have edge inside the box partially", () => {
    const { graphStore, renderingBoxState } = create();

    configureEdgeGraph(graphStore);

    renderingBoxState.setRenderingBox({ x: 0, y: 9, width: 10, height: 2 });

    expect(renderingBoxState.hasEdge("edge-1")).toBe(true);
  });

  it("should not have edge inside the box", () => {
    const { graphStore, renderingBoxState } = create();

    configureEdgeGraph(graphStore);

    renderingBoxState.setRenderingBox({ x: 0, y: -3, width: 10, height: 2 });

    expect(renderingBoxState.hasEdge("edge-1")).toBe(false);
  });

  it("should not have edge inside the box", () => {
    const { graphStore, renderingBoxState } = create();

    configureEdgeGraph(graphStore);

    renderingBoxState.setRenderingBox({ x: 0, y: 11, width: 10, height: 2 });

    expect(renderingBoxState.hasEdge("edge-1")).toBe(false);
  });
});
