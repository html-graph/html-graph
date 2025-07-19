import { BezierEdgeShape } from "@/edges";
import { createUserDraggableEdgeParams } from "./create-user-draggable-edges-params";
import { Canvas, CanvasParams } from "@/canvas";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { CoreHtmlView } from "@/html-view";
import { standardCenterFn } from "@/center-fn";

const createCanvas = (): Canvas => {
  const graphStore = new GraphStore();
  const viewportStore = new ViewportStore();
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
    element,
    graphStore,
    viewportStore,
    htmlView,
    params,
  );

  return canvas;
};

describe("createUserDraggableEdgeParams", () => {
  it("should return LMB mouse down event verifier by default", () => {
    const options = createUserDraggableEdgeParams(
      {},
      () => new BezierEdgeShape(),
      createCanvas(),
    );

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
    const options = createUserDraggableEdgeParams(
      {
        mouseDownEventVerifier: verifier,
      },
      () => new BezierEdgeShape(),
      createCanvas(),
    );

    expect(options.mouseDownEventVerifier).toBe(verifier);
  });
});
