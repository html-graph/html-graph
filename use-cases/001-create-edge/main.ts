import {
  AddEdgeRequest,
  AddNodeRequest,
  HtmlGraphBuilder,
} from "@html-graph/html-graph";
import { createBasicNode } from "../shared/create-basic-node";

const canvas = new HtmlGraphBuilder().build();

const canvasElement = document.getElementById("canvas")!;

const addNode1Request: AddNodeRequest = createBasicNode({
  name: "Node 1",
  x: 100,
  y: 100,
  frontPortId: "port-1-1",
  backPortId: "port-1-2",
});

const addNode2Request: AddNodeRequest = createBasicNode({
  name: "Node 2",
  x: 500,
  y: 200,
  frontPortId: "port-2-1",
  backPortId: "port-2-2",
});

const addEdgeRequest: AddEdgeRequest = {
  from: "port-1-2",
  to: "port-2-1",
};

canvas
  .attach(canvasElement)
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdgeRequest);
