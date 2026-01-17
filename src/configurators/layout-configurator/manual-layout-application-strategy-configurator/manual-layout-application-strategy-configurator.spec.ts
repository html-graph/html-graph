import { Canvas } from "@/canvas";
import { ManualLayoutApplicationStrategyConfigurator } from "./manual-layout-application-strategy-configurator";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { Graph } from "@/graph";
import { Viewport } from "@/viewport";
import { CoreHtmlView, HtmlView, LayoutHtmlView } from "@/html-view";
import { defaultCanvasParams, DummyLayoutAlgorithm } from "@/mocks";
import { EventSubject } from "@/event-subject";
import { LayoutApplier } from "../../shared";

const createCanvas = (): Canvas => {
  const graphStore = new GraphStore();
  const element = document.createElement("div");
  const viewportStore = new ViewportStore(element);
  const graph = new Graph(graphStore);
  const viewport = new Viewport(viewportStore);
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

describe("ManualLayoutApplicationStrategyConfigurator", () => {
  it("should configure manual layout application strategy", () => {
    const canvas = createCanvas();
    const algorithm = new DummyLayoutAlgorithm();
    const trigger = new EventSubject<void>();
    const applier = new LayoutApplier(canvas, algorithm, {
      staticNodeResolver: (): boolean => false,
    });

    ManualLayoutApplicationStrategyConfigurator.configure(applier, trigger);

    canvas.addNode({ id: "node-1", element: document.createElement("div") });

    trigger.emit();

    const { x, y } = canvas.graph.getNode("node-1");

    expect({ x, y }).toEqual({ x: 0, y: 0 });
  });
});
