import { standardCenterFn } from "@/center-fn";
import { BezierEdgeShape } from "@/edges";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { CoreHtmlView } from "@/html-view";
import {
  createElement,
  createMouseMoveEvent,
  createMouseWheelEvent,
  createTouch,
  wait,
} from "@/mocks";
import { UserTransformableViewportCanvasController } from "./user-transformable-viewport-canvas-controller";
import { CoreCanvasController } from "../core-canvas-controller";
import { TransformOptions } from "./options";

let innerWidth: number;
let innerHeight: number;

const createController = (params?: {
  element?: HTMLElement;
  transformOptions?: TransformOptions;
}): {
  controller: UserTransformableViewportCanvasController;
  coreController: CoreCanvasController;
} => {
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore();
  const element = params?.element ?? document.createElement("div");

  const coreController = new CoreCanvasController(
    graphStore,
    viewportStore,
    new CoreHtmlView(graphStore, viewportStore, element),
  );

  const controller = new UserTransformableViewportCanvasController(
    coreController,
    element,
    params?.transformOptions,
  );

  return { coreController, controller };
};

describe("UserTransformableViewportCanvasController", () => {
  beforeEach(() => {
    innerWidth = window.innerWidth;
    innerHeight = window.innerHeight;

    window.innerWidth = 1500;
    window.innerHeight = 1200;
  });

  afterEach(() => {
    window.innerWidth = innerWidth;
    window.innerHeight = innerHeight;
  });

  it("should call addNode on controller", () => {
    const { coreController, controller } = createController();

    const spy = jest.spyOn(coreController, "addNode");

    controller.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    expect(spy).toHaveBeenCalled();
  });

  it("should call updateNode on controller", () => {
    const { coreController, controller } = createController();

    controller.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    const spy = jest.spyOn(coreController, "updateNode");

    controller.updateNode("node-1", {});

    expect(spy).toHaveBeenCalled();
  });

  it("should call removeNode on controller", () => {
    const { coreController, controller } = createController();

    controller.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    const spy = jest.spyOn(coreController, "removeNode");

    controller.removeNode("node-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should call markPort on controller", () => {
    const { coreController, controller } = createController();

    controller.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    const spy = jest.spyOn(coreController, "markPort");

    controller.markPort({
      id: "port-1",
      element: document.createElement("div"),
      nodeId: "node-1",
      direction: 0,
    });

    expect(spy).toHaveBeenCalled();
  });

  it("should call updatePort on controller", () => {
    const { coreController, controller } = createController();

    controller.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    controller.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    const spy = jest.spyOn(coreController, "updatePort");

    controller.updatePort("port-1", {});

    expect(spy).toHaveBeenCalled();
  });

  it("should call unmarkPort on controller", () => {
    const { coreController, controller } = createController();

    controller.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    controller.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });
    const spy = jest.spyOn(coreController, "unmarkPort");

    controller.unmarkPort("port-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should call addEdge on controller", () => {
    const { coreController, controller } = createController();

    controller.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    controller.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });
    const spy = jest.spyOn(coreController, "addEdge");

    controller.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new BezierEdgeShape(),
      priority: 0,
    });

    expect(spy).toHaveBeenCalled();
  });

  it("should call updateEdge on controller", () => {
    const { coreController, controller } = createController();

    controller.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    controller.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    controller.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new BezierEdgeShape(),
      priority: 0,
    });

    const spy = jest.spyOn(coreController, "updateEdge");

    controller.updateEdge("edge-1", {});

    expect(spy).toHaveBeenCalled();
  });

  it("should call removeEdge on controller", () => {
    const { coreController, controller } = createController();

    controller.addNode({
      id: "node-1",
      element: document.createElement("div"),
      x: 0,
      y: 0,
      centerFn: standardCenterFn,
      priority: 0,
    });

    controller.markPort({
      id: "port-1",
      nodeId: "node-1",
      element: document.createElement("div"),
      direction: 0,
    });

    controller.addEdge({
      id: "edge-1",
      from: "port-1",
      to: "port-1",
      shape: new BezierEdgeShape(),
      priority: 0,
    });

    const spy = jest.spyOn(coreController, "removeEdge");

    controller.removeEdge("edge-1");

    expect(spy).toHaveBeenCalled();
  });

  it("should call patchViewportMatrix on controller", () => {
    const { coreController, controller } = createController();

    const spy = jest.spyOn(coreController, "patchViewportMatrix");

    controller.patchViewportMatrix({});

    expect(spy).toHaveBeenCalled();
  });

  it("should call patchContentMatrix on controller", () => {
    const { coreController, controller } = createController();

    const spy = jest.spyOn(coreController, "patchContentMatrix");

    controller.patchContentMatrix({});

    expect(spy).toHaveBeenCalled();
  });

  it("should call clear on controller", () => {
    const { coreController, controller } = createController();

    const spy = jest.spyOn(coreController, "clear");

    controller.clear();

    expect(spy).toHaveBeenCalled();
  });

  it("should call destroy on controller", () => {
    const { coreController, controller } = createController();

    const spy = jest.spyOn(coreController, "destroy");

    controller.destroy();

    expect(spy).toHaveBeenCalled();
  });

  it("should set cursor on mouse down", () => {
    const element = createElement();
    createController({ element });

    element.dispatchEvent(new MouseEvent("mousedown"));

    expect(element.style.cursor).toBe("grab");
  });

  it("should not set cursor on right mouse button down", () => {
    const element = createElement();
    createController({ element });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 1 }));

    expect(element.style.cursor).toBe("");
  });

  it("should move controller with mouse", () => {
    const element = createElement({ width: 1000, height: 1000 });
    createController({ element });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({ movementX: 100, movementY: 100 });

    window.dispatchEvent(moveEvent);

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 100, 100)");
  });

  it("should call onBeforeTransformChange for move with mouse", () => {
    const onBeforeTransformChange = jest.fn((): void => {});
    const element = createElement({ width: 1000, height: 1000 });

    createController({
      element,
      transformOptions: {
        events: {
          onBeforeTransformChange,
        },
      },
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({ movementX: 100, movementY: 100 });

    window.dispatchEvent(moveEvent);

    expect(onBeforeTransformChange).toHaveBeenCalled();
  });

  it("should call onTransformChange for move with mouse", () => {
    const onTransformChange = jest.fn((): void => {});
    const element = createElement({ width: 1000, height: 1000 });

    createController({
      element,
      transformOptions: {
        events: {
          onTransformChange,
        },
      },
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({ movementX: 100, movementY: 100 });

    window.dispatchEvent(moveEvent);

    expect(onTransformChange).toHaveBeenCalled();
  });

  it("should unset cursor after move with mouse finished", () => {
    const onTransformFinished = jest.fn((): void => {});
    const element = createElement({ width: 1000, height: 1000 });

    createController({
      element,
      transformOptions: {
        events: {
          onTransformFinished,
        },
      },
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({ movementX: 100, movementY: 100 });

    window.dispatchEvent(moveEvent);
    window.dispatchEvent(new MouseEvent("mouseup", { button: 0 }));

    expect(element.style.cursor).toBe("");
  });

  it("should not move controller with mouse when pointer is outside of window", () => {
    const element = createElement({ width: 1000, height: 1000 });
    createController({ element });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({
      movementX: 100,
      movementY: 100,
      clientX: -100,
      clientY: 0,
    });

    window.dispatchEvent(moveEvent);

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 0, 0)");
  });

  it("should not move controller with mouse when pointer is inside window but outside of element", () => {
    const element = createElement({ width: 1000, height: 1000 });
    createController({ element });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({
      movementX: 100,
      movementY: 100,
      clientX: 1100,
      clientY: 0,
    });

    window.dispatchEvent(moveEvent);

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 0, 0)");
  });

  it("should not unset cursor left mouse button was not releaseed", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onTransformChange = jest.fn((): void => {});

    createController({
      element,
      transformOptions: {
        events: {
          onTransformChange,
        },
      },
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({ movementX: 100, movementY: 100 });

    window.dispatchEvent(moveEvent);
    window.dispatchEvent(new MouseEvent("mouseup", { button: 1 }));

    expect(element.style.cursor).toBe("grab");
  });

  it("should scale controller on mouse wheel scroll", () => {
    const coreController = createController();
    const controller = new UserTransformableViewportCanvasController(
      coreController,
    );
    const element = createElement({ width: 1000, height: 1000 });
    controller.attach(element);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    element.dispatchEvent(wheelEvent);
    const container = element.children[0].children[0] as HTMLElement;

    const expectedScale = 1 / 1.2;

    expect(container.style.transform).toBe(
      `matrix(${expectedScale}, 0, 0, ${expectedScale}, 0, 0)`,
    );
  });

  it("should scale down controller on mouse wheel scroll backward", () => {
    const coreController = createController();
    const controller = new UserTransformableViewportCanvasController(
      coreController,
    );
    const element = createElement({ width: 1000, height: 1000 });
    controller.attach(element);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: -1,
    });

    element.dispatchEvent(wheelEvent);
    const container = element.children[0].children[0] as HTMLElement;

    const expectedScale = 1.2;

    expect(container.style.transform).toBe(
      `matrix(${expectedScale}, 0, 0, ${expectedScale}, 0, 0)`,
    );
  });

  it("should prevent default event of wheel scroll", () => {
    const coreController = createController();
    const controller = new UserTransformableViewportCanvasController(
      coreController,
    );
    const element = createElement({ width: 1000, height: 1000 });
    controller.attach(element);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    const spy = jest.spyOn(wheelEvent, "preventDefault");

    element.dispatchEvent(wheelEvent);

    expect(spy).toHaveBeenCalled();
  });

  it("should call start event on mouse wheel scroll", () => {
    const coreController = createController();

    const onTransformStarted = jest.fn();
    const controller = new UserTransformableViewportCanvasController(
      coreController,
      {
        events: {
          onTransformStarted: onTransformStarted,
        },
      },
    );
    const element = createElement({ width: 1000, height: 1000 });
    controller.attach(element);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    element.dispatchEvent(wheelEvent);

    expect(onTransformStarted).toHaveBeenCalled();
  });

  it("should call finish event on mouse wheel scroll", async () => {
    const coreController = createController();

    const onTransformFinished = jest.fn();
    const controller = new UserTransformableViewportCanvasController(
      coreController,
      {
        events: {
          onTransformFinished: onTransformFinished,
        },
      },
    );
    const element = createElement({ width: 1000, height: 1000 });
    controller.attach(element);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    element.dispatchEvent(wheelEvent);

    await wait(500);
    expect(onTransformFinished).toHaveBeenCalled();
  });

  it("should call finish after 500ms span without events", async () => {
    const coreController = createController();

    const onTransformFinished = jest.fn();
    const controller = new UserTransformableViewportCanvasController(
      coreController,
      {
        events: {
          onTransformFinished: onTransformFinished,
        },
      },
    );
    const element = createElement({ width: 1000, height: 1000 });
    controller.attach(element);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    element.dispatchEvent(wheelEvent);

    await wait(100);
    element.dispatchEvent(wheelEvent);
    await wait(500);

    expect(onTransformFinished).toHaveBeenCalledTimes(1);
  });

  it("should call start before finish on wheel scale", async () => {
    const coreController = createController();

    const onTransformStarted = jest.fn();
    const controller = new UserTransformableViewportCanvasController(
      coreController,
      {
        events: {
          onTransformStarted: onTransformStarted,
        },
      },
    );
    const element = createElement({ width: 1000, height: 1000 });
    controller.attach(element);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    element.dispatchEvent(wheelEvent);
    await wait(100);
    element.dispatchEvent(wheelEvent);
    await wait(500);

    expect(onTransformStarted).toHaveBeenCalledTimes(1);
  });

  it("should move controller with touch", () => {
    const coreController = createController();
    const controller = new UserTransformableViewportCanvasController(
      coreController,
    );
    const element = createElement({ width: 1000, height: 1000 });

    controller.attach(element);

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 100, 100)");
  });

  it("should stop movement on touchend", () => {
    const coreController = createController();
    const controller = new UserTransformableViewportCanvasController(
      coreController,
    );
    const element = createElement({ width: 1000, height: 1000 });

    controller.attach(element);

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    window.dispatchEvent(new TouchEvent("touchend"));

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 200, clientY: 200 })],
      }),
    );

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 100, 100)");
  });

  it("should stop movement on touchcancel", () => {
    const coreController = createController();
    const controller = new UserTransformableViewportCanvasController(
      coreController,
    );
    const element = createElement({ width: 1000, height: 1000 });

    controller.attach(element);

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    window.dispatchEvent(new TouchEvent("touchcancel"));

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 200, clientY: 200 })],
      }),
    );

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 100, 100)");
  });

  it("should not dispatch onTransformStarted for next touch", () => {
    const coreController = createController();
    const onTransformStarted = jest.fn();
    const controller = new UserTransformableViewportCanvasController(
      coreController,
      {
        events: {
          onTransformStarted: onTransformStarted,
        },
      },
    );
    const element = createElement({ width: 1000, height: 1000 });

    controller.attach(element);

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [
          createTouch({ clientX: 0, clientY: 0 }),
          createTouch({ clientX: 10, clientY: 10 }),
        ],
      }),
    );

    expect(onTransformStarted).toHaveReturnedTimes(1);
  });

  it("should handle touch gracefully if element gets detached in the process", async () => {
    const coreController = createController();
    const controller = new UserTransformableViewportCanvasController(
      coreController,
    );
    const element = createElement({ width: 1000, height: 1000 });

    controller.attach(element);

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    controller.detach();

    expect(() => {
      window.dispatchEvent(
        new TouchEvent("touchmove", {
          touches: [createTouch({ clientX: 100, clientY: 100 })],
        }),
      );
    }).not.toThrow();
  });

  it("should not move controller if touch is outside of window", () => {
    const coreController = createController();
    const controller = new UserTransformableViewportCanvasController(
      coreController,
    );
    const element = createElement({ width: 1000, height: 1000 });

    controller.attach(element);

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: -100, clientY: 0 })],
      }),
    );

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 0, 0)");
  });

  it("should not move controller if touch is outside of controller", () => {
    const coreController = createController();
    const controller = new UserTransformableViewportCanvasController(
      coreController,
    );
    const element = createElement({ width: 1000, height: 1000 });

    controller.attach(element);

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 1600, clientY: 0 })],
      }),
    );

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 0, 0)");
  });

  it("should move and scale controller with two touches", () => {
    const coreController = createController();
    const controller = new UserTransformableViewportCanvasController(
      coreController,
    );
    const element = createElement({ width: 1000, height: 1000 });

    controller.attach(element);

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [
          createTouch({ clientX: 0, clientY: 0 }),
          createTouch({ clientX: 100, clientY: 0 }),
        ],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [
          createTouch({ clientX: 0, clientY: 0 }),
          createTouch({ clientX: 200, clientY: 0 }),
        ],
      }),
    );

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(2, 0, 0, 2, 50, 0)");
  });

  it("should keep moving controller after move touches ended", () => {
    const coreController = createController();
    const controller = new UserTransformableViewportCanvasController(
      coreController,
    );
    const element = createElement({ width: 1000, height: 1000 });

    controller.attach(element);

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [
          createTouch({ clientX: 0, clientY: 0 }),
          createTouch({ clientX: 100, clientY: 0 }),
        ],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchend", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 200, clientY: 0 })],
      }),
    );

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 200, 0)");
  });

  it("should call onTransformStarted for move with mouse", () => {
    const coreController = createController();
    const onTransformStarted = jest.fn((): void => {});

    const controller = new UserTransformableViewportCanvasController(
      coreController,
      {
        events: {
          onTransformStarted: onTransformStarted,
        },
      },
    );

    const element = createElement({ width: 1000, height: 1000 });

    controller.attach(element);

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    expect(onTransformStarted).toHaveBeenCalled();
  });

  it("should call onTransformStarted for move with touch", () => {
    const coreController = createController();
    const onTransformStarted = jest.fn((): void => {});

    const controller = new UserTransformableViewportCanvasController(
      coreController,
      {
        events: {
          onTransformStarted: onTransformStarted,
        },
      },
    );

    const element = createElement({ width: 1000, height: 1000 });

    controller.attach(element);

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    expect(onTransformStarted).toHaveBeenCalled();
  });

  it("should call onTransformFinished on finish move with mouse", () => {
    const coreController = createController();
    const onTransformFinished = jest.fn((): void => {});

    const controller = new UserTransformableViewportCanvasController(
      coreController,
      {
        events: {
          onTransformFinished: onTransformFinished,
        },
      },
    );

    const element = createElement({ width: 1000, height: 1000 });

    controller.attach(element);

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
    window.dispatchEvent(new MouseEvent("mouseup", { button: 0 }));

    expect(onTransformFinished).toHaveBeenCalled();
  });

  it("should call onTransformFinished on finish move with touch", () => {
    const coreController = createController();
    const onTransformFinished = jest.fn((): void => {});

    const controller = new UserTransformableViewportCanvasController(
      coreController,
      {
        events: {
          onTransformFinished: onTransformFinished,
        },
      },
    );

    const element = createElement({ width: 1000, height: 1000 });

    controller.attach(element);

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(new TouchEvent("touchend"));

    expect(onTransformFinished).toHaveBeenCalled();
  });

  it("should not scale controller if mouse wheel event not valid", () => {
    const coreController = createController();
    const controller = new UserTransformableViewportCanvasController(
      coreController,
      {
        scale: {
          mouseWheelEventVerifier: (event: WheelEvent): boolean =>
            event.ctrlKey,
        },
      },
    );

    const element = createElement({ width: 1000, height: 1000 });
    controller.attach(element);

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    element.dispatchEvent(wheelEvent);
    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe(`matrix(1, 0, 0, 1, 0, 0)`);
  });

  it("should call resize start event on host element resize", () => {
    const coreController = createController();

    const onResizeTransformStarted = jest.fn();
    const controller = new UserTransformableViewportCanvasController(
      coreController,
      {
        events: {
          onResizeTransformStarted,
        },
      },
    );

    const element = createElement({ width: 1000, height: 1000 });
    controller.attach(element);

    expect(onResizeTransformStarted).toHaveBeenCalledTimes(1);
  });

  it("should call resize finish event on host element resize", () => {
    const coreController = createController();

    const onResizeTransformFinished = jest.fn();
    const controller = new UserTransformableViewportCanvasController(
      coreController,
      {
        events: {
          onResizeTransformFinished,
        },
      },
    );

    const element = createElement({ width: 1000, height: 1000 });
    controller.attach(element);

    expect(onResizeTransformFinished).toHaveBeenCalledTimes(1);
  });
});
