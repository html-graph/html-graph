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
import { TransformOptions } from "./options";
import { Canvas } from "@/canvas";
import { UserTransformableViewportConfigurator } from "./user-transformable-viewport-configurator";

let innerWidth: number;
let innerHeight: number;

const createCanvas = (params?: {
  element?: HTMLElement;
  transformOptions?: TransformOptions;
}): Canvas => {
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore();
  const element = params?.element ?? document.createElement("div");
  const htmlView = new CoreHtmlView(graphStore, viewportStore, element);

  const canvas = new Canvas(element, graphStore, viewportStore, htmlView, {});

  UserTransformableViewportConfigurator.configure(
    canvas,
    params?.transformOptions ?? {},
  );

  return canvas;
};

describe("UserTransformableViewportConfigurator", () => {
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

  it("should set cursor on mouse down", () => {
    const element = createElement();
    createCanvas({ element });

    element.dispatchEvent(new MouseEvent("mousedown"));

    expect(element.style.cursor).toBe("grab");
  });

  it("should not set cursor on right mouse button down", () => {
    const element = createElement();
    createCanvas({ element });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 1 }));

    expect(element.style.cursor).toBe("");
  });

  it("should move controller with mouse", () => {
    const element = createElement({ width: 1000, height: 1000 });
    createCanvas({ element });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({ movementX: 100, movementY: 100 });

    window.dispatchEvent(moveEvent);

    const container = element.children[0].children[0] as HTMLElement;

    expect(container.style.transform).toBe("matrix(1, 0, 0, 1, 100, 100)");
  });

  it("should call onBeforeTransformChange for move with mouse", () => {
    const onBeforeTransformChange = jest.fn((): void => {});
    const element = createElement({ width: 1000, height: 1000 });

    createCanvas({
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

    createCanvas({
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

    createCanvas({
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
    createCanvas({ element });

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
    createCanvas({ element });

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

  it("should not unset cursor left mouse button was not released", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onTransformChange = jest.fn((): void => {});

    createCanvas({
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
    const element = createElement({ width: 1000, height: 1000 });
    createCanvas({ element });

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
    const element = createElement({ width: 1000, height: 1000 });
    createCanvas({ element });

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
    const element = createElement({ width: 1000, height: 1000 });
    createCanvas({ element });

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
    const onTransformStarted = jest.fn();
    const element = createElement({ width: 1000, height: 1000 });

    createCanvas({
      element,
      transformOptions: {
        events: {
          onTransformStarted,
        },
      },
    });

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    element.dispatchEvent(wheelEvent);

    expect(onTransformStarted).toHaveBeenCalled();
  });

  it("should call finish event on mouse wheel scroll", async () => {
    const onTransformFinished = jest.fn();
    const element = createElement({ width: 1000, height: 1000 });

    createCanvas({
      element,
      transformOptions: {
        events: {
          onTransformFinished,
        },
      },
    });

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
    const onTransformFinished = jest.fn();
    const element = createElement({ width: 1000, height: 1000 });

    createCanvas({
      element,
      transformOptions: {
        events: {
          onTransformFinished,
        },
      },
    });

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
    const onTransformStarted = jest.fn();
    const element = createElement({ width: 1000, height: 1000 });

    createCanvas({
      element,
      transformOptions: {
        events: {
          onTransformStarted,
        },
      },
    });

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
    const element = createElement({ width: 1000, height: 1000 });
    createCanvas({ element });

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
    const element = createElement({ width: 1000, height: 1000 });
    createCanvas({ element });

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
    const element = createElement({ width: 1000, height: 1000 });
    createCanvas({ element });

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
    const onTransformStarted = jest.fn();
    const element = createElement({ width: 1000, height: 1000 });

    createCanvas({
      element,
      transformOptions: {
        events: {
          onTransformStarted,
        },
      },
    });

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

  it("should not move controller if touch is outside of window", () => {
    const element = createElement({ width: 1000, height: 1000 });
    createCanvas({ element });

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
    const element = createElement({ width: 1000, height: 1000 });
    createCanvas({ element });

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
    const element = createElement({ width: 1000, height: 1000 });
    createCanvas({ element });

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
    const element = createElement({ width: 1000, height: 1000 });
    createCanvas({ element });

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
    const onTransformStarted = jest.fn((): void => {});

    const element = createElement({ width: 1000, height: 1000 });
    createCanvas({
      element,
      transformOptions: {
        events: {
          onTransformStarted: onTransformStarted,
        },
      },
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    expect(onTransformStarted).toHaveBeenCalled();
  });

  it("should call onTransformStarted for move with touch", () => {
    const onTransformStarted = jest.fn((): void => {});

    const element = createElement({ width: 1000, height: 1000 });
    createCanvas({
      element,
      transformOptions: {
        events: {
          onTransformStarted: onTransformStarted,
        },
      },
    });

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    expect(onTransformStarted).toHaveBeenCalled();
  });

  it("should call onTransformFinished on finish move with mouse", () => {
    const onTransformFinished = jest.fn((): void => {});

    const element = createElement({ width: 1000, height: 1000 });
    createCanvas({
      element,
      transformOptions: {
        events: {
          onTransformFinished,
        },
      },
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
    window.dispatchEvent(new MouseEvent("mouseup", { button: 0 }));

    expect(onTransformFinished).toHaveBeenCalled();
  });

  it("should call onTransformFinished on finish move with touch", () => {
    const onTransformFinished = jest.fn((): void => {});

    const element = createElement({ width: 1000, height: 1000 });
    createCanvas({
      element,
      transformOptions: {
        events: {
          onTransformFinished,
        },
      },
    });

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(new TouchEvent("touchend"));

    expect(onTransformFinished).toHaveBeenCalled();
  });

  it("should not scale controller if mouse wheel event not valid", () => {
    const element = createElement({ width: 1000, height: 1000 });

    createCanvas({
      element,
      transformOptions: {
        scale: {
          mouseWheelEventVerifier: (event: WheelEvent): boolean =>
            event.ctrlKey,
        },
      },
    });

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
    const onResizeTransformStarted = jest.fn((): void => {});

    const element = createElement({ width: 1000, height: 1000 });
    createCanvas({
      element,
      transformOptions: {
        events: {
          onResizeTransformStarted,
        },
      },
    });

    expect(onResizeTransformStarted).toHaveBeenCalledTimes(1);
  });

  it("should call resize finish event on host element resize", () => {
    const onResizeTransformFinished = jest.fn((): void => {});

    const element = createElement({ width: 1000, height: 1000 });
    createCanvas({
      element,
      transformOptions: {
        events: {
          onResizeTransformFinished,
        },
      },
    });

    expect(onResizeTransformFinished).toHaveBeenCalledTimes(1);
  });

  it("should unsubscribe before destroy", () => {
    const canvas = createCanvas();

    canvas.destroy();
  });

  it("should not call onTransformFinished while scaling with wheel but also dragging in progress", async () => {
    const onTransformFinished = jest.fn((): void => {});

    const element = createElement({ width: 1000, height: 1000 });
    createCanvas({
      element,
      transformOptions: {
        events: {
          onTransformFinished,
        },
      },
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const wheelEvent = createMouseWheelEvent({
      clientX: 0,
      clientY: 0,
      deltaY: 1,
    });

    element.dispatchEvent(wheelEvent);

    await wait(1000);

    expect(onTransformFinished).not.toHaveBeenCalled();
  });
});
