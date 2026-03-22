import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { ViewportController } from "./viewport-controller";
import { AnimationFrameMock, createElement, waitMicrotask } from "@/mocks";
import { standardCenterFn } from "@/center-fn";
import { ViewportControllerParams } from "./viewport-controller-params";
import {
  immediateScheduleFn,
  microtaskScheduleFn,
  ScheduleFn,
} from "@/schedule-fn";

const createViewportController = (options?: {
  element?: HTMLElement;
  contentPadding?: number;
  minContentScale?: number;
  schedule?: ScheduleFn;
}): {
  viewportController: ViewportController;
  graphStore: GraphStore;
  viewportStore: ViewportStore;
} => {
  const element = options?.element ?? document.createElement("div");
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore(element);

  const params: ViewportControllerParams = {
    focus: {
      contentPadding: options?.contentPadding ?? 0,
      minContentScale: options?.minContentScale ?? 0,
      schedule: options?.schedule ?? immediateScheduleFn,
      animationDuration: 0,
    },
  };

  const viewportController = new ViewportController(
    graphStore,
    viewportStore,
    params,
    window,
  );

  return { viewportController, graphStore, viewportStore };
};

describe("ViewportController", () => {
  const animationMock = new AnimationFrameMock();

  beforeEach(() => {
    animationMock.hook();
  });

  afterEach(() => {
    animationMock.unhook();
  });

  it("should patch viewport matrix", () => {
    const element = document.createElement("div");
    const { viewportController, viewportStore } = createViewportController({
      element,
    });

    viewportController.patchViewportMatrix({ scale: 2, x: 3, y: 4 });

    expect(viewportStore.getViewportMatrix()).toEqual({ scale: 2, x: 3, y: 4 });
  });

  it("should patch content matrix", () => {
    const element = document.createElement("div");
    const { viewportController, viewportStore } = createViewportController({
      element,
    });

    viewportController.patchContentMatrix({ scale: 2, x: 3, y: 4 });

    expect(viewportStore.getContentMatrix()).toEqual({ scale: 2, x: 3, y: 4 });
  });

  it("should account for focus content padding", () => {
    const element = createElement({ width: 100, height: 100 });
    const { viewportController, graphStore, viewportStore } =
      createViewportController({ element });
    const nodeElement = createElement();

    graphStore.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    viewportController.focus({ contentPadding: 200 });

    expect(viewportStore.getContentMatrix()).toEqual({
      scale: 0.25,
      x: 50,
      y: 50,
    });
  });

  it("should account for focus nodes", () => {
    const element = createElement({ width: 200, height: 200 });
    const { viewportController, graphStore, viewportStore } =
      createViewportController({
        element,
      });

    graphStore.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addNode({
      id: "node-2",
      element: createElement(),
      x: 200,
      y: 200,
      centerFn: standardCenterFn,
      priority: 0,
    });

    viewportController.focus({ nodes: ["node-1"] });

    expect(viewportStore.getContentMatrix()).toEqual({
      scale: 1,
      x: 100,
      y: 100,
    });
  });

  it("should account for focus minimum content scale", () => {
    const element = createElement({ width: 200, height: 200 });
    const { viewportController, graphStore, viewportStore } =
      createViewportController({ element });

    graphStore.addNode({
      id: "node-1",
      element: createElement(),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addNode({
      id: "node-2",
      element: createElement(),
      x: 200,
      y: 200,
      centerFn: standardCenterFn,
      priority: 0,
    });

    viewportController.focus({ minContentScale: 1 });

    expect(viewportStore.getContentMatrix()).toEqual({
      scale: 1,
      x: -0,
      y: -0,
    });
  });

  it("should destroy viewport store on controller destroy", () => {
    const element = document.createElement("div");
    const { viewportController, viewportStore } = createViewportController({
      element,
    });

    const spy = jest.spyOn(viewportStore, "destroy");

    viewportController.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should keep content matrix as is when no nodes", () => {
    const element = createElement();
    const { viewportController, viewportStore } = createViewportController({
      element,
    });

    viewportStore.patchContentMatrix({ scale: 2, x: 3, y: 4 });

    viewportController.focus();

    expect(viewportStore.getContentMatrix()).toEqual({ scale: 2, x: 3, y: 4 });
  });

  it("should set content matrix to have single node in the center", () => {
    const element = createElement({ width: 200, height: 200 });
    const { viewportController, viewportStore, graphStore } =
      createViewportController({ element });

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    viewportController.focus();

    expect(viewportStore.getContentMatrix()).toEqual({
      scale: 1,
      x: 100,
      y: 100,
    });
  });

  it("should keep content matrix scale", () => {
    const element = createElement({ width: 200, height: 200 });
    const { viewportController, viewportStore, graphStore } =
      createViewportController({ element });

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 100,
      y: 100,
      centerFn: standardCenterFn,
      priority: 0,
    });

    viewportStore.patchViewportMatrix({ scale: 2 });

    viewportController.focus();

    expect(viewportStore.getContentMatrix()).toEqual({
      scale: 0.5,
      x: 50,
      y: 50,
    });
  });

  it("should calculate content matrix to have two nodes content in the center", () => {
    const element = createElement({ width: 200, height: 200 });
    const { viewportController, viewportStore, graphStore } =
      createViewportController({ element });

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addNode({
      id: "node-2",
      element: document.createElement("div"),
      x: 100,
      y: 100,
      centerFn: standardCenterFn,
      priority: 0,
    });

    viewportController.focus();

    expect(viewportStore.getContentMatrix()).toEqual({
      scale: 1,
      x: 50,
      y: 50,
    });
  });

  it("should account for scale when has two nodes", () => {
    const element = createElement({ width: 200, height: 200 });
    const { viewportController, viewportStore, graphStore } =
      createViewportController({ element });

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addNode({
      id: "node-2",
      element: document.createElement("div"),
      x: 100,
      y: 100,
      centerFn: standardCenterFn,
      priority: 0,
    });

    viewportStore.patchViewportMatrix({ scale: 2 });

    viewportController.focus();

    expect(viewportStore.getContentMatrix()).toEqual({
      scale: 0.5,
      x: 75,
      y: 75,
    });
  });

  it("should adjust viewport scale when current scale doesn't fit horizontally", () => {
    const element = createElement({ width: 200, height: 200 });
    const { viewportController, viewportStore, graphStore } =
      createViewportController({ element });

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addNode({
      id: "node-2",
      element: document.createElement("div"),
      x: 1000,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    viewportController.focus();

    expect(viewportStore.getContentMatrix()).toEqual({
      scale: 0.2,
      x: -0,
      y: 100,
    });
  });

  it("should adjust viewport scale when current scale doesn't fit vertically", () => {
    const element = createElement({ width: 200, height: 200 });
    const { viewportController, viewportStore, graphStore } =
      createViewportController({ element });

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addNode({
      id: "node-2",
      element: document.createElement("div"),
      x: 0,
      y: 1000,
      centerFn: standardCenterFn,
      priority: 0,
    });

    viewportController.focus();

    expect(viewportStore.getContentMatrix()).toEqual({
      scale: 0.2,
      x: 100,
      y: -0,
    });
  });

  it("should focus only specified nodes", () => {
    const element = createElement({ width: 200, height: 200 });
    const { viewportController, viewportStore, graphStore } =
      createViewportController({ element });

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addNode({
      id: "node-2",
      element: document.createElement("div"),
      x: 100,
      y: 100,
      centerFn: standardCenterFn,
      priority: 0,
    });

    viewportController.focus({
      nodes: ["node-1"],
    });

    expect(viewportStore.getContentMatrix()).toEqual({
      scale: 1,
      x: 100,
      y: 100,
    });
  });

  it("should limit minimum content scale", () => {
    const element = createElement({ width: 200, height: 200 });
    const { viewportController, viewportStore, graphStore } =
      createViewportController({ element });

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addNode({
      id: "node-2",
      element: document.createElement("div"),
      x: 0,
      y: 1000,
      centerFn: standardCenterFn,
      priority: 0,
    });

    viewportController.focus({
      minContentScale: 0.5,
    });

    expect(viewportStore.getContentMatrix()).toEqual({
      scale: 0.5,
      x: 100,
      y: -150,
    });
  });

  it("should regard for specified schedule function", async () => {
    const element = createElement({ width: 200, height: 200 });
    const { viewportController, viewportStore, graphStore } =
      createViewportController({ element, schedule: microtaskScheduleFn });

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    viewportController.focus();

    expect(viewportStore.getContentMatrix()).toEqual({
      scale: 1,
      x: 0,
      y: 0,
    });

    await waitMicrotask();

    expect(viewportStore.getContentMatrix()).toEqual({
      scale: 1,
      x: 100,
      y: 100,
    });
  });

  it("should center viewport at specified point", async () => {
    const element = createElement({ width: 200, height: 200 });
    const { viewportController, viewportStore } = createViewportController({
      element,
    });

    viewportController.center({ x: 200, y: 200 });

    expect(viewportStore.getContentMatrix()).toEqual({
      scale: 1,
      x: -100,
      y: -100,
    });
  });

  it("should scale centered viewport", () => {
    const element = createElement({ width: 200, height: 200 });
    const { viewportController, viewportStore } = createViewportController({
      element,
    });

    viewportController.center({ x: 200, y: 200 }, { contentScale: 0.5 });

    expect(viewportStore.getContentMatrix()).toEqual({
      scale: 0.5,
      x: -0,
      y: -0,
    });
  });

  it("should account for over the limit current scale when limiting minimum content scale", () => {
    const element = createElement({ width: 200, height: 200 });
    const { viewportController, viewportStore, graphStore } =
      createViewportController({ element });

    graphStore.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    graphStore.addNode({
      id: "node-2",
      element: document.createElement("div"),
      x: 0,
      y: 1000,
      centerFn: standardCenterFn,
      priority: 0,
    });

    viewportController.patchContentMatrix({ scale: 10 });
    viewportController.focus({ minContentScale: 0.5 });

    expect(viewportStore.getContentMatrix()).toEqual({
      scale: 0.5,
      x: 100,
      y: -150,
    });
  });

  it("should start animation when duration provided", () => {
    const element = createElement({ width: 200, height: 200 });
    const { viewportController, viewportStore } = createViewportController({
      element,
    });

    viewportController.center({ x: 200, y: 200 }, { animationDuration: 200 });

    expect(viewportStore.getContentMatrix()).toEqual({
      scale: 1,
      x: 0,
      y: 0,
    });
  });

  it("should end animation when duration provided", () => {
    const element = createElement({ width: 200, height: 200 });
    const { viewportController, viewportStore } = createViewportController({
      element,
    });

    viewportController.center({ x: 200, y: 200 }, { animationDuration: 200 });

    animationMock.timer.emit(0);
    animationMock.timer.emit(200);

    expect(viewportStore.getContentMatrix()).toEqual({
      scale: 1,
      x: -100,
      y: -100,
    });
  });

  it("should start focus animation when duration provided", () => {
    const element = createElement({ width: 100, height: 100 });
    const { viewportController, graphStore, viewportStore } =
      createViewportController({ element });
    const nodeElement = createElement();

    graphStore.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    viewportController.focus({ animationDuration: 200 });

    expect(viewportStore.getContentMatrix()).toEqual({
      scale: 1,
      x: 0,
      y: 0,
    });
  });
});
