import { AddNodeRequest, Identifier } from "@html-graph/html-graph";

export function createInOutNode(params: {
  id?: Identifier;
  name: string;
  x?: number | null;
  y?: number | null;
  frontPort: { id: string; direction?: number | undefined };
  backPort: { id: string; direction?: number | undefined };
  priority?: number;
}): AddNodeRequest {
  const node = document.createElement("div");
  node.classList.add("node");

  const frontPortElement = document.createElement("div");
  frontPortElement.classList.add("node-port");
  node.appendChild(frontPortElement);

  const textElement = document.createElement("div");
  textElement.innerText = params.name;
  node.appendChild(textElement);

  const backPortElement = document.createElement("div");
  backPortElement.classList.add("node-port");
  node.appendChild(backPortElement);

  const { frontPort, backPort } = params;

  return {
    id: params.id,
    element: node,
    x: params.x,
    y: params.y,
    ports: [
      {
        id: frontPort.id,
        element: frontPortElement,
        direction: frontPort.direction,
      },
      {
        id: backPort.id,
        element: backPortElement,
        direction: backPort.direction,
      },
    ],
    priority: params.priority,
  };
}
