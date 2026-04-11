import {
  createElement,
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

  it("should restore canvas mouse listener on canvas destroy", () => {
    const element = createElement({ width: 1000, height: 1000 });

    const canvas = createCanvas({ element });

    const spy = jest.spyOn(element, "removeEventListener");

    canvas.destroy();

    expect(spy).toHaveBeenCalledWith("mousedown", expect.anything());
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
});
