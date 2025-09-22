import { Canvas } from "@/canvas";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { Graph } from "@/graph";
import { Viewport } from "@/viewport";
import { CoreHtmlView, HtmlView, LayoutHtmlView } from "@/html-view";
import { defaultCanvasParams, wait } from "@/mocks";
import { LayoutParams } from "./layout-config";
import { DummyLayoutAlgorithm } from "@/mocks";
import { LayoutConfigurator } from "./layout-configurator";
import { EventSubject } from "@/event-subject";

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

describe("LayoutConfigurator", () => {
  it("should configure topology change layout application strategy", async () => {
    const canvas = createCanvas();
    const config: LayoutParams = {
      algorithm: new DummyLayoutAlgorithm(),
      applyOn: { type: "topologyChangeTimeout" },
    };

    LayoutConfigurator.configure(canvas, config);

    canvas.addNode({ id: "node-1", element: document.createElement("div") });

    await wait(0);

    const { x, y } = canvas.graph.getNode("node-1")!;
    expect({ x, y }).toEqual({ x: 0, y: 0 });
  });

  it("should configure manual layout application strategy", () => {
    const canvas = createCanvas();
    const trigger = new EventSubject<void>();
    const config: LayoutParams = {
      algorithm: new DummyLayoutAlgorithm(),
      applyOn: { type: "manual", trigger },
    };

    LayoutConfigurator.configure(canvas, config);

    canvas.addNode({ id: "node-1", element: document.createElement("div") });

    trigger.emit();

    const { x, y } = canvas.graph.getNode("node-1")!;

    expect({ x, y }).toEqual({ x: 0, y: 0 });
  });
});
