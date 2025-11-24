import { standardCenterFn } from "@/center-fn";
import { Graph } from "@/graph";
import { GraphStore } from "@/graph-store";
import { createCurrentCoordinates } from "./create-current-coordinates";

describe("createCurrentCoordinates", () => {
  it("should set single node coordinates to maximum of specified edge length", () => {
    const graphStore = new GraphStore();
    const graph = new Graph(graphStore);

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: null,
      y: null,
      centerFn: standardCenterFn,
      priority: 0,
    });

    const coords = createCurrentCoordinates(graph, () => 1, 10);

    expect(coords).toEqual(new Map([["node-1", { x: 10, y: 10 }]]));
  });

  it("should keep existing node coordinates when specified", () => {
    const graphStore = new GraphStore();
    const graph = new Graph(graphStore);

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 5,
      y: 5,
      centerFn: standardCenterFn,
      priority: 0,
    });

    const coords = createCurrentCoordinates(graph, () => 1, 10);

    expect(coords).toEqual(new Map([["node-1", { x: 5, y: 5 }]]));
  });

  it("should limit node coordinates to square root of nodes count", () => {
    const graphStore = new GraphStore();
    const graph = new Graph(graphStore);

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: null,
      y: null,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addNode({
      id: "node-2",
      element: document.createElement("div"),
      x: null,
      y: null,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addNode({
      id: "node-3",
      element: document.createElement("div"),
      x: null,
      y: null,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addNode({
      id: "node-4",
      element: document.createElement("div"),
      x: null,
      y: null,
      centerFn: standardCenterFn,
      priority: 0,
    });

    const coords = createCurrentCoordinates(graph, () => 1, 10);

    expect(coords).toEqual(
      new Map([
        ["node-1", { x: 20, y: 20 }],
        ["node-2", { x: 20, y: 20 }],
        ["node-3", { x: 20, y: 20 }],
        ["node-4", { x: 20, y: 20 }],
      ]),
    );
  });
});
