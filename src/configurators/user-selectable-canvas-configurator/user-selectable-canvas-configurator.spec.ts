import {
  createElement,
  createTouch,
  defaultGraphControllerParams,
  defaultViewportControllerParams,
} from "@/mocks";
import { UserSelectableCanvasConfigurator } from "./user-selectable-canvas-configurator";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { Canvas } from "@/canvas";
import { CoreHtmlView } from "@/html-view";
import { Graph } from "@/graph";
import { Viewport } from "@/viewport";
import { GraphController } from "@/graph-controller";
import { ViewportController } from "@/viewport-controller";
import { EventTagger, PointInsideVerifier, selectionHandled } from "../shared";

const createCanvas = (options?: {
  element?: HTMLElement;
  onCanvasSelected?: () => void;
  mouseDownEventVerifier?: (event: MouseEvent) => boolean;
  mouseUpEventVerifier?: (event: MouseEvent) => boolean;
  movementThreshold?: number;
}): Canvas => {
  const graphStore = new GraphStore();
  const element = options?.element ?? document.createElement("div");
  const viewportStore = new ViewportStore(element);
  const htmlView = new CoreHtmlView(graphStore, viewportStore, element);
  const graph = new Graph(graphStore);
  const viewport = new Viewport(viewportStore);

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

  const pointInsideVerifier = new PointInsideVerifier(element, window);

  UserSelectableCanvasConfigurator.configure(
    canvas,
    element,
    window,
    pointInsideVerifier,
    new EventTagger(),
    {
      onCanvasSelected: options?.onCanvasSelected ?? ((): void => {}),
      movementThreshold: options?.movementThreshold ?? 10,
      mouseDownEventVerifier:
        options?.mouseDownEventVerifier ?? ((): boolean => true),
      mouseUpEventVerifier:
        options?.mouseUpEventVerifier ?? ((): boolean => true),
    },
  );

  return canvas;
};

describe("UserSelectableCanvasConfigurator", () => {
  it("should call specified callback on canvas mouse grab and immediate release", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onCanvasSelected = jest.fn();

    createCanvas({ element, onCanvasSelected });

    element.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onCanvasSelected).toHaveBeenCalled();
  });

  it("should not call specified callback when event was tagged as handled", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onCanvasSelected = jest.fn();

    createCanvas({ element, onCanvasSelected });

    element.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    const event = new MouseEvent("mouseup");

    const eventTagger = new EventTagger();
    eventTagger.tag(event, selectionHandled);

    window.dispatchEvent(event);

    expect(onCanvasSelected).not.toHaveBeenCalled();
  });

  it("should restore window mouse up listener on mouse selection finish", () => {
    const element = createElement({ width: 1000, height: 1000 });

    createCanvas({ element });

    element.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    const spy = jest.spyOn(window, "removeEventListener");

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(spy).toHaveBeenCalledWith("mouseup", expect.anything());
    spy.mockClear();
  });

  it("should restore window mouse move listener on mouse selection finish", () => {
    const element = createElement({ width: 1000, height: 1000 });

    createCanvas({ element });

    element.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    const spy = jest.spyOn(window, "removeEventListener");

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(spy).toHaveBeenCalledWith("mousemove", expect.anything());
    spy.mockClear();
  });

  it("should restore canvas mouse listener on canvas destroy", () => {
    const element = createElement({ width: 1000, height: 1000 });

    const canvas = createCanvas({ element });

    const spy = jest.spyOn(element, "removeEventListener");

    canvas.destroy();

    expect(spy).toHaveBeenCalledWith("mousedown", expect.anything());
  });

  it("should restore window mouse listener on canvas destroy in the process", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ element });
    const spy = jest.spyOn(window, "removeEventListener");

    element.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    canvas.destroy();

    expect(spy).toHaveBeenCalledWith("mouseup", expect.anything());
  });

  it("should not call specified callback when mouse move distance exceeds specified threshold", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onCanvasSelected = jest.fn();

    createCanvas({
      element,
      onCanvasSelected,
      movementThreshold: Math.sqrt(200) - 1,
    });

    element.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(
      new MouseEvent("mousemove", {
        clientX: 300,
        clientY: 300,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onCanvasSelected).not.toHaveBeenCalled();
  });

  it("should reset moved distance on next selection", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onCanvasSelected = jest.fn();

    createCanvas({
      element,
      onCanvasSelected,
      movementThreshold: 10,
    });

    element.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );
    window.dispatchEvent(
      new MouseEvent("mousemove", {
        clientX: 300,
        clientY: 300,
      }),
    );
    window.dispatchEvent(new MouseEvent("mouseup"));

    element.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );
    window.dispatchEvent(
      new MouseEvent("mousemove", {
        clientX: 201,
        clientY: 201,
      }),
    );
    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onCanvasSelected).toHaveBeenCalled();
  });

  it("should not call specified callback when mouse down verifier failed", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onCanvasSelected = jest.fn();

    createCanvas({
      element,
      onCanvasSelected,
      mouseDownEventVerifier: (event) => event.ctrlKey,
    });

    element.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onCanvasSelected).not.toHaveBeenCalled();
  });

  it("should not call specified callback when mouse up verifier failed", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onCanvasSelected = jest.fn();

    createCanvas({
      element,
      onCanvasSelected,
      mouseUpEventVerifier: (event) => event.ctrlKey,
    });

    element.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onCanvasSelected).not.toHaveBeenCalled();
  });

  it("should not call specified callback when mouse moved outside", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onCanvasSelected = jest.fn();

    createCanvas({ element, onCanvasSelected });

    element.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 1,
        clientY: 1,
      }),
    );

    window.dispatchEvent(
      new MouseEvent("mousemove", {
        clientX: -1,
        clientY: -1,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onCanvasSelected).not.toHaveBeenCalled();
  });

  it("should call specified callback on canvas touch grab and immediate release", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onCanvasSelected = jest.fn();

    createCanvas({ element, onCanvasSelected });

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 200, clientY: 200 })],
      }),
    );

    window.dispatchEvent(new TouchEvent("touchend"));

    expect(onCanvasSelected).toHaveBeenCalled();
  });

  it("should restore window touch end listener on touch selection finish", () => {
    const element = createElement({ width: 1000, height: 1000 });

    createCanvas({ element });

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    const spy = jest.spyOn(window, "removeEventListener");

    window.dispatchEvent(new TouchEvent("touchend"));

    expect(spy).toHaveBeenCalledWith("touchend", expect.anything());
    spy.mockClear();
  });

  it("should restore window touch move listener on touch selection finish", () => {
    const element = createElement({ width: 1000, height: 1000 });

    createCanvas({ element });

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    const spy = jest.spyOn(window, "removeEventListener");

    window.dispatchEvent(new TouchEvent("touchend"));

    expect(spy).toHaveBeenCalledWith("touchmove", expect.anything());
    spy.mockClear();
  });

  it("should restore window touch cancel listener on touch selection finish", () => {
    const element = createElement({ width: 1000, height: 1000 });

    createCanvas({ element });

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    const spy = jest.spyOn(window, "removeEventListener");

    window.dispatchEvent(new TouchEvent("touchend"));

    expect(spy).toHaveBeenCalledWith("touchcancel", expect.anything());
    spy.mockClear();
  });

  it("should restore canvas touch listener on canvas destroy", () => {
    const element = createElement({ width: 1000, height: 1000 });

    const canvas = createCanvas({ element });

    const spy = jest.spyOn(element, "removeEventListener");

    canvas.destroy();

    expect(spy).toHaveBeenCalledWith("touchstart", expect.anything());
  });

  it("should not call specified callback when touch move distance exceeds specified threshold", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onCanvasSelected = jest.fn();

    createCanvas({
      element,
      onCanvasSelected,
      movementThreshold: Math.sqrt(200) - 1,
    });

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 200, clientY: 200 })],
      }),
    );

    window.dispatchEvent(new MouseEvent("touchend"));

    expect(onCanvasSelected).not.toHaveBeenCalled();
  });

  it("should not call specified callback when start event has multiple touches", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onCanvasSelected = jest.fn();

    createCanvas({
      element,
      onCanvasSelected,
      movementThreshold: 10,
    });

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [
          createTouch({ clientX: 100, clientY: 100 }),
          createTouch({ clientX: 100, clientY: 100 }),
        ],
      }),
    );

    window.dispatchEvent(new MouseEvent("touchend"));

    expect(onCanvasSelected).not.toHaveBeenCalled();
  });

  it("should not call specified callback when move event has multiple touches", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onCanvasSelected = jest.fn();

    createCanvas({
      element,
      onCanvasSelected,
      movementThreshold: 10,
    });

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [
          createTouch({ clientX: 100, clientY: 100 }),
          createTouch({ clientX: 100, clientY: 100 }),
        ],
      }),
    );

    window.dispatchEvent(new MouseEvent("touchend"));

    expect(onCanvasSelected).not.toHaveBeenCalled();
  });

  it("should not call specified callback when touch moved outside", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onCanvasSelected = jest.fn();

    createCanvas({
      element,
      onCanvasSelected,
      movementThreshold: 10,
    });

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 1, clientY: 1 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: -1, clientY: -1 })],
      }),
    );

    window.dispatchEvent(new MouseEvent("touchend"));

    expect(onCanvasSelected).not.toHaveBeenCalled();
  });

  it("should not call specified callback on touch cancelled", () => {
    const element = createElement({ width: 1000, height: 1000 });
    const onCanvasSelected = jest.fn();

    createCanvas({ element, onCanvasSelected });

    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 200, clientY: 200 })],
      }),
    );

    window.dispatchEvent(new TouchEvent("touchcancel"));
    window.dispatchEvent(new TouchEvent("touchend"));

    expect(onCanvasSelected).not.toHaveBeenCalled();
  });
});
