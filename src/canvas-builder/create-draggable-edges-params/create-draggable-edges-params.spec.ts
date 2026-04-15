import { DirectEdgeShape } from "@/edges";
import { createDraggableEdgeParams } from "./create-draggable-edges-params";
import { Canvas } from "@/canvas";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { CoreHtmlView } from "@/html-view";
import { ConnectionPreprocessor, DraggingEdgeResolver } from "@/configurators";
import { Graph } from "@/graph";
import { Viewport } from "@/viewport";
import { EdgeShapeFactory, GraphController } from "@/graph-controller";
import { ViewportController } from "@/viewport-controller";
import {
  defaultGraphControllerParams,
  defaultViewportControllerParams,
} from "@/mocks";
import { defaults } from "./defaults";
import { noopFn } from "../shared";

const createCanvas = (): Canvas => {
  const graphStore = new GraphStore();
  const element = document.createElement("div");
  const viewportStore = new ViewportStore(element);
  const graph = new Graph(graphStore);
  const viewport = new Viewport(viewportStore);
  const htmlView = new CoreHtmlView(graphStore, viewportStore, element);

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

describe("createDraggableEdgeParams", () => {
  it("should return default mouse down event verifier", () => {
    const options = createDraggableEdgeParams({}, createCanvas().graph);

    expect(options.mouseDownEventVerifier).toBe(
      defaults.mouseDownEventVerifier,
    );
  });

  it("should return specified mouse down event verifier", () => {
    const mouseDownEventVerifier: (event: MouseEvent) => boolean = () => false;
    const options = createDraggableEdgeParams(
      {
        mouseDownEventVerifier,
      },
      createCanvas().graph,
    );

    expect(options.mouseDownEventVerifier).toBe(mouseDownEventVerifier);
  });

  it("should return default mouse up event verifier", () => {
    const options = createDraggableEdgeParams({}, createCanvas().graph);

    expect(options.mouseUpEventVerifier).toBe(defaults.mouseUpEventVerifier);
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

    expect(options.connectionPreprocessor).toBe(
      defaults.connectionPreprocessor,
    );
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

    expect(options.onAfterEdgeReattached).toBe(noopFn);
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

    expect(options.onEdgeReattachInterrupted).toBe(noopFn);
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

    expect(options.onEdgeReattachPrevented).toBe(noopFn);
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

  it("should return default connection allowed verifier", () => {
    const options = createDraggableEdgeParams({}, createCanvas().graph);

    expect(options.connectionAllowedVerifier).toBe(
      defaults.connectionAllowedVerifier,
    );
  });

  it("should return specifier connection allowed verifier", () => {
    const connectionAllowedVerifier = (): boolean => true;
    const options = createDraggableEdgeParams(
      { connectionAllowedVerifier },
      createCanvas().graph,
    );

    expect(options.connectionAllowedVerifier).toBe(connectionAllowedVerifier);
  });
});
