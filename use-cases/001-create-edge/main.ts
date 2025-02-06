import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  HtmlGraphBuilder,
} from "@html-graph/html-graph";
import { createBasicNode } from "../shared/create-basic-node";

const builder: HtmlGraphBuilder = new HtmlGraphBuilder();
const canvas: Canvas = builder.build();
const canvasElement: HTMLElement = document.getElementById("canvas")!;

const addNode1Request: AddNodeRequest = createBasicNode({
  name: "Node 1",
  x: 200,
  y: 400,
  frontPortId: "port-1-in",
  backPortId: "port-1-out",
});

const addNode2Request: AddNodeRequest = createBasicNode({
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
