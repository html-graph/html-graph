import { AddNodeRequest } from "@html-graph/html-graph";

export function createBasicNode(params: {
  name: string;
  x: number;
  y: number;
  frontPortId: string;
  backPortId: string;
}): AddNodeRequest {
  const node = document.createElement("div");
  node.classList.add("node");

  const frontPort = document.createElement("div");
  node.appendChild(frontPort);

  const text = document.createElement("div");
  text.innerText = params.name;
  node.appendChild(text);

  const backPort = document.createElement("div");
  node.appendChild(backPort);

  return {
    element: node,
    x: params.x,
    y: params.y,
    ports: [
      { id: params.frontPortId, element: frontPort },
      { id: params.backPortId, element: backPort },
    ],
  };
}
