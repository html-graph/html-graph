import {
  AddEdgeRequest,
  AddNodeRequest,
  HtmlGraphBuilder,
} from "@html-graph/html-graph";

const canvas = new HtmlGraphBuilder().build();

const node1 = document.createElement("div");
node1.classList.add("node");
node1.innerText = "1";

const node2 = document.createElement("div");
node2.classList.add("node");
node2.innerText = "2";

const port1 = document.createElement("div");
port1.classList.add("port");
port1.style.right = "0";

const port2 = document.createElement("div");
port2.classList.add("port");
port2.style.left = "0";

node1.appendChild(port1);
node2.appendChild(port2);

const canvasElement = document.getElementById("canvas")!;

const addNode1Request: AddNodeRequest = {
  element: node1,
  x: 200,
  y: 300,
  ports: [{ id: "port-1", element: port1 }],
};

const addNode2Request: AddNodeRequest = {
  element: node2,
  x: 600,
  y: 500,
  ports: [{ id: "port-2", element: port2 }],
};

const addEdgeRequest: AddEdgeRequest = {
  from: "port-1",
  to: "port-2",
};

canvas
  .attach(canvasElement)
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdgeRequest);
