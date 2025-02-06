import { HtmlGraphBuilder, AddNodeRequest } from "@html-graph/html-graph";
import { backgroundDrawingFn } from "../shared/background-drawing-fn";
import { createBasicNode } from "../shared/create-basic-node";

const canvasElement = document.getElementById("canvas")!;

const backgroundElement = document.getElementById(
  "background",
)! as HTMLCanvasElement;

const ctx = backgroundElement.getContext("2d")!;

new ResizeObserver(() => {
  const { width, height } = canvasElement.getBoundingClientRect();

  ctx.canvas.width = width;
  ctx.canvas.height = height;

  backgroundDrawingFn(ctx, canvas.transformation);
}).observe(canvasElement);

const canvas = new HtmlGraphBuilder()
  .setUserTransformableCanvas({
    events: {
      onTransformFinished: () => {
        backgroundDrawingFn(ctx, canvas.transformation);
      },
    },
  })
  .build();

const addNode1Request: AddNodeRequest = createBasicNode({
  name: "Node 1",
  x: 200,
  y: 400,
  frontPortId: "port-1-in",
  backPortId: "port-1-out",
});

const addNode2Request: AddNodeRequest = createBasicNode({
  name: "Node 2",
  x: 600,
  y: 500,
  frontPortId: "port-2-in",
  backPortId: "port-2-out",
});

const addNode3Request: AddNodeRequest = createBasicNode({
  name: "Node 3",
  x: 200,
  y: 700,
  frontPortId: "port-3-in",
  backPortId: "port-3-out",
});

const addNode4Request: AddNodeRequest = createBasicNode({
  name: "Node 4",
  x: 1000,
  y: 600,
  frontPortId: "port-4-in",
  backPortId: "port-4-out",
});

canvas
  .attach(canvasElement)
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addNode(addNode3Request)
  .addNode(addNode4Request)
  .addEdge({ from: "port-1-out", to: "port-2-in" })
  .addEdge({ from: "port-3-out", to: "port-2-in" })
  .addEdge({ from: "port-2-out", to: "port-4-in" });
