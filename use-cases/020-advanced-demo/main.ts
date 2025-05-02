import {
  AddEdgeRequest,
  AddNodeRequest,
  CanvasDefaults,
  CanvasBuilder,
} from "@html-graph/html-graph";
import { AdvancedDemoHelper } from "./advanced-demo-helper";

const canvasElement = document.getElementById("canvas")!;

const canvasDefaults: CanvasDefaults = {
  nodes: {
    centerFn: () => ({ x: 0, y: 0 }),
  },
  edges: {
    shape: {
      color: "var(--color-edge)",
      hasTargetArrow: true,
    },
  },
};

const builder = new CanvasBuilder();

const canvas = builder
  .setDefaults(canvasDefaults)
  .enableBackground()
  .enableUserDraggableNodes()
  .enableUserTransformableViewport()
  .enableResizeReactiveNodes()
  .setElement(canvasElement)
  .build();

const helper = new AdvancedDemoHelper();

const addNode1Request: AddNodeRequest = helper.createNode(
  "Node 1",
  200,
  400,
  null,
  {
    "output-1-1": "Port 1",
    "output-1-2": "Port 2",
  },
);

const addNode2Request: AddNodeRequest = helper.createNode(
  "Node 2",
  600,
  500,
  "input-2",
  {
    "output-2-1": "Port 1",
    "output-2-2": "Port 2",
    "output-2-3": "Port 3",
  },
  helper.createTextArea(),
);

const addNode3Request: AddNodeRequest = helper.createNode(
  "Node 3",
  600,
  200,
  "input-3",
  {
    "output-3-1": "Port 1",
    "output-3-2": "Port 2",
    "output-3-3": "Port 3",
  },
);

const addNode4Request: AddNodeRequest = helper.createNode(
  "Node 4",
  1100,
  400,
  "input-4",
  {
    "output-4-1": "Port 1",
  },
);

const addNode5Request: AddNodeRequest = helper.createNode(
  "Node 5",
  1100,
  550,
  "input-5",
  {
    "output-5-1": "Port 1",
    "output-5-2": "Port 2",
  },
);

const addEdge1Request: AddEdgeRequest = {
  from: "output-1-1",
  to: "input-3",
};

const addEdge2Request: AddEdgeRequest = {
  from: "output-1-2",
  to: "input-2",
};

const addEdge3Request: AddEdgeRequest = {
  from: "output-2-1",
  to: "input-4",
};

const addEdge4Request: AddEdgeRequest = {
  from: "output-3-1",
  to: "input-4",
};

const addEdge5Request: AddEdgeRequest = {
  from: "output-2-2",
  to: "input-5",
};

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addNode(addNode3Request)
  .addNode(addNode4Request)
  .addNode(addNode5Request)
  .addEdge(addEdge1Request)
  .addEdge(addEdge2Request)
  .addEdge(addEdge3Request)
  .addEdge(addEdge4Request)
  .addEdge(addEdge5Request);
