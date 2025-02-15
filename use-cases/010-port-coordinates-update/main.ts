import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  HtmlGraphBuilder,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const builder: HtmlGraphBuilder = new HtmlGraphBuilder();
builder.setOptions({
  edges: {
    shape: {
      hasTargetArrow: true,
    },
  },
});
const canvas: Canvas = builder.build();
const canvasElement: HTMLElement = document.getElementById("canvas")!;

const addNode1Request: AddNodeRequest = createInOutNode({
  name: "Node 1",
  x: 200,
  y: 400,
  frontPortId: "port-1-in",
  backPortId: "port-1-out",
});

const addNode2Request: AddNodeRequest = createInOutNode({
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

const updateBtn: HTMLElement = document.getElementById(
  "update-port-coordinates",
)!;

let i = 0;

updateBtn.addEventListener("click", () => {
  const element = addNode2Request.element.children[0] as HTMLElement;

  if (i % 2) {
    element.style.marginTop = "0";
    element.style.marginBottom = "auto";
  } else {
    element.style.marginBottom = "0";
    element.style.marginTop = "auto";
  }

  canvas.updatePort("port-2-in");
  i++;
});
