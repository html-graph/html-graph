import { createCanvas } from "@/mocks";
import { GraphComponentsPartitioner } from "./graph-components-partitioner";

describe("GraphComponentsPartitioner", () => {
  it("should return single component", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    const partitioner = new GraphComponentsPartitioner(canvas.graph);

    const expected = [new Set(["node-1"])];

    expect(partitioner.createComponents()).toEqual(expected);
  });

  it("should return separate components for not connected nodes", () => {
    const canvas = createCanvas();

    canvas
      .addNode({
        id: "node-1",
        element: document.createElement("div"),
      })
      .addNode({
        id: "node-2",
        element: document.createElement("div"),
      });

    const partitioner = new GraphComponentsPartitioner(canvas.graph);

    const expected = [new Set(["node-1"]), new Set(["node-2"])];

    expect(partitioner.createComponents()).toEqual(expected);
  });

  it("should return single component for two connected nodes", () => {
    const canvas = createCanvas();

    canvas
      .addNode({
        id: "node-1",
        element: document.createElement("div"),
        ports: [{ id: "node-1", element: document.createElement("div") }],
      })
      .addNode({
        id: "node-2",
        element: document.createElement("div"),
        ports: [{ id: "node-2", element: document.createElement("div") }],
      })
      .addEdge({ from: "node-1", to: "node-2" });

    const partitioner = new GraphComponentsPartitioner(canvas.graph);

    const expected = [new Set(["node-1", "node-2"])];

    expect(partitioner.createComponents()).toEqual(expected);
  });

  it("should add further nodes to component", () => {
    const canvas = createCanvas();

    canvas
      .addNode({
        id: "node-1",
        element: document.createElement("div"),
        ports: [{ id: "node-1", element: document.createElement("div") }],
      })
      .addNode({
        id: "node-2",
        element: document.createElement("div"),
        ports: [{ id: "node-2", element: document.createElement("div") }],
      })
      .addNode({
        id: "node-3",
        element: document.createElement("div"),
        ports: [{ id: "node-3", element: document.createElement("div") }],
      })
      .addEdge({ from: "node-1", to: "node-2" })
      .addEdge({ from: "node-2", to: "node-3" });

    const partitioner = new GraphComponentsPartitioner(canvas.graph);

    const expected = [new Set(["node-1", "node-2", "node-3"])];

    expect(partitioner.createComponents()).toEqual(expected);
  });

  it("should add node with incoming edge to component", () => {
    const canvas = createCanvas();

    canvas
      .addNode({
        id: "node-1",
        element: document.createElement("div"),
        ports: [{ id: "node-1", element: document.createElement("div") }],
      })
      .addNode({
        id: "node-2",
        element: document.createElement("div"),
        ports: [{ id: "node-2", element: document.createElement("div") }],
      })
      .addNode({
        id: "node-3",
        element: document.createElement("div"),
        ports: [{ id: "node-3", element: document.createElement("div") }],
      })
      .addEdge({ from: "node-1", to: "node-2" })
      .addEdge({ from: "node-3", to: "node-2" });

    const partitioner = new GraphComponentsPartitioner(canvas.graph);

    const expected = [new Set(["node-1", "node-2", "node-3"])];

    expect(partitioner.createComponents()).toEqual(expected);
  });
});
