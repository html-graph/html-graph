import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  TransformOptions,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const builder: CanvasBuilder = new CanvasBuilder();

const boundsElement = document.getElementById("bounds")! as HTMLElement;

const transformOptions: TransformOptions = {
  transformPreprocessor: [
    {
      type: "shift-limit",
      minX: -500,
      maxX: 2000,
      minY: -500,
      maxY: 1200,
    },
    {
      type: "scale-limit",
      minContentScale: 0.5,
      maxContentScale: 1.5,
    },
  ],
  events: {
    onTransformChange: () => {
      const { scale, x: dx, y: dy } = canvas.viewport.getContentMatrix();

      boundsElement.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${dx}, ${dy})`;
    },
  },
};

builder.enableUserTransformableViewport(transformOptions);

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const canvas: Canvas = builder.attach(canvasElement).build();

const addNode1Request: AddNodeRequest = createInOutNode({
  name: "Node 1",
  x: 200,
  y: 400,
  frontPortId: "node-1-in",
  backPortId: "node-1-out",
});

const addNode2Request: AddNodeRequest = createInOutNode({
  name: "Node 2",
  x: 500,
  y: 500,
  frontPortId: "node-2-in",
  backPortId: "node-2-out",
});

const addEdge1Request: AddEdgeRequest = {
  from: "node-1-out",
  to: "node-2-in",
};

canvas
  .attach(canvasElement)
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdge1Request);
