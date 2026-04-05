import { createCanvas } from "@/mocks";
import { adjacentNextLayerNodesResolver } from "./adjacent-next-layer-nodes-resolver";

describe("adjacentNextLayerNodesResolver", () => {
  it("should return empty array when node has no adjacent nodes", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    const nextNodes = adjacentNextLayerNodesResolver({
      graph: canvas.graph,
      currentNodeId: "node-1",
    });

    expect(nextNodes).toEqual(new Set());
  });

  it("should return outgoing nodes", () => {
    const canvas = createCanvas();

    canvas
      .addNode({
        id: "node-1",
        element: document.createElement("div"),
        ports: [
          {
            id: "port-1",
            element: document.createElement("div"),
          },
        ],
      })
      .addNode({
        id: "node-2",
        element: document.createElement("div"),
        ports: [
          {
            id: "port-2",
            element: document.createElement("div"),
          },
        ],
      })
      .addEdge({ from: "port-1", to: "port-2" });

    const nextNodes = adjacentNextLayerNodesResolver({
      graph: canvas.graph,
      currentNodeId: "node-1",
    });

    expect(nextNodes).toEqual(new Set(["node-2"]));
  });

  it("should return incoming nodes", () => {
    const canvas = createCanvas();

    canvas
      .addNode({
        id: "node-1",
        element: document.createElement("div"),
        ports: [
          {
            id: "port-1",
            element: document.createElement("div"),
          },
        ],
      })
      .addNode({
        id: "node-2",
        element: document.createElement("div"),
        ports: [
          {
            id: "port-2",
            element: document.createElement("div"),
          },
        ],
      })
      .addEdge({ from: "port-2", to: "port-1" });

    const nextNodes = adjacentNextLayerNodesResolver({
      graph: canvas.graph,
      currentNodeId: "node-1",
    });

    expect(nextNodes).toEqual(new Set(["node-2"]));
  });
});
