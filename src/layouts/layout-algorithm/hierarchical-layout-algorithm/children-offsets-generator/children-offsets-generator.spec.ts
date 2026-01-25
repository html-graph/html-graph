import { createCanvas } from "@/mocks";
import { ChildrenOffsetsGenerator } from "./children-offsets-generator";
import { WidthFirstSpanningForestGenerator } from "../width-first-spanning-forest-generator";

describe("ChildrenOffsetsGenerator", () => {
  it("should zero offset when node is root", () => {
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
    });

    const forestGenerator = new WidthFirstSpanningForestGenerator(canvas.graph);
    const [tree] = forestGenerator.generate();
    const generator = new ChildrenOffsetsGenerator(tree, {
      spaceAroundRadius: 50,
    });

    const result = generator.generate();
    const offset = result.get("node-1");

    expect(offset).toEqual(0);
  });

  it("should set offset to zero for single child node", () => {
    const canvas = createCanvas();

    canvas
      .addNode({
        id: "node-1",
        element: document.createElement("div"),
        ports: [{ id: "port-1", element: document.createElement("div") }],
      })
      .addNode({
        id: "node-2",
        element: document.createElement("div"),
        ports: [{ id: "port-2", element: document.createElement("div") }],
      })
      .addEdge({ from: "port-1", to: "port-2" });

    const forestGenerator = new WidthFirstSpanningForestGenerator(canvas.graph);
    const [tree] = forestGenerator.generate();
    const generator = new ChildrenOffsetsGenerator(tree, {
      spaceAroundRadius: 50,
    });

    const result = generator.generate();
    const offset = result.get("node-2");

    expect(offset).toEqual(0);
  });

  // it("should offset node by radius when node has two children", () => {
  //   /**
  //    *   /\
  //    */
  //   const canvas = createCanvas();

  //   canvas
  //     .addNode({
  //       id: "node-1",
  //       element: document.createElement("div"),
  //       ports: [{ id: "port-1", element: document.createElement("div") }],
  //     })
  //     .addNode({
  //       id: "node-2",
  //       element: document.createElement("div"),
  //       ports: [{ id: "port-2", element: document.createElement("div") }],
  //     })
  //     .addNode({
  //       id: "node-3",
  //       element: document.createElement("div"),
  //       ports: [{ id: "port-3", element: document.createElement("div") }],
  //     })
  //     .addEdge({ from: "port-1", to: "port-2" })
  //     .addEdge({ from: "port-1", to: "port-3" });

  //   const forestGenerator = new WidthFirstSpanningForestGenerator(canvas.graph);
  //   const [tree] = forestGenerator.generate();
  //   const generator = new ChildrenOffsetsGenerator(tree, {
  //     spaceAroundRadius: 50,
  //   });

  //   const result = generator.generate();
  //   const offset = result.get("node-2");

  //   expect(offset).toEqual(-50);
  // });
});
