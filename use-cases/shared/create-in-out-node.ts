import { AddNodeRequest } from "@html-graph/html-graph";

export function createInOutNode(params: {
  id?: unknown;
  name: string;
  x: number;
  y: number;
  frontPortId: string;
  backPortId: string;
  priority?: number;
}): AddNodeRequest {
  const node = document.createElement("div");
  node.classList.add("node");

  const frontPort = document.createElement("div");
  frontPort.classList.add("node-port");
  node.appendChild(frontPort);

  const text = document.createElement("div");
  text.innerText = params.name;
  node.appendChild(text);

  const backPort = document.createElement("div");
  backPort.classList.add("node-port");
  node.appendChild(backPort);

  return {
    id: params.id,
    element: node,
    x: params.x,
    y: params.y,
    ports: [
      { id: params.frontPortId, element: frontPort },
      { id: params.backPortId, element: backPort },
    ],
    priority: params.priority,
  };
}
