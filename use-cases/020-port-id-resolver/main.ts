import {
  AddNodeRequest,
  CanvasBuilder,
  Identifier,
} from "@html-graph/html-graph";

const createPortElement = (): HTMLElement => {
  const element = document.createElement("div");
  element.classList.add("node-port");

  const grabArea = document.createElement("div");
  grabArea.classList.add("node-port-grab-area");

  element.appendChild(grabArea);

  return element;
};

const createNode = (params: {
  nodeId: Identifier;
  x: number;
  y: number;
}): AddNodeRequest => {
  const node = document.createElement("div");
  const portsContainer = document.createElement("div");
  const topPort = createPortElement();
  const bottomPort = createPortElement();
  const leftPort = createPortElement();
  const rightPort = createPortElement();

  node.classList.add("node");
  portsContainer.classList.add("node-ports-container");
  topPort.classList.add("node-port");
  bottomPort.classList.add("node-port");
  leftPort.classList.add("node-port");
  rightPort.classList.add("node-port");

  topPort.classList.add("node-port-top");
  bottomPort.classList.add("node-port-bottom");
  leftPort.classList.add("node-port-left");
  rightPort.classList.add("node-port-right");

  portsContainer.appendChild(topPort);
  portsContainer.appendChild(bottomPort);
  portsContainer.appendChild(leftPort);
  portsContainer.appendChild(rightPort);
  node.appendChild(portsContainer);

  return {
    element: node,
    x: params.x,
    y: params.y,
    ports: [
      {
        id: `${params.nodeId}-top-in`,
        element: topPort,
        direction: Math.PI / 2,
      },
      {
        id: `${params.nodeId}-bottom-in`,
        element: bottomPort,
        direction: -Math.PI / 2,
      },
      { id: `${params.nodeId}-left-in`, element: leftPort, direction: 0 },
      {
        id: `${params.nodeId}-right-in`,
        element: rightPort,
        direction: Math.PI,
      },
      {
        id: `${params.nodeId}-top-out`,
        element: topPort,
        direction: -Math.PI / 2,
      },
      {
        id: `${params.nodeId}-bottom-out`,
        element: bottomPort,
        direction: Math.PI / 2,
      },
      {
        id: `${params.nodeId}-left-out`,
        element: leftPort,
        direction: Math.PI,
      },
      {
        id: `${params.nodeId}-right-out`,
        element: rightPort,
        direction: 0,
      },
    ],
  };
};

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const canvas = new CanvasBuilder(canvasElement)
  .setDefaults({
    nodes: { priority: 0 },
    edges: {
      priority: 1,
      shape: {
        type: "orthogonal",
        hasTargetArrow: true,
      },
    },
  })
  .enableUserTransformableViewport()
  .enableUserDraggableNodes({ moveOnTop: false })
  .enableUserConnectablePorts({
    connectionTypeResolver: (portId) => {
      return (portId as string).endsWith("-out") ? "direct" : "reverse";
    },
    grabbedPortIdResolver: (portIds) =>
      portIds.find((portId) => (portId as string).endsWith("-out")) ?? null,
    releasedPortIdResolver: (portIds) =>
      portIds.find((portId) => (portId as string).endsWith("-in")) ?? null,
    dragPortDirection: "nearest-connectable-port",
  })
  .enableBackground()
  .build();

canvas
  .addNode(
    createNode({
      x: 200,
      y: 50,
      nodeId: "node-1",
    }),
  )
  .addNode(
    createNode({
      x: 600,
      y: 250,
      nodeId: "node-2",
    }),
  )
  .patchContentMatrix({ x: 100, y: 200 });
