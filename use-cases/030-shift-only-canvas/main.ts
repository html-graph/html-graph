import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  TransformOptions,
  TransformPreprocessorParams,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const builder: CanvasBuilder = new CanvasBuilder();

const transformOptions: TransformOptions = {
  transformPreprocessor: (params: TransformPreprocessorParams) => {
    if (params.nextTransform.scale !== params.prevTransform.scale) {
      return params.prevTransform;
    }

    return params.nextTransform;
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

const addEdgeRequest: AddEdgeRequest = {
  from: "node-1-out",
  to: "node-2-in",
};

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdgeRequest);
