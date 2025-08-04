import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { CoreHtmlView } from "@/html-view";
import {
  createElement,
  createMouseMoveEvent,
  createMouseWheelEvent,
  createTouch,
  defaultCanvasParams,
  wait,
} from "@/mocks";
import { Canvas } from "@/canvas";
import { UserTransformableViewportConfigurator } from "./user-transformable-viewport-configurator";
import { TransformPreprocessorFn } from "./transform-preprocessor-fn";
import { MouseEventVerifier } from "../shared";
import { TransformableViewportParams } from "./transformable-viewport-params";
import { TransformPayload } from "./transform-payload";

let innerWidth: number;
let innerHeight: number;

const createCanvas = (options?: {
  element?: HTMLElement;
  wheelSensitivity?: number;
  onTransformStarted?: () => void;
  onTransformFinished?: () => void;
  onBeforeTransformChange?: () => void;
  onTransformChange?: () => void;
  onResizeTransformStarted?: () => void;
  onResizeTransformFinished?: () => void;
  transformPreprocessor?: TransformPreprocessorFn;
  shiftCursor?: string | null;
  mouseDownEventVerifier?: MouseEventVerifier;
  mouseUpEventVerifier?: MouseEventVerifier;
  mouseWheelEventVerifier?: (event: WheelEvent) => boolean;
  scaleWheelFinishTimeout?: number;
}): Canvas => {
  const graphStore = new GraphStore<number>();
  const viewportStore = new ViewportStore();
  const element = options?.element ?? document.createElement("div");
  const htmlView = new CoreHtmlView(graphStore, viewportStore, element);

  const canvas = new Canvas(
    graphStore,
    viewportStore,
    htmlView,
    defaultCanvasParams,
  );

  const params: TransformableViewportParams = {
    wheelSensitivity: options?.wheelSensitivity ?? 1.2,
    onTransformStarted: options?.onTransformStarted ?? ((): void => {}),
    onTransformFinished: options?.onTransformFinished ?? ((): void => {}),
    onBeforeTransformChange:
      options?.onBeforeTransformChange ?? ((): void => {}),
    onTransformChange: options?.onTransformChange ?? ((): void => {}),
    onResizeTransformStarted:
      options?.onResizeTransformStarted ?? ((): void => {}),
    onResizeTransformFinished:
      options?.onResizeTransformFinished ?? ((): void => {}),
    transformPreprocessor:
      options?.transformPreprocessor ??
      ((transform): TransformPayload => transform.nextTransform),
    shiftCursor: options?.shiftCursor ?? "grab",
    mouseDownEventVerifier:
      options?.mouseDownEventVerifier ??
      ((event: MouseEvent): boolean => event.button === 0),
    mouseUpEventVerifier:
      options?.mouseUpEventVerifier ??
      ((event: MouseEvent): boolean => event.button === 0),
    mouseWheelEventVerifier:
      options?.mouseWheelEventVerifier ?? ((): boolean => true),
    scaleWheelFinishTimeout: options?.scaleWheelFinishTimeout ?? 500,
  };

  UserTransformableViewportConfigurator.configure(
    canvas,
    element,
    window,
    params,
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

  it("should move viewport with mouse", () => {
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
      onBeforeTransformChange,
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
      onTransformChange,
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
      onTransformFinished,
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({ movementX: 100, movementY: 100 });

    window.dispatchEvent(moveEvent);
    window.dispatchEvent(new MouseEvent("mouseup", { button: 0 }));

    expect(element.style.cursor).toBe("");
  });

  it("should not move viewport with mouse when pointer is outside of window", () => {
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

  it("should not move viewport with mouse when pointer is inside window but outside of element", () => {
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
      onTransformChange,
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const moveEvent = createMouseMoveEvent({ movementX: 100, movementY: 100 });

    window.dispatchEvent(moveEvent);
    window.dispatchEvent(new MouseEvent("mouseup", { button: 1 }));

    expect(element.style.cursor).toBe("grab");
  });

  it("should scale viewport on mouse wheel scroll", () => {
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

  it("should scale down viewport on mouse wheel scroll backward", () => {
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
      onTransformStarted,
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
      onTransformFinished,
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
      onTransformFinished,
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
      onTransformStarted,
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

  it("should move viewport with touch", () => {
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
      onTransformStarted,
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

  it("should not move viewport if touch is outside of window", () => {
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

  it("should not move viewport if touch is outside of viewport", () => {
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

  it("should move and scale viewport with two touches", () => {
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

  it("should keep moving viewport after move touches ended", () => {
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
      onTransformStarted: onTransformStarted,
    });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    expect(onTransformStarted).toHaveBeenCalled();
  });

  it("should call onTransformStarted for move with touch", () => {
    const onTransformStarted = jest.fn((): void => {});

    const element = createElement({ width: 1000, height: 1000 });
    createCanvas({
      element,
      onTransformStarted: onTransformStarted,
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
      onTransformFinished,
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
      onTransformFinished,
    });

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    window.dispatchEvent(new TouchEvent("touchend"));

    expect(onTransformFinished).toHaveBeenCalled();
  });

  it("should not scale viewport if mouse wheel event not valid", () => {
    const element = createElement({ width: 1000, height: 1000 });

    createCanvas({
      element,
      mouseWheelEventVerifier: (event: WheelEvent): boolean => event.ctrlKey,
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
      onResizeTransformStarted,
    });

    expect(onResizeTransformStarted).toHaveBeenCalledTimes(1);
  });

  it("should call resize finish event on host element resize", () => {
    const onResizeTransformFinished = jest.fn((): void => {});

    const element = createElement({ width: 1000, height: 1000 });
    createCanvas({
      element,
      onResizeTransformFinished,
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
      onTransformFinished,
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

  it("should not move viewport with mouse after canvas destroy", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });

    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    canvas.destroy();

    const moveEvent = createMouseMoveEvent({ movementX: 100, movementY: 100 });

    window.dispatchEvent(moveEvent);

    expect(canvas.viewport.getViewportMatrix()).toEqual({
      scale: 1,
      x: 0,
      y: 0,
    });
  });

  it("should not move viewport with touch after canvas destroy", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    canvas.destroy();

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    expect(canvas.viewport.getViewportMatrix()).toEqual({
      scale: 1,
      x: 0,
      y: 0,
    });
  });
});
