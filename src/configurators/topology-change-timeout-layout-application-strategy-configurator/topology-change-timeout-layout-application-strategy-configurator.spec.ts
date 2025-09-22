import { Canvas } from "@/canvas";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { Graph } from "@/graph";
import { Viewport } from "@/viewport";
import { CoreHtmlView, HtmlView, LayoutHtmlView } from "@/html-view";
import { defaultCanvasParams, wait } from "@/mocks";
import { DummyLayoutAlgorithm } from "@/mocks";
import { TopologyChangeTimeoutLayoutApplicationStrategyConfigurator } from "./topology-change-timeout-layout-application-strategy-configurator";

const createCanvas = (): Canvas => {
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore();
  const graph = new Graph(graphStore);
  const viewport = new Viewport(viewportStore);
  const element = document.createElement("div");
  let htmlView: HtmlView = new CoreHtmlView(graphStore, viewportStore, element);
  htmlView = new LayoutHtmlView(htmlView, graphStore);

  const canvas = new Canvas(
    graph,
    viewport,
    graphStore,
    viewportStore,
    htmlView,
    defaultCanvasParams,
  );

  return canvas;
};

describe("TopologyChangeLayoutApplicationStrategyConfigurator", () => {
  it("should apply layout on adding a new node", async () => {
    const canvas = createCanvas();
    const algorithm = new DummyLayoutAlgorithm();

    TopologyChangeTimeoutLayoutApplicationStrategyConfigurator.configure(
      canvas,
      algorithm,
    );

    canvas.addNode({ id: "node-1", element: document.createElement("div") });

    await wait(0);

    const { x, y } = canvas.graph.getNode("node-1")!;
    expect({ x, y }).toEqual({ x: 0, y: 0 });
  });

  it("should apply layout on removing node", async () => {
    const canvas = createCanvas();
    const algorithm = new DummyLayoutAlgorithm();

    TopologyChangeTimeoutLayoutApplicationStrategyConfigurator.configure(
      canvas,
      algorithm,
    );

    canvas.addNode({ id: "node-1", element: document.createElement("div") });
    canvas.addNode({ id: "node-2", element: document.createElement("div") });

    await wait(0);

    canvas.updateNode("node-1", { x: 100, y: 100 });
    canvas.removeNode("node-2");

    await wait(0);

    const { x, y } = canvas.graph.getNode("node-1")!;
    expect({ x, y }).toEqual({ x: 0, y: 0 });
  });

  it("should apply layout on adding new edge", async () => {
    const canvas = createCanvas();
    const algorithm = new DummyLayoutAlgorithm();

    TopologyChangeTimeoutLayoutApplicationStrategyConfigurator.configure(
      canvas,
      algorithm,
    );

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      ports: [
        {
          id: "port-1",
          element: document.createElement("div"),
        },
      ],
    });

    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-1" });

    await wait(0);

    const { x, y } = canvas.graph.getNode("node-1")!;
    expect({ x, y }).toEqual({ x: 0, y: 0 });
  });

  it("should apply layout on edge remove", async () => {
    const canvas = createCanvas();
    const algorithm = new DummyLayoutAlgorithm();

    TopologyChangeTimeoutLayoutApplicationStrategyConfigurator.configure(
      canvas,
      algorithm,
    );

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      ports: [
        {
          id: "port-1",
          element: document.createElement("div"),
        },
      ],
    });

    canvas.addEdge({ id: "edge-1", from: "port-1", to: "port-1" });

    await wait(0);

    canvas.updateNode("node-1", { x: 100, y: 100 });
    canvas.removeEdge("edge-1");

    await wait(0);

    const { x, y } = canvas.graph.getNode("node-1")!;
    expect({ x, y }).toEqual({ x: 0, y: 0 });
  });
});
