// import { EdgeShapeMock } from "@/edges";
// import { EdgePayload, GraphStore } from "../graph-store";
// import { GraphNode } from "./graph-node";
// import { GraphPort } from "./graph-port";
// import { PublicGraphStore } from "./public-graph-store";

// describe("PublicGraphStore", () => {
//   it("should return null when no node in store", () => {
//     const store = new GraphStore();

//     const publicStore = new PublicGraphStore(store);

//     expect(publicStore.getNode(1)).toBe(null);
//   });

//   it("should return specified node", () => {
//     const store = new GraphStore();

//     const node: GraphNode = {
//       element: document.createElement("div"),
//       x: 0,
//       y: 0,
//       centerFn: () => ({ x: 0, y: 0 }),
//       priority: 0,
//     };

//     store.addNode(
//       1,
//       node.element,
//       node.x,
//       node.y,
//       node.centerFn,
//       node.priority,
//     );

//     jest.spyOn(store, "getNode").mockReturnValue(node);

//     const publicStore = new PublicGraphStore(store);

//     expect(publicStore.getNode(1)).toStrictEqual(node);
//   });

//   it("should return specified node ids", () => {
//     const store = new GraphStore();

//     const node: GraphNode = {
//       element: document.createElement("div"),
//       x: 0,
//       y: 0,
//       centerFn: () => ({ x: 0, y: 0 }),
//       priority: 0,
//     };

//     store.addNode(
//       0,
//       node.element,
//       node.x,
//       node.y,
//       node.centerFn,
//       node.priority,
//     );

//     const publicStore = new PublicGraphStore(store);

//     expect(publicStore.getAllNodeIds()).toEqual([0]);
//   });

//   it("should return null for no port in store", () => {
//     const mock = new GraphStore();

//     const publicStore = new PublicGraphStore(mock);

//     expect(publicStore.getPort(1)).toBe(null);
//   });

//   it("should return specified port", () => {
//     const store = new GraphStore();

//     const node: GraphNode = {
//       element: document.createElement("div"),
//       x: 0,
//       y: 0,
//       centerFn: () => ({ x: 0, y: 0 }),
//       priority: 0,
//     };

//     const port: GraphPort = {
//       element: document.createElement("div"),
//       centerFn: () => ({ x: 0, y: 0 }),
//       direction: 0,
//     };

//     store.addNode(
//       0,
//       node.element,
//       node.x,
//       node.y,
//       node.centerFn,
//       node.priority,
//     );

//     store.addPort(1, port.element, 0, port.centerFn, port.direction);

//     const publicStore = new PublicGraphStore(store);

//     expect(publicStore.getPort(1)).toStrictEqual(port);
//   });

//   it("should return specified port ids", () => {
//     const store = new GraphStore();

//     const node: GraphNode = {
//       element: document.createElement("div"),
//       x: 0,
//       y: 0,
//       centerFn: () => ({ x: 0, y: 0 }),
//       priority: 0,
//     };

//     const port: GraphPort = {
//       element: document.createElement("div"),
//       centerFn: () => ({ x: 0, y: 0 }),
//       direction: 0,
//     };

//     store.addNode(
//       0,
//       node.element,
//       node.x,
//       node.y,
//       node.centerFn,
//       node.priority,
//     );

//     store.addPort(1, port.element, 0, port.centerFn, port.direction);

//     const publicStore = new PublicGraphStore(store);

//     expect(publicStore.getAllPortIds()).toBe([1]);
//   });

//   it("should return specified node port ids", () => {
//     const store = new GraphStore();

//     const node: GraphNode = {
//       element: document.createElement("div"),
//       x: 0,
//       y: 0,
//       centerFn: () => ({ x: 0, y: 0 }),
//       priority: 0,
//     };

//     const port: GraphPort = {
//       element: document.createElement("div"),
//       centerFn: () => ({ x: 0, y: 0 }),
//       direction: 0,
//     };

//     store.addNode(
//       0,
//       node.element,
//       node.x,
//       node.y,
//       node.centerFn,
//       node.priority,
//     );

//     store.addPort(1, port.element, 0, port.centerFn, port.direction);

//     const publicStore = new PublicGraphStore(store);

//     expect(publicStore.getNodePortIds(0)).toEqual([1]);
//   });

//   it("should return undefined when no node in store", () => {
//     const store = new GraphStore();

//     const publicStore = new PublicGraphStore(store);

//     expect(publicStore.getPortNodeId(1)).toBe(null);
//   });

//   it("should return specified port node id", () => {
//     const store = new GraphStore();

//     const node: GraphNode = {
//       element: document.createElement("div"),
//       x: 0,
//       y: 0,
//       centerFn: () => ({ x: 0, y: 0 }),
//       priority: 0,
//     };

//     const port: GraphPort = {
//       element: document.createElement("div"),
//       centerFn: () => ({ x: 0, y: 0 }),
//       direction: 0,
//     };

//     store.addNode(
//       0,
//       node.element,
//       node.x,
//       node.y,
//       node.centerFn,
//       node.priority,
//     );

//     store.addPort(1, port.element, 0, port.centerFn, port.direction);

//     const publicStore = new PublicGraphStore(store);

//     expect(publicStore.getPortNodeId(1)).toEqual(0);
//   });

//   it("should return specified edge ids", () => {
//     const store = new GraphStore();

//     const edgeIds: unknown[] = [0];

//     jest.spyOn(store, "getAllEdgeIds").mockReturnValue(edgeIds);

//     const publicStore = new PublicGraphStore(store);

//     expect(publicStore.getAllEdgeIds()).toBe(edgeIds);
//   });

//   it("should return null for no edge in store", () => {
//     const mock = new GraphStore();

//     jest.spyOn(mock, "getEdge").mockReturnValue(undefined);

//     const store = new PublicGraphStore(mock);

//     expect(store.getEdge(1)).toBe(null);
//   });

//   it("should return specified edge", () => {
//     const mock = new GraphStore();

//     const edge: EdgePayload = {
//       shape: new EdgeShapeMock(),
//       from: 1,
//       to: 2,
//       priority: 0,
//     };

//     jest.spyOn(mock, "getEdge").mockReturnValue(edge);

//     const store = new PublicGraphStore(mock);

//     expect(store.getEdge(1)).toStrictEqual({
//       from: edge.from,
//       to: edge.to,
//       priority: edge.priority,
//     });
//   });

//   it("should return specified port incoming edge ids", () => {
//     const mock = new GraphStore();

//     const edgeIds: unknown[] = [0];

//     jest.spyOn(mock, "getPortIncomingEdgeIds").mockReturnValue(edgeIds);

//     const store = new PublicGraphStore(mock);

//     expect(store.getPortIncomingEdgeIds(1)).toBe(edgeIds);
//   });

//   it("should return specified port outcoming edge ids", () => {
//     const mock = new GraphStore();

//     const edgeIds: unknown[] = [0];

//     jest.spyOn(mock, "getPortOutcomingEdgeIds").mockReturnValue(edgeIds);

//     const store = new PublicGraphStore(mock);

//     expect(store.getPortOutcomingEdgeIds(1)).toBe(edgeIds);
//   });

//   it("should return specified port cycle edge ids", () => {
//     const mock = new GraphStore();

//     const edgeIds: unknown[] = [0];

//     jest.spyOn(mock, "getPortCycleEdgeIds").mockReturnValue(edgeIds);

//     const store = new PublicGraphStore(mock);

//     expect(store.getPortCycleEdgeIds(1)).toBe(edgeIds);
//   });

//   it("should return specified port adjacent edge ids", () => {
//     const mock = new GraphStore();

//     const edgeIds: unknown[] = [0];

//     jest.spyOn(mock, "getPortAdjacentEdgeIds").mockReturnValue(edgeIds);

//     const store = new PublicGraphStore(mock);

//     expect(store.getPortAdjacentEdgeIds(1)).toBe(edgeIds);
//   });

//   it("should return specified node incoming edge ids", () => {
//     const mock = new GraphStore();

//     const edgeIds: unknown[] = [0];

//     jest.spyOn(mock, "getNodeIncomingEdgeIds").mockReturnValue(edgeIds);

//     const store = new PublicGraphStore(mock);

//     expect(store.getNodeIncomingEdgeIds(1)).toBe(edgeIds);
//   });

//   it("should return specified node outcoming edge ids", () => {
//     const mock = new GraphStore();

//     const edgeIds: unknown[] = [0];

//     jest.spyOn(mock, "getNodeOutcomingEdgeIds").mockReturnValue(edgeIds);

//     const store = new PublicGraphStore(mock);

//     expect(store.getNodeOutcomingEdgeIds(1)).toBe(edgeIds);
//   });

//   it("should return specified node cycle edge ids", () => {
//     const mock = new GraphStore();

//     const edgeIds: unknown[] = [0];

//     jest.spyOn(mock, "getNodeCycleEdgeIds").mockReturnValue(edgeIds);

//     const store = new PublicGraphStore(mock);

//     expect(store.getNodeCycleEdgeIds(1)).toBe(edgeIds);
//   });

//   it("should return specified node adjacent edge ids", () => {
//     const mock = new GraphStore();

//     const edgeIds: unknown[] = [0];

//     jest.spyOn(mock, "getNodeAdjacentEdgeIds").mockReturnValue(edgeIds);

//     const store = new PublicGraphStore(mock);

//     expect(store.getNodeAdjacentEdgeIds(1)).toBe(edgeIds);
//   });
// });
