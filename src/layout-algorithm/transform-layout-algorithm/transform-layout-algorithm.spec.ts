import { DummyLayoutAlgorithm } from "@/mocks/dummy-layout-algorithm.mock";
import { TransformLayoutAlgorithm } from "./transform-layout-algorithm";
import { GraphStore } from "@/graph-store";
import { Graph } from "@/graph";
import { standardCenterFn } from "@/center-fn";

describe("TransformLayoutAlgorithm", () => {
  it("should apply specified transformation", () => {
    const baseAlgorithm = new DummyLayoutAlgorithm();

    const graphStore = new GraphStore();

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: null,
      y: null,
      centerFn: standardCenterFn,
      priority: 0,
    });

    const graph = new Graph(graphStore);

    const algorithm = new TransformLayoutAlgorithm({
      baseAlgorithm,
      matrix: {
        a: 1,
        b: 0,
        c: 100,
        d: 0,
        e: 1,
        f: 100,
      },
    });

    const coords = algorithm.calculateCoordinates(graph);
    const point = coords.get("node-1")!;

    expect(point).toEqual({ x: 100, y: 100 });
  });
});
