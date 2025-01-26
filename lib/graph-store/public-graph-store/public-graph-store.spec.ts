import { EdgeShapeMock } from "@/edges";
import { EdgePayload, GraphStoreMock } from "../graph-store";
import { GraphNode } from "./graph-node";
import { GraphPort } from "./graph-port";
import { PublicGraphStore } from "./public-graph-store";

describe("PublicGraphStore", () => {
  it("should return null when no node in store", () => {
    const mock = new GraphStoreMock();

    jest.spyOn(mock, "getNode").mockReturnValue(undefined);

    const store = new PublicGraphStore(mock);

    expect(store.getNode(1)).toBe(null);
  });

  it("should return specified node", () => {
    const mock = new GraphStoreMock();

    const node: GraphNode = {
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: () => ({ x: 0, y: 0 }),
      priority: 0,
    };

    jest.spyOn(mock, "getNode").mockReturnValue(node);

    const store = new PublicGraphStore(mock);

    expect(store.getNode(1)).toStrictEqual(node);
  });

  it("should return specified node ids", () => {
    const mock = new GraphStoreMock();

    const nodeIds: unknown[] = [0];

    jest.spyOn(mock, "getAllNodeIds").mockReturnValue(nodeIds);

    const store = new PublicGraphStore(mock);

    expect(store.getAllNodeIds()).toBe(nodeIds);
  });

  it("should return null for no port in store", () => {
    const mock = new GraphStoreMock();

    jest.spyOn(mock, "getPort").mockReturnValue(undefined);

    const store = new PublicGraphStore(mock);

    expect(store.getPort(1)).toBe(null);
  });

  it("should return specified port", () => {
    const mock = new GraphStoreMock();

    const port: GraphPort = {
      element: document.createElement("div"),
      centerFn: () => ({ x: 0, y: 0 }),
      direction: 0,
    };

    jest.spyOn(mock, "getPort").mockReturnValue(port);

    const store = new PublicGraphStore(mock);

    expect(store.getPort(1)).toStrictEqual(port);
  });

  it("should return specified port ids", () => {
    const mock = new GraphStoreMock();

    const portIds: unknown[] = [0];

    jest.spyOn(mock, "getAllPortIds").mockReturnValue(portIds);

    const store = new PublicGraphStore(mock);

    expect(store.getAllPortIds()).toBe(portIds);
  });

  it("should return specified node port ids", () => {
    const mock = new GraphStoreMock();

    const portIds: unknown[] = [0];

    jest.spyOn(mock, "getNodePortIds").mockReturnValue(portIds);

    const store = new PublicGraphStore(mock);

    expect(store.getNodePortIds(1)).toBe(portIds);
  });

  it("should return undefined when no node in store", () => {
    const mock = new GraphStoreMock();

    jest.spyOn(mock, "getPortNodeId").mockReturnValue(undefined);

    const store = new PublicGraphStore(mock);

    expect(store.getPortNodeId(1)).toBe(null);
  });

  it("should return specified port node id", () => {
    const mock = new GraphStoreMock();

    const nodeId: unknown = 0;

    jest.spyOn(mock, "getPortNodeId").mockReturnValue(nodeId);

    const store = new PublicGraphStore(mock);

    expect(store.getPortNodeId(1)).toBe(nodeId);
  });

  it("should return specified edge ids", () => {
    const mock = new GraphStoreMock();

    const edgeIds: unknown[] = [0];

    jest.spyOn(mock, "getAllEdgeIds").mockReturnValue(edgeIds);

    const store = new PublicGraphStore(mock);

    expect(store.getAllEdgeIds()).toBe(edgeIds);
  });

  it("should return null for no edge in store", () => {
    const mock = new GraphStoreMock();

    jest.spyOn(mock, "getEdge").mockReturnValue(undefined);

    const store = new PublicGraphStore(mock);

    expect(store.getEdge(1)).toBe(null);
  });

  it("should return specified edge", () => {
    const mock = new GraphStoreMock();

    const edge: EdgePayload = {
      shape: new EdgeShapeMock(),
      from: 1,
      to: 2,
      priority: 0,
    };

    jest.spyOn(mock, "getEdge").mockReturnValue(edge);

    const store = new PublicGraphStore(mock);

    expect(store.getEdge(1)).toStrictEqual({
      from: edge.from,
      to: edge.to,
      priority: edge.priority,
    });
  });

  it("should return specified port incoming edge ids", () => {
    const mock = new GraphStoreMock();

    const edgeIds: unknown[] = [0];

    jest.spyOn(mock, "getPortIncomingEdgeIds").mockReturnValue(edgeIds);

    const store = new PublicGraphStore(mock);

    expect(store.getPortIncomingEdgeIds(1)).toBe(edgeIds);
  });

  it("should return specified port outcoming edge ids", () => {
    const mock = new GraphStoreMock();

    const edgeIds: unknown[] = [0];

    jest.spyOn(mock, "getPortOutcomingEdgeIds").mockReturnValue(edgeIds);

    const store = new PublicGraphStore(mock);

    expect(store.getPortOutcomingEdgeIds(1)).toBe(edgeIds);
  });

  it("should return specified port cycle edge ids", () => {
    const mock = new GraphStoreMock();

    const edgeIds: unknown[] = [0];

    jest.spyOn(mock, "getPortCycleEdgeIds").mockReturnValue(edgeIds);

    const store = new PublicGraphStore(mock);

    expect(store.getPortCycleEdgeIds(1)).toBe(edgeIds);
  });

  it("should return specified port adjacent edge ids", () => {
    const mock = new GraphStoreMock();

    const edgeIds: unknown[] = [0];

    jest.spyOn(mock, "getPortAdjacentEdgeIds").mockReturnValue(edgeIds);

    const store = new PublicGraphStore(mock);

    expect(store.getPortAdjacentEdgeIds(1)).toBe(edgeIds);
  });

  it("should return specified node incoming edge ids", () => {
    const mock = new GraphStoreMock();

    const edgeIds: unknown[] = [0];

    jest.spyOn(mock, "getNodeIncomingEdgeIds").mockReturnValue(edgeIds);

    const store = new PublicGraphStore(mock);

    expect(store.getNodeIncomingEdgeIds(1)).toBe(edgeIds);
  });

  it("should return specified node outcoming edge ids", () => {
    const mock = new GraphStoreMock();

    const edgeIds: unknown[] = [0];

    jest.spyOn(mock, "getNodeOutcomingEdgeIds").mockReturnValue(edgeIds);

    const store = new PublicGraphStore(mock);

    expect(store.getNodeOutcomingEdgeIds(1)).toBe(edgeIds);
  });

  it("should return specified node cycle edge ids", () => {
    const mock = new GraphStoreMock();

    const edgeIds: unknown[] = [0];

    jest.spyOn(mock, "getNodeCycleEdgeIds").mockReturnValue(edgeIds);

    const store = new PublicGraphStore(mock);

    expect(store.getNodeCycleEdgeIds(1)).toBe(edgeIds);
  });

  it("should return specified node adjacent edge ids", () => {
    const mock = new GraphStoreMock();

    const edgeIds: unknown[] = [0];

    jest.spyOn(mock, "getNodeAdjacentEdgeIds").mockReturnValue(edgeIds);

    const store = new PublicGraphStore(mock);

    expect(store.getNodeAdjacentEdgeIds(1)).toBe(edgeIds);
  });
});
