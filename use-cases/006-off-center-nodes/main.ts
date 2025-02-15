import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CenterFn,
  HtmlGraphBuilder,
  Point,
  UpdateNodeRequest,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const builder: HtmlGraphBuilder = new HtmlGraphBuilder();
const canvas: Canvas = builder.build();
const canvasElement: HTMLElement = document.getElementById("canvas")!;

const addNode1Request: AddNodeRequest = createInOutNode({
  id: "node-1",
  name: "Node 1",
  x: 200,
  y: 400,
  frontPortId: "port-1-in",
  backPortId: "port-1-out",
});

const addNode2Request: AddNodeRequest = createInOutNode({
  id: "node-2",
  name: "Node 2",
  x: 500,
  y: 500,
  frontPortId: "port-2-in",
  backPortId: "port-2-out",
});

const addEdgeRequest: AddEdgeRequest = {
  from: "port-1-out",
  to: "port-2-in",
};

canvas
  .attach(canvasElement)
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdgeRequest);

const topLeftBtn: HTMLElement = document.getElementById("top-left")!;
const centerBtn: HTMLElement = document.getElementById("center")!;
const bottomRightBtn: HTMLElement = document.getElementById("bottom-right")!;

topLeftBtn.addEventListener("click", () => {
  const centerFn: CenterFn = (): Point => ({ x: 0, y: 0 });
  const updateRequest: UpdateNodeRequest = { centerFn };

  canvas.updateNode("node-1", updateRequest);
});

centerBtn.addEventListener("click", () => {
  const centerFn: CenterFn = (w, h): Point => ({ x: w / 2, y: h / 2 });
  const updateRequest: UpdateNodeRequest = { centerFn };

  canvas.updateNode("node-1", updateRequest);
});

bottomRightBtn.addEventListener("click", () => {
  const centerFn: CenterFn = (w, h): Point => ({ x: w, y: h });
  const updateRequest: UpdateNodeRequest = { centerFn };

  canvas.updateNode("node-1", updateRequest);
});
