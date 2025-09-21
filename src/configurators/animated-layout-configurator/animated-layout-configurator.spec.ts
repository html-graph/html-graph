import { Canvas } from "@/canvas";
import { Graph } from "@/graph";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import { defaultCanvasParams, DummyAnimatedLayoutAlgorithm } from "@/mocks";
import { Viewport } from "@/viewport";
import { ViewportStore } from "@/viewport-store";
import { AnimatedLayoutConfigurator } from "./animated-layout-configurator";
import { Identifier } from "@/identifier";
import { EventSubject } from "@/event-subject";

const createCanvas = (): Canvas => {
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore();
  const element = document.createElement("div");
  const htmlView = new CoreHtmlView(graphStore, viewportStore, element);
  const graph = new Graph(graphStore);
  const viewport = new Viewport(viewportStore);

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

describe("AnimatedLayoutConfigurator", () => {
  const callbacks = new Set<(dtSec: number) => void>();
  const timer = new EventSubject<number>();

  timer.subscribe((dt) => {
    const p: Array<() => void> = [];

    callbacks.forEach((cb) => {
      p.push(() => {
        cb(dt);
      });
    });

    callbacks.clear();

    p.forEach((cb) => {
      cb();
    });
  });

  let spy: jest.SpyInstance<number, [callback: FrameRequestCallback], unknown>;

  beforeAll(() => {
    spy = jest.spyOn(window, "requestAnimationFrame");

    spy.mockImplementation((callback) => {
      callbacks.add(callback);

      return 0;
    });
  });

  afterAll(() => {
    spy.mockRestore();
  });

  it("should update node coordinates on second animation frame", async () => {
    const animationStaticNodes = new Set<Identifier>();
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 100,
      y: 100,
    });

    const algorithm = new DummyAnimatedLayoutAlgorithm();

    AnimatedLayoutConfigurator.configure(
      canvas,
      {
        algorithm,
        maxTimeDeltaSec: 0.1,
      },
      animationStaticNodes,
      window,
    );

    timer.emit(0);
    timer.emit(100);

    const { x, y } = canvas.graph.getNode("node-1")!;

    expect({ x, y }).toEqual({ x: 0, y: 0 });
  });

  it("should ignore steps above the time delta limit", async () => {
    const animationStaticNodes = new Set<Identifier>();
    const canvas = createCanvas();

    const algorithm = new DummyAnimatedLayoutAlgorithm();

    AnimatedLayoutConfigurator.configure(
      canvas,
      {
        algorithm,
        maxTimeDeltaSec: 0.05,
      },
      animationStaticNodes,
      window,
    );

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 100,
      y: 100,
    });

    timer.emit(0);
    timer.emit(100);

    const { x, y } = canvas.graph.getNode("node-1")!;

    expect({ x, y }).toEqual({ x: 100, y: 100 });
  });

  it("should not update node coordinates for node in the process of dragging", async () => {
    const animationStaticNodes = new Set<Identifier>();
    const canvas = createCanvas();

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 100,
      y: 100,
    });

    animationStaticNodes.add("node-1");

    const algorithm = new DummyAnimatedLayoutAlgorithm();

    AnimatedLayoutConfigurator.configure(
      canvas,
      {
        algorithm,
        maxTimeDeltaSec: 0.1,
      },
      animationStaticNodes,
      window,
    );

    timer.emit(0);
    timer.emit(100);

    const { x, y } = canvas.graph.getNode("node-1")!;

    expect({ x, y }).toEqual({ x: 100, y: 100 });
  });
});
