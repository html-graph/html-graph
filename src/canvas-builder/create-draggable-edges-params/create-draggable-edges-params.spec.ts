import { BezierEdgeShape, DirectEdgeShape } from "@/edges";
import { createDraggableEdgeParams } from "./create-draggable-edges-params";
import {
  AddEdgeRequest,
  Canvas,
  CanvasParams,
  EdgeShapeFactory,
} from "@/canvas";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { CoreHtmlView } from "@/html-view";
import { standardCenterFn } from "@/center-fn";
import { ConnectionPreprocessor, DraggingEdgeResolver } from "@/configurators";
import { Graph } from "@/graph";
import { Viewport } from "@/viewport";

const createCanvas = (): Canvas => {
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore();
  const graph = new Graph(graphStore);
  const viewport = new Viewport(viewportStore);
  const element = document.createElement("div");
  const htmlView = new CoreHtmlView(graphStore, viewportStore, element);

  const params: CanvasParams = {
    nodes: {
      centerFn: standardCenterFn,
      priorityFn: (): number => 0,
    },
    ports: {
      direction: 0,
    },
    edges: {
      shapeFactory: (): BezierEdgeShape => new BezierEdgeShape(),
      priorityFn: (): number => 0,
    },
  };

  const canvas = new Canvas(
    graph,
    viewport,
    graphStore,
    viewportStore,
    htmlView,
    params,
  );

  return canvas;
};

describe("createDraggableEdgeParams", () => {
  it("should return LMB+CTRL mouse down event verifier by default", () => {
    const options = createDraggableEdgeParams({}, createCanvas().graph);

    const fail1 = options.mouseDownEventVerifier(
      new MouseEvent("mousedown", { button: 1 }),
    );

    const fail2 = options.mouseDownEventVerifier(
      new MouseEvent("mousedown", { button: 0 }),
    );

    const pass = options.mouseDownEventVerifier(
      new MouseEvent("mousedown", { button: 0, ctrlKey: true }),
    );

    expect([fail1, fail2, pass]).toEqual([false, false, true]);
  });

  it("should return specified mouse down event verifier", () => {
    const verifier: (event: MouseEvent) => boolean = () => false;
    const options = createDraggableEdgeParams(
      {
        mouseDownEventVerifier: verifier,
      },
      createCanvas().graph,
    );

    expect(options.mouseDownEventVerifier).toBe(verifier);
  });

  it("should return LMB mouse up event verifier by default", () => {
    const options = createDraggableEdgeParams({}, createCanvas().graph);

    const fail = options.mouseUpEventVerifier(
      new MouseEvent("mousedown", { button: 1 }),
    );

    const pass = options.mouseUpEventVerifier(
      new MouseEvent("mousedown", { button: 0 }),
    );

    expect([fail, pass]).toEqual([false, true]);
  });

  it("should return specified mouse up event verifier", () => {
    const verifier: (event: MouseEvent) => boolean = () => false;
    const options = createDraggableEdgeParams(
      {
        mouseUpEventVerifier: verifier,
      },
      createCanvas().graph,
    );

    expect(options.mouseUpEventVerifier).toBe(verifier);
  });

  it("should return default connection preprocessor", () => {
    const options = createDraggableEdgeParams({}, createCanvas().graph);

    const request: AddEdgeRequest = { from: "1", to: "2" };

    expect(options.connectionPreprocessor(request)).toBe(request);
  });

  it("should return specified connection preprocessor", () => {
    const preprocessor: ConnectionPreprocessor = () => null;
    const options = createDraggableEdgeParams(
      { connectionPreprocessor: preprocessor },
      createCanvas().graph,
    );

    expect(options.connectionPreprocessor).toBe(preprocessor);
  });

  it("should return default edge reattached callback", () => {
    const options = createDraggableEdgeParams({}, createCanvas().graph);

    expect(() => {
      options.onAfterEdgeReattached("123");
    }).not.toThrow();
  });

  it("should return specified edge reattached callback", () => {
    const onAfterEdgeReattached = (): void => {};

    const options = createDraggableEdgeParams(
      {
        events: { onAfterEdgeReattached },
      },
      createCanvas().graph,
    );

    expect(options.onAfterEdgeReattached).toBe(onAfterEdgeReattached);
  });

  it("should return default edge reattach interrupted callback", () => {
    const options = createDraggableEdgeParams({}, createCanvas().graph);

    expect(() => {
      options.onEdgeReattachInterrupted({
        id: 0,
        from: "1",
        to: "2",
        shape: new BezierEdgeShape(),
        priority: 0,
      });
    }).not.toThrow();
  });

  it("should return specified edge reattach interrupted callback", () => {
    const onEdgeReattachInterrupted = (): void => {};

    const options = createDraggableEdgeParams(
      { events: { onEdgeReattachInterrupted } },
      createCanvas().graph,
    );

    expect(options.onEdgeReattachInterrupted).toBe(onEdgeReattachInterrupted);
  });

  it("should return default edge reattach prevented callback", () => {
    const options = createDraggableEdgeParams({}, createCanvas().graph);

    expect(() => {
      options.onEdgeReattachPrevented({
        id: 0,
        from: "123",
        to: "456",
        shape: new BezierEdgeShape(),
        priority: 0,
      });
    }).not.toThrow();
  });

  it("should return specified edge reattach interrupted callback", () => {
    const onEdgeReattachPrevented = (): void => {};

    const options = createDraggableEdgeParams(
      { events: { onEdgeReattachPrevented } },
      createCanvas().graph,
    );

    expect(options.onEdgeReattachPrevented).toBe(onEdgeReattachPrevented);
  });

  it("should return default edge shape factory", () => {
    const options = createDraggableEdgeParams({}, createCanvas().graph);

    expect(options.draggingEdgeShapeFactory).toBe(null);
  });

  it("should return specified edge shape factory", () => {
    const connectionFactory: EdgeShapeFactory = () => new DirectEdgeShape();
    const options = createDraggableEdgeParams(
      { draggingEdgeShape: connectionFactory },
      createCanvas().graph,
    );

    expect(options.draggingEdgeShapeFactory).toBe(connectionFactory);
  });

  it("should return default dragging edge resolver", () => {
    const canvas = createCanvas();

    const options = createDraggableEdgeParams({}, canvas.graph);

    canvas.addNode({
      id: "node-1",
      x: 0,
      y: 0,
      element: document.createElement("div"),
      ports: [
        {
          id: "node-1-1",
          element: document.createElement("div"),
        },
        {
          id: "node-1-2",
          element: document.createElement("div"),
        },
      ],
    });

    canvas.addNode({
      id: "node-2",
      x: 0,
      y: 0,
      element: document.createElement("div"),
      ports: [
        {
          id: "node-2-1",
          element: document.createElement("div"),
        },
      ],
    });

    canvas.addEdge({ id: "edge-1", from: "node-1-1", to: "node-2-1" });

    expect([
      options.draggingEdgeResolver("node-1-1"),
      options.draggingEdgeResolver("node-1-2"),
    ]).toEqual(["edge-1", null]);
  });

  it("should return specified dragging edge resolver", () => {
    const resolver: DraggingEdgeResolver = () => null;

    const options = createDraggableEdgeParams(
      { draggingEdgeResolver: resolver },
      createCanvas().graph,
    );

    expect(options.draggingEdgeResolver).toBe(resolver);
  });
});
