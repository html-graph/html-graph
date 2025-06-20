import {
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  CanvasDefaults,
  ConnectablePortsConfig,
} from "@html-graph/html-graph";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);

const defaults: CanvasDefaults = {
  edges: {
    shape: {
      hasTargetArrow: true,
    },
  },
};

const connectablePortConfig: ConnectablePortsConfig = {
  connectionTypeResolver: (portId: unknown) => {
    const idStr = portId as string;

    return idStr.endsWith("-out") ? "direct" : "reverse";
  },
  connectionPreprocessor: (request) => {
    const existingEdge = canvas.graph.getAllEdgeIds().find((edgeId) => {
      const edge = canvas.graph.getEdge(edgeId)!;

      return edge.from === request.from && edge.to === request.to;
    });

    if (existingEdge !== undefined) {
      return null;
    }

    const strFrom = request.from as string;
    const strTo = request.to as string;

    if (strFrom.endsWith("-out") && strTo.endsWith("-in")) {
      return request;
    }

    return null;
  },
};

const canvas: Canvas = builder
  .setDefaults(defaults)
  .enableUserConnectablePorts(connectablePortConfig)
  .enableBackground()
  .build();

function createPortElement(): HTMLElement {
  const port = document.createElement("div");
  port.classList.add("node-port");

  const grabArea = document.createElement("div");
  grabArea.classList.add("node-port-grab-area");

  port.appendChild(grabArea);

  const pin = document.createElement("div");
  pin.classList.add("node-port-pin");

  grabArea.appendChild(pin);

  return port;
}

function createInOutNode(params: {
  name: string;
  x: number;
  y: number;
  frontPortId: string;
  backPortId: string;
}): AddNodeRequest {
  const node = document.createElement("div");
  node.classList.add("node");

  const frontPort = createPortElement();
  node.appendChild(frontPort);

  const text = document.createElement("div");
  text.innerText = params.name;
  node.appendChild(text);

  const backPort = createPortElement();
  node.appendChild(backPort);

  return {
    element: node,
    x: params.x,
    y: params.y,
    ports: [
      { id: params.frontPortId, element: frontPort },
      { id: `copy-${params.frontPortId}`, element: frontPort },
      { id: params.backPortId, element: backPort },
      { id: `copy-${params.backPortId}`, element: backPort },
    ],
  };
}

const addNode1Request: AddNodeRequest = createInOutNode({
  name: "Node 1",
  x: 200,
  y: 400,
  frontPortId: "node-1-in",
  backPortId: "node-1-out",
});

const addNode2Request: AddNodeRequest = createInOutNode({
  name: "Node 2",
  x: 500,
  y: 500,
  frontPortId: "node-2-in",
  backPortId: "node-2-out",
});

const addNode3Request: AddNodeRequest = createInOutNode({
  name: "Node 3",
  x: 700,
  y: 200,
  frontPortId: "node-3-in",
  backPortId: "node-3-out",
});

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addNode(addNode3Request)
  .unmarkPort("node-1-out");
