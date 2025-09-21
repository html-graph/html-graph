import { Canvas } from "@/canvas";
import { Graph } from "@/graph";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import {
  defaultCanvasParams,
  DummyAnimatedLayoutAlgorithm,
  wait,
} from "@/mocks";
import { Viewport } from "@/viewport";
import { ViewportStore } from "@/viewport-store";
import { AnimatedLayoutConfigurator } from "./animated-layout-configurator";
import { Identifier } from "@/identifier";

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
  let spy: jest.SpyInstance<number, [callback: FrameRequestCallback], unknown>;

  beforeEach(() => {
    spy = jest.spyOn(window, "requestAnimationFrame");

    let t = 0;

    spy.mockImplementation((callback) => {
      (async (): Promise<void> => {
        await wait(50);
        callback(t);
        t += 50;
      })();

      return 0;
    });
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it("should request first animation frame", () => {
    const animationStaticNodes = new Set<Identifier>();
    const canvas = createCanvas();

    AnimatedLayoutConfigurator.configure(
      canvas,
      {
        algorithm: new DummyAnimatedLayoutAlgorithm(),
        maxTimeDeltaSec: 0.1,
      },
      animationStaticNodes,
    );

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should request second animation frame", async () => {
    const animationStaticNodes = new Set<Identifier>();
    const canvas = createCanvas();

    const spy = jest.spyOn(window, "requestAnimationFrame");

    AnimatedLayoutConfigurator.configure(
      canvas,
      {
        algorithm: new DummyAnimatedLayoutAlgorithm(),
        maxTimeDeltaSec: 0.1,
      },
      animationStaticNodes,
    );

    await wait(49);

    expect(spy).toHaveBeenCalledTimes(2);
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
        maxTimeDeltaSec: 0.2,
      },
      animationStaticNodes,
    );

    await wait(150);

    const { x, y } = canvas.graph.getNode("node-1")!;

    expect({ x, y }).toEqual({ x: 0, y: 0 });
  });

  it("should ignore timestamps above the limit", async () => {
    const animationStaticNodes = new Set<Identifier>();
    const canvas = createCanvas();

    const algorithm = new DummyAnimatedLayoutAlgorithm();

    AnimatedLayoutConfigurator.configure(
      canvas,
      {
        algorithm,
        maxTimeDeltaSec: 0.01,
      },
      animationStaticNodes,
    );

    canvas.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 100,
      y: 100,
    });

    await wait(101);

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
        maxTimeDeltaSec: 0.2,
      },
      animationStaticNodes,
    );

    await wait(101);

    const { x, y } = canvas.graph.getNode("node-1")!;

    expect({ x, y }).toEqual({ x: 100, y: 100 });
  });
});
