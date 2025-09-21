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

    spy.mockImplementation((cb) => {
      setTimeout(() => {
        cb(100);
      }, 100);

      return 0;
    });
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it("should request first animation frame", () => {
    const animationStaticNodes = new Set<Identifier>();
    const canvas = createCanvas();

    const spy = jest.spyOn(window, "requestAnimationFrame");

    AnimatedLayoutConfigurator.configure(
      canvas,
      {
        algorithm: new DummyAnimatedLayoutAlgorithm(),
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
      },
      animationStaticNodes,
    );

    await wait(100);

    expect(spy).toHaveBeenCalledTimes(2);
  });

  //   it("should calculate coordinates on second animation frame", async () => {
  //     const animationStaticNodes = new Set<Identifier>();
  //     const canvas = createCanvas();

  //     const algorithm = new DummyAnimatedLayoutAlgorithm();

  //     AnimatedLayoutConfigurator.configure(
  //       canvas,
  //       {
  //         algorithm,
  //       },
  //       animationStaticNodes,
  //     );

  //     const spy = jest.spyOn(algorithm, "calculateNextCoordinates");
  //     await wait(0);

  //     expect(spy).toHaveBeenCalled();
  //   });
});
