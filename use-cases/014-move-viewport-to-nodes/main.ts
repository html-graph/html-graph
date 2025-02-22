import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  HtmlGraphBuilder,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const builder: HtmlGraphBuilder = new HtmlGraphBuilder();
const canvas: Canvas = builder.build();
const canvasElement: HTMLElement = document.getElementById("canvas")!;

const addNode1Request: AddNodeRequest = createInOutNode({
  id: "node-1",
  name: "Node 1",
  x: 200,
  y: 500,
  frontPortId: "node-1-in",
  backPortId: "node-1-out",
});

const addNode2Request: AddNodeRequest = createInOutNode({
  id: "node-2",
  name: "Node 2",
  x: 1500,
  y: 500,
  frontPortId: "node-2-in",
  backPortId: "node-2-out",
});

const addNode3Request: AddNodeRequest = createInOutNode({
  id: "node-3",
  name: "Node 3",
  x: 1900,
  y: 500,
  frontPortId: "node-3-in",
  backPortId: "node-3-out",
});

const addEdge1Request: AddEdgeRequest = {
  from: "node-1-out",
  to: "node-2-in",
};

const addEdge2Request: AddEdgeRequest = {
  from: "node-2-out",
  to: "node-3-in",
};

canvas
  .attach(canvasElement)
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addNode(addNode3Request)
  .addEdge(addEdge1Request)
  .addEdge(addEdge2Request);

const navigateBtn: HTMLElement = document.getElementById("navigate")!;

navigateBtn.addEventListener("click", () => {
  const nodes = [
    canvas.model.getNode("node-2")!,
    canvas.model.getNode("node-3")!,
  ];

  const [x, y] = nodes.reduce(
    (acc, cur) => [acc[0] + cur.x, acc[1] + cur.y],
    [0, 0],
  );

  const avgX = x / nodes.length;
  const avgY = y / nodes.length;
  const rect = canvasElement.getBoundingClientRect();
  const viewportScale = canvas.transformation.getViewportMatrix().scale;

  const targetX = avgX - (viewportScale * rect.width) / 2;
  const targetY = avgY - (viewportScale * rect.height) / 2;

  canvas.patchViewportMatrix({ x: targetX, y: targetY });
});
