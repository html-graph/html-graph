import {
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  CanvasDefaults,
  ConnectablePortsConfig,
  Identifier,
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
  connectionTypeResolver: (portId: Identifier) => {
    const idStr = portId as string;

    return idStr.endsWith("-out") ? "direct" : "reverse";
  },
  connectionAllowedVerifier: (request) => {
    const existingEdge = canvas.graph.getAllEdgeIds().find((edgeId) => {
      const edge = canvas.graph.getEdge(edgeId)!;

      return edge.from === request.from && edge.to === request.to;
    });

    if (existingEdge !== undefined) {
      return false;
    }

    const strFrom = request.from as string;
    const strTo = request.to as string;

    return strFrom.endsWith("-out") && strTo.endsWith("-in");
  },
  dragPortDirection: "closest-connectable-port",
  events: {
    onEdgeCreationPrevented: (request) => {
      console.log(`prevented edge creation`);
      console.log(request);
    },
    onEdgeCreationInterrupted: (params) => {
      console.log(`interrupted edge creation`);
      console.log(params);
    },
  },
};

const canvas: Canvas = builder
  .setDefaults(defaults)
  .enableUserDraggableNodes()
  .enableUserConnectablePorts(connectablePortConfig)
  .enableUserTransformableViewport()
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
  topPortId: string;
  bottomPortId: string;
  leftPortId: string;
  rightPortId: string;
}): AddNodeRequest {
  const node = document.createElement("div");
  node.classList.add("node");

  const middle = document.createElement("div");
  middle.classList.add("middle");

  const leftPort = createPortElement();
  middle.appendChild(leftPort);

  const text = document.createElement("div");
  text.innerText = params.name;
  middle.appendChild(text);

  const rightPort = createPortElement();
  middle.appendChild(rightPort);

  const topPort = createPortElement();
  node.appendChild(topPort);

  node.appendChild(middle);

  const bottomPort = createPortElement();
  node.appendChild(bottomPort);

  return {
    element: node,
    x: params.x,
    y: params.y,
    ports: [
      { id: params.topPortId, element: topPort, direction: Math.PI / 2 },
      { id: params.bottomPortId, element: bottomPort, direction: Math.PI / 2 },
      { id: params.leftPortId, element: leftPort, direction: -Math.PI },
      { id: params.rightPortId, element: rightPort, direction: 0 },
    ],
  };
}

const addNode1Request: AddNodeRequest = createInOutNode({
  name: "Node 1",
  x: 200,
  y: 400,
  topPortId: "node-1-in",
  bottomPortId: "node-1-bottom-out",
  leftPortId: "node-1-left-out",
  rightPortId: "node-1-right-out",
});

const addNode2Request: AddNodeRequest = createInOutNode({
  name: "Node 2",
  x: 500,
  y: 500,
  topPortId: "node-2-in",
  bottomPortId: "node-2-bottom-out",
  leftPortId: "node-2-left-out",
  rightPortId: "node-2-right-out",
});

const addNode3Request: AddNodeRequest = createInOutNode({
  name: "Node 3",
  x: 700,
  y: 200,
  topPortId: "node-3-in",
  bottomPortId: "node-3-bottom-out",
  leftPortId: "node-3-left-out",
  rightPortId: "node-3-right-out",
});

canvas
  .addNode(addNode1Request)
  .addNode(addNode2Request)
  .addNode(addNode3Request);
