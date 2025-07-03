import { Canvas } from "@/canvas";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import { ViewportStore } from "@/viewport-store";
import { UserConnectablePortsConfigurator } from "./user-connectable-ports-configurator";
import { createElement, createMouseMoveEvent, createTouch } from "@/mocks";
import { ConnectablePortsConfig } from "./config";
import { createCanvasDefaults } from "@/create-canvas-defaults";

const createCanvas = (params?: {
  mainElement?: HTMLElement;
  overlayElement?: HTMLElement;
  connectConfig?: ConnectablePortsConfig;
}): Canvas => {
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore();
  const mainElement =
    params?.mainElement ?? createElement({ width: 1000, height: 1000 });
  const overlayElement =
    params?.overlayElement ?? createElement({ width: 1000, height: 1000 });
  const htmlView = new CoreHtmlView(graphStore, viewportStore, mainElement);
  const defaults = createCanvasDefaults({});

  const canvas = new Canvas(
    mainElement,
    graphStore,
    viewportStore,
    htmlView,
    defaults,
  );

  UserConnectablePortsConfigurator.configure(
    canvas,
    overlayElement,
    viewportStore,
    window,
    defaults,
    params?.connectConfig ?? {},
  );

  return canvas;
};

const createNode = (canvas: Canvas, portElement: HTMLElement): void => {
  const nodeElement = document.createElement("div");
  nodeElement.appendChild(portElement);

  canvas.addNode({
    element: nodeElement,
    x: 0,
    y: 0,
    ports: [{ element: portElement }],
  });
};

describe("UserConnectablePortsConfigurator", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should create overlay graph on port mouse grab", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(new MouseEvent("mousedown"));

    expect(overlayElement.children[0].children[0].children.length).toBe(3);
  });

  it("should not create overlay graph when event verifier not matched", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      overlayElement,
    });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(new MouseEvent("mousedown", { button: 1 }));

    expect(overlayElement.children[0].children[0].children.length).toBe(0);
  });

  it("should not create overlay graph connection type is null", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      overlayElement,
      connectConfig: {
        connectionTypeResolver: () => null,
      },
    });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(new MouseEvent("mousedown"));

    expect(overlayElement.children[0].children[0].children.length).toBe(0);
  });

  it("should create overlay graph on touch start", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    expect(overlayElement.children[0].children[0].children.length).toBe(3);
  });

  it("should not create overlay graph on touch start when more than 1 touch", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [
          createTouch({ clientX: 0, clientY: 0 }),
          createTouch({ clientX: 0, clientY: 0 }),
        ],
      }),
    );

    expect(overlayElement.children[0].children[0].children.length).toBe(0);
  });

  it("should not create overlay graph on touch start when connection is not allowed", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      overlayElement,
      connectConfig: {
        connectionTypeResolver: () => null,
      },
    });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );

    expect(overlayElement.children[0].children[0].children.length).toBe(0);
  });

  it("should stop event propagation on port mouse grab", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    const event = new MouseEvent("mousedown");
    const spy = jest.spyOn(event, "stopPropagation");
    portElement.dispatchEvent(event);

    expect(spy).toHaveBeenCalled();
  });

  it("should stop event propagation on port touch grab", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    const event = new TouchEvent("touchstart", {
      touches: [createTouch({ clientX: 0, clientY: 0 })],
    });

    const spy = jest.spyOn(event, "stopPropagation");
    portElement.dispatchEvent(event);

    expect(spy).toHaveBeenCalled();
  });

  it("should create source node at static port center", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement = createElement({ width: 10, height: 10 });
    createNode(canvas, portElement);

    portElement.dispatchEvent(new MouseEvent("mousedown"));

    const overlayNodeElement = overlayElement.children[0].children[0]
      .children[0] as HTMLElement;

    expect(overlayNodeElement.style.transform).toBe("translate(5px, 5px)");
  });

  it("should create target node at cursor", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 10, clientY: 10 }),
    );

    const overlayNodeElement = overlayElement.children[0].children[0]
      .children[1] as HTMLElement;

    expect(overlayNodeElement.style.transform).toBe("translate(10px, 10px)");
  });

  it("should create target node at static port center when connection type is reverse", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      overlayElement,
      connectConfig: {
        connectionTypeResolver: () => "reverse",
      },
    });

    const portElement = createElement({ width: 10, height: 10 });
    createNode(canvas, portElement);

    portElement.dispatchEvent(new MouseEvent("mousedown"));

    const overlayNodeElement = overlayElement.children[0].children[0]
      .children[1] as HTMLElement;

    expect(overlayNodeElement.style.transform).toBe("translate(5px, 5px)");
  });

  it("should create source node at cursor when connection type is reverse", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      overlayElement,
      connectConfig: {
        connectionTypeResolver: () => "reverse",
      },
    });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 10, clientY: 10 }),
    );

    const overlayNodeElement = overlayElement.children[0].children[0]
      .children[0] as HTMLElement;

    expect(overlayNodeElement.style.transform).toBe("translate(10px, 10px)");
  });

  it("should move target port on port mouse grab", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 100 }));

    const targetNodeElement = overlayElement.children[0].children[0]
      .children[1] as HTMLElement;
    expect(targetNodeElement.style.transform).toBe("translate(100px, 100px)");
  });

  it("should clear graph when moving target port outside", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: -10, clientY: -10 }));

    expect(overlayElement.children[0].children[0].children.length).toBe(0);
  });

  it("should move target port on port touch move", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );
    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    const targetNodeElement = overlayElement.children[0].children[0]
      .children[1] as HTMLElement;
    expect(targetNodeElement.style.transform).toBe("translate(100px, 100px)");
  });

  it("should clear graph when touch moving target port outside", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement });

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    portElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );
    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: -10, clientY: -10 })],
      }),
    );

    expect(overlayElement.children[0].children[0].children.length).toBe(0);
  });

  it("should create connection on mouse release", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const mainElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement, mainElement });

    document.body.appendChild(mainElement);
    document.body.appendChild(overlayElement);

    const portSourceElement = createElement({
      x: -5,
      y: -5,
      width: 10,
      height: 10,
    });
    createNode(canvas, portSourceElement);

    const portTargetElement = createElement({
      x: 95,
      y: 95,
      width: 10,
      height: 10,
    });
    createNode(canvas, portTargetElement);

    portSourceElement.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 100 }));
    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 100, clientY: 100 }),
    );

    expect(canvas.graph.getAllEdgeIds().length).toBe(1);
  });

  it("should create connection on touch end", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const mainElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement, mainElement });

    document.body.appendChild(mainElement);
    document.body.appendChild(overlayElement);

    const portSourceElement = createElement({
      x: -5,
      y: -5,
      width: 10,
      height: 10,
    });
    createNode(canvas, portSourceElement);

    const portTargetElement = createElement({
      x: 95,
      y: 95,
      width: 10,
      height: 10,
    });
    createNode(canvas, portTargetElement);

    portSourceElement.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [createTouch({ clientX: 0, clientY: 0 })],
      }),
    );
    window.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    window.dispatchEvent(
      new TouchEvent("touchend", {
        changedTouches: [createTouch({ clientX: 100, clientY: 100 })],
      }),
    );

    expect(canvas.graph.getAllEdgeIds().length).toBe(1);
  });

  it("should not create connection on mouse release outside of port", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const mainElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement, mainElement });

    document.body.appendChild(mainElement);
    document.body.appendChild(overlayElement);

    const portSourceElement = createElement({
      x: -5,
      y: -5,
      width: 10,
      height: 10,
    });
    createNode(canvas, portSourceElement);

    const portTargetElement = createElement({
      x: 95,
      y: 95,
      width: 10,
      height: 10,
    });
    createNode(canvas, portTargetElement);

    portSourceElement.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 110, clientY: 110 }));
    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 110, clientY: 110 }),
    );

    expect(canvas.graph.getAllEdgeIds().length).toBe(0);
  });

  it("should not create connection on mouse release when verifier fails", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const mainElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({ overlayElement, mainElement });

    document.body.appendChild(mainElement);
    document.body.appendChild(overlayElement);

    const portSourceElement = createElement({
      x: -5,
      y: -5,
      width: 10,
      height: 10,
    });
    createNode(canvas, portSourceElement);

    const portTargetElement = createElement({
      x: 95,
      y: 95,
      width: 10,
      height: 10,
    });
    createNode(canvas, portTargetElement);

    portSourceElement.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 110, clientY: 110 }));
    window.dispatchEvent(
      new MouseEvent("mouseup", { button: 1, clientX: 100, clientY: 100 }),
    );

    expect(canvas.graph.getAllEdgeIds().length).toBe(0);
  });

  it("should create reverse connection", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const mainElement = createElement({ width: 1000, height: 1000 });
    const canvas = createCanvas({
      overlayElement,
      mainElement,
      connectConfig: { connectionTypeResolver: () => "reverse" },
    });

    document.body.appendChild(mainElement);
    document.body.appendChild(overlayElement);

    const portSourceElement = createElement({
      x: -5,
      y: -5,
      width: 10,
      height: 10,
    });
    createNode(canvas, portSourceElement);

    const portTargetElement = createElement({
      x: 95,
      y: 95,
      width: 10,
      height: 10,
    });
    createNode(canvas, portTargetElement);

    portSourceElement.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 100 }));
    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 100, clientY: 100 }),
    );

    expect(canvas.graph.getEdge(0)).toStrictEqual(
      expect.objectContaining({ from: 1, to: 0 }),
    );
  });

  it("should remove port listeners on port remove", () => {
    const canvas = createCanvas();

    const port = document.createElement("div");
    createNode(canvas, port);

    canvas.removeNode(0);

    expect(() => {
      port.dispatchEvent(new MouseEvent("mousedown"));
    }).not.toThrow();
  });

  it("should remove port listeners on canvas clear", () => {
    const canvas = createCanvas();

    const port = document.createElement("div");
    createNode(canvas, port);

    canvas.clear();

    expect(() => {
      port.dispatchEvent(new MouseEvent("mousedown"));
    }).not.toThrow();
  });

  it("should call specified callback after edge creation", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const mainElement = createElement({ width: 1000, height: 1000 });

    const onAfterEdgeCreated = jest.fn();
    const canvas = createCanvas({
      overlayElement,
      mainElement,
      connectConfig: { events: { onAfterEdgeCreated } },
    });

    document.body.appendChild(mainElement);
    document.body.appendChild(overlayElement);

    const portSourceElement = createElement({
      x: -5,
      y: -5,
      width: 10,
      height: 10,
    });
    createNode(canvas, portSourceElement);

    const portTargetElement = createElement({
      x: 95,
      y: 95,
      width: 10,
      height: 10,
    });
    createNode(canvas, portTargetElement);

    portSourceElement.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 100 }));
    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 100, clientY: 100 }),
    );

    expect(onAfterEdgeCreated).toHaveBeenCalledWith(0);
  });

  it("should call specified callback on edge creation interruption", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const mainElement = createElement({ width: 1000, height: 1000 });

    const onEdgeCreationInterrupted = jest.fn();
    const canvas = createCanvas({
      overlayElement,
      mainElement,
      connectConfig: { events: { onEdgeCreationInterrupted } },
    });

    document.body.appendChild(mainElement);
    document.body.appendChild(overlayElement);

    const portSourceElement = createElement({
      x: -5,
      y: -5,
      width: 10,
      height: 10,
    });
    createNode(canvas, portSourceElement);

    const portTargetElement = createElement({
      x: 95,
      y: 95,
      width: 10,
      height: 10,
    });
    createNode(canvas, portTargetElement);

    portSourceElement.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 50, clientY: 50 }));
    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 50, clientY: 50 }),
    );

    expect(onEdgeCreationInterrupted).toHaveBeenCalledWith(0, true);
  });

  it("should call specified callback on edge creation prevention", () => {
    const overlayElement = createElement({ width: 1000, height: 1000 });
    const mainElement = createElement({ width: 1000, height: 1000 });

    const onEdgeCreationPrevented = jest.fn();
    const canvas = createCanvas({
      overlayElement,
      mainElement,
      connectConfig: {
        events: { onEdgeCreationPrevented },
        connectionPreprocessor: () => null,
      },
    });

    document.body.appendChild(mainElement);
    document.body.appendChild(overlayElement);

    const portSourceElement = createElement({
      x: -5,
      y: -5,
      width: 10,
      height: 10,
    });
    createNode(canvas, portSourceElement);

    const portTargetElement = createElement({
      x: 95,
      y: 95,
      width: 10,
      height: 10,
    });
    createNode(canvas, portTargetElement);

    portSourceElement.dispatchEvent(new MouseEvent("mousedown"));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 100, clientY: 100 }));
    window.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 100, clientY: 100 }),
    );

    expect(onEdgeCreationPrevented).toHaveBeenCalledWith({ from: 0, to: 1 });
  });

  it("should unsubscribe before destroy", () => {
    const canvas = createCanvas();

    canvas.destroy();
  });
});
