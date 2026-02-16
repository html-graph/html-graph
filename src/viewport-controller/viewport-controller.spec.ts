import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { ViewportController } from "./viewport-controller";
import { createElement } from "@/mocks";
import { standardCenterFn } from "@/center-fn";
import { ViewportControllerParams } from "./viewport-controller-params";

const createViewportController = (options?: {
  element?: HTMLElement;
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
      contentOffset: 100,
      minContentScale: 0,
    },
  };

  const viewportController = new ViewportController(
    graphStore,
    viewportStore,
    params,
  );

  return { viewportController, graphStore, viewportStore };
};

describe("ViewportController", () => {
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

  it("should account for default focus content offset", () => {
    const element = createElement({ width: 100, height: 100 });
    const { viewportController, graphStore, viewportStore } =
      createViewportController({
        element,
      });
    const nodeElement = createElement();

    graphStore.addNode({
      id: "node-1",
      element: nodeElement,
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    viewportController.focus();

    expect(viewportStore.getContentMatrix()).toEqual({
      scale: 0.5,
      x: 50,
      y: 50,
    });
  });

  it("should account for specified focus content offset", () => {
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

    viewportController.focus({ contentOffset: 200 });

    expect(viewportStore.getContentMatrix()).toEqual({
      scale: 0.25,
      x: 50,
      y: 50,
    });
  });

  it("should account for specified focus nodes", () => {
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

  it("should account for specified focus minimum content scale", () => {
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
      x: 0,
      y: 0,
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
});
