import {
  AddEdgeRequest,
  AddNodeRequest,
  BezierEdgeParams,
  BezierEdgeShape,
  Canvas,
  CanvasBuilder,
  UpdateEdgeRequest,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);
const canvas: Canvas = builder.build();

const addNode1Request: AddNodeRequest = createInOutNode({
  id: "node-1",
  name: "Node 1",
  x: 200,
  y: 400,
  frontPortId: "node-1-in",
  backPortId: "node-1-out",
});

const addNode2Request: AddNodeRequest = createInOutNode({
  id: "node-2",
  name: "Node 2",
  x: 500,
  y: 500,
  frontPortId: "node-2-in",
  backPortId: "node-2-out",
});

const addEdgeRequest: AddEdgeRequest = {
  id: "con-1",
  from: "node-1-out",
  to: "node-2-in",
};

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdgeRequest);

const updateBtn: HTMLElement = document.getElementById("update-edge-shape")!;

let i = 0;

const redParams: BezierEdgeParams = {
  color: "red",
  width: 3,
  hasTargetArrow: true,
};

const greenParams: BezierEdgeParams = {
  color: "green",
  width: 3,
  hasSourceArrow: true,
};

const redShape = new BezierEdgeShape(redParams);

const greenShape = new BezierEdgeShape(greenParams);

updateBtn.addEventListener(
  "click",
  () => {
    if (i % 2) {
      const request: UpdateEdgeRequest = {
        shape: redShape,
      };

      canvas.updateEdge("con-1", request);
    } else {
      const request: UpdateEdgeRequest = {
        shape: greenShape,
      };

      canvas.updateEdge("con-1", request);
    }

    i++;
  },
  { passive: true },
);
