import { Canvas, CanvasParams } from "@/canvas";
import { standardCenterFn } from "@/center-fn";
import { BezierEdgeShape } from "@/edges";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import { createElement } from "@/mocks";
import { ViewportStore } from "@/viewport-store";
import { UserDraggableEdgesParams } from "./user-draggable-edges-params";
import { UserDraggableEdgesConfigurator } from "./user-draggable-edges-configurator";

const createCanvas = (options?: {
  mainElement?: HTMLElement;
  overlayElement?: HTMLElement;
}): Canvas => {
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore();
  const mainElement =
    options?.mainElement ?? createElement({ width: 1000, height: 1000 });
  const overlayElement =
    options?.overlayElement ?? createElement({ width: 1000, height: 1000 });
  const htmlView = new CoreHtmlView(graphStore, viewportStore, mainElement);

  const canvasParams: CanvasParams = {
    nodes: {
      centerFn: standardCenterFn,
      priorityFn: () => 0,
    },
    ports: {
      direction: 0,
    },
    edges: {
      shapeFactory: () => new BezierEdgeShape(),
      priorityFn: () => 0,
    },
  };

  const canvas = new Canvas(
    mainElement,
    graphStore,
    viewportStore,
    htmlView,
    canvasParams,
  );

  const params: UserDraggableEdgesParams = {
    draggingEdgeShapeFactory: null,
    draggingEdgeResolver: (portId: unknown) => {
      const edgeIds = canvas.graph.getPortAdjacentEdgeIds(portId)!;

      if (edgeIds.length > 0) {
        return edgeIds[edgeIds.length - 1];
      } else {
        return null;
      }
    },
    connectionPreprocessor: (request) => request,
    mouseDownEventVerifier: (event: MouseEvent) => event.button === 0,
    mouseUpEventVerifier: (event: MouseEvent) => event.button === 0,
    onAfterEdgeReattached: () => {},
    onEdgeReattachInterrupted: () => {},
    onEdgeReattachPrevented: () => {},
  };

  UserDraggableEdgesConfigurator.configure(
    canvas,
    overlayElement,
    viewportStore,
    window,
    params,
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

describe("UserDraggableEdgesConfigurator", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should fail", () => {
    const canvas = createCanvas();

    const portElement = document.createElement("div");
    createNode(canvas, portElement);

    expect(canvas).toBe(false);
  });
});
