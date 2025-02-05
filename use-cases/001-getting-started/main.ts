import {
  AddEdgeRequest,
  AddNodeRequest,
  HtmlGraphBuilder,
} from "@html-graph/html-graph";

const canvas = new HtmlGraphBuilder()
  .setOptions({
    nodes: {
      priority: 1,
    },
    edges: {
      priority: 0,
      shape: {
        type: "bezier",
        arrowLength: 25,
      },
    },
  })
  .build();

const createNode = (params: {
  portId: string;
  x: number;
  y: number;
}): AddNodeRequest => {
  const node = document.createElement("div");
  node.classList.add("node");

  const port = document.createElement("div");
  port.classList.add("port");

  node.appendChild(port);

  return {
    element: node,
    x: params.x,
    y: params.y,
    ports: [{ id: params.portId, element: port }],
  };
};

const canvasElement = document.getElementById("canvas")!;

const addEdgeRequest: AddEdgeRequest = {
  from: "port-1",
  to: "port-2",
};

canvas
  .attach(canvasElement)
  .addNode(createNode({ portId: "port-1", x: 100, y: 100 }))
  .addNode(createNode({ portId: "port-2", x: 500, y: 500 }))
  .addEdge(addEdgeRequest);
