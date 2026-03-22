import { Canvas } from "@/canvas";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { Graph } from "@/graph";
import { Viewport } from "@/viewport";
import { CoreHtmlView, HtmlView, LayoutHtmlView } from "@/html-view";
import {
  defaultGraphControllerParams,
  defaultViewportControllerParams,
  waitMacrotask,
} from "@/mocks";
import { LayoutParams } from "./layout-params";
import { DummyLayoutAlgorithm } from "@/mocks";
import { LayoutConfigurator } from "./layout-configurator";
import { EventSubject } from "@/event-subject";
import { GraphController } from "@/graph-controller";
import { ViewportController } from "@/viewport-controller";
import { macrotaskScheduleFn, microtaskScheduleFn } from "@/schedule-fn";

const createCanvas = (): Canvas => {
  const graphStore = new GraphStore();
  const element = document.createElement("div");
  const viewportStore = new ViewportStore(element);
  const graph = new Graph(graphStore);
  const viewport = new Viewport(viewportStore);
  let htmlView: HtmlView = new CoreHtmlView(graphStore, viewportStore, element);
  htmlView = new LayoutHtmlView(htmlView, graphStore);

  const graphController = new GraphController(
    graphStore,
    htmlView,
    defaultGraphControllerParams,
  );

  const viewportController = new ViewportController(
    graphStore,
    viewportStore,
    defaultViewportControllerParams,
    window,
  );

  const canvas = new Canvas(
    graph,
    viewport,
    graphController,
    viewportController,
  );

  return canvas;
};

describe("LayoutConfigurator", () => {
  it("should configure topology change schedule layout application strategy", async () => {
    const canvas = createCanvas();
    const config: LayoutParams = {
      algorithm: new DummyLayoutAlgorithm(),
      applyOn: {
        type: "topologyChangeSchedule",
        schedule: microtaskScheduleFn,
      },
      staticNodeResolver: () => false,
      onBeforeApplied: (): void => {},
      onAfterApplied: (): void => {},
    };

    LayoutConfigurator.configure(canvas, config);

    canvas.addNode({ id: "node-1", element: document.createElement("div") });

    await waitMacrotask(0);

    const { x, y } = canvas.graph.getNode("node-1");
    expect({ x, y }).toEqual({ x: 0, y: 0 });
  });

  it("should configure trigger layout application strategy", () => {
    const canvas = createCanvas();
    const trigger = new EventSubject<void>();
    const config: LayoutParams = {
      algorithm: new DummyLayoutAlgorithm(),
      applyOn: { type: "trigger", trigger },
      staticNodeResolver: () => false,
      onBeforeApplied: (): void => {},
      onAfterApplied: (): void => {},
    };

    LayoutConfigurator.configure(canvas, config);

    canvas.addNode({ id: "node-1", element: document.createElement("div") });

    trigger.emit();

    const { x, y } = canvas.graph.getNode("node-1");

    expect({ x, y }).toEqual({ x: 0, y: 0 });
  });

  it("should account for specified static nodes", () => {
    const canvas = createCanvas();
    const trigger = new EventSubject<void>();
    const config: LayoutParams = {
      algorithm: new DummyLayoutAlgorithm(),
      applyOn: { type: "trigger", trigger },
      staticNodeResolver: (nodeId) => nodeId === "node-1",
      onBeforeApplied: (): void => {},
      onAfterApplied: (): void => {},
    };

    LayoutConfigurator.configure(canvas, config);

    canvas.addNode({ id: "node-1", element: document.createElement("div") });

    trigger.emit();

    const { x } = canvas.graph.getNode("node-1");

    expect(x).toBe(null);
  });

  it("should emit onBeforeApplied event", async () => {
    const canvas = createCanvas();
    const onBeforeApplied = jest.fn();
    const config: LayoutParams = {
      algorithm: new DummyLayoutAlgorithm(),
      applyOn: {
        type: "topologyChangeSchedule",
        schedule: macrotaskScheduleFn,
      },
      staticNodeResolver: () => false,
      onBeforeApplied,
      onAfterApplied: (): void => {},
    };

    LayoutConfigurator.configure(canvas, config);

    canvas.addNode({ id: "node-1", element: document.createElement("div") });

    await waitMacrotask(0);

    expect(onBeforeApplied).toHaveBeenCalled();
  });

  it("should emit onAfterApplied event", async () => {
    const canvas = createCanvas();
    const onAfterApplied = jest.fn();
    const config: LayoutParams = {
      algorithm: new DummyLayoutAlgorithm(),
      applyOn: {
        type: "topologyChangeSchedule",
        schedule: macrotaskScheduleFn,
      },
      staticNodeResolver: () => false,
      onBeforeApplied: (): void => {},
      onAfterApplied,
    };

    LayoutConfigurator.configure(canvas, config);

    canvas.addNode({ id: "node-1", element: document.createElement("div") });

    await waitMacrotask(0);

    expect(onAfterApplied).toHaveBeenCalled();
  });
});
