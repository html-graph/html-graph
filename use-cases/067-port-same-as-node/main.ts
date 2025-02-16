import {
  AddEdgeRequest,
  AddNodeRequest,
  Canvas,
  CoreOptions,
  DragOptions,
  HtmlGraphBuilder,
} from "@html-graph/html-graph";

export function createNode(params: {
  name: string;
  x: number;
  y: number;
  portId: string;
}): AddNodeRequest {
  const node = document.createElement("div");
  node.classList.add("node");

  node.innerText = params.name;

  return {
    element: node,
    x: params.x,
    y: params.y,
    ports: [{ id: params.portId, element: node }],
  };
}

const builder: HtmlGraphBuilder = new HtmlGraphBuilder();

const coreOptions: CoreOptions = {
  edges: {
    shape: {
      type: "straight",
      arrowLength: 0,
      arrowOffset: 0,
    },
  },
  nodes: {
    priority: 1,
  },
};

const dragOptions: DragOptions = {
  moveOnTop: false,
};

builder.setOptions(coreOptions).setUserDraggableNodes(dragOptions);

const canvas: Canvas = builder.build();
const canvasElement: HTMLElement = document.getElementById("canvas")!;

const addNode1Request: AddNodeRequest = createNode({
  name: "Node 1",
  x: 200,
  y: 400,
  portId: "node-1-port",
});

const addNode2Request: AddNodeRequest = createNode({
  name: "Node 2",
  x: 500,
  y: 500,
  portId: "node-2-port",
});

const addEdgeRequest: AddEdgeRequest = {
  from: "node-1-port",
  to: "node-2-port",
};

canvas
  .attach(canvasElement)
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addEdge(addEdgeRequest);
