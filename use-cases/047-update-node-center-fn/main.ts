import {
  HtmlGraphBuilder,
  CenterFn,
  AddNodePorts,
} from "@html-graph/html-graph";

const canvas = new HtmlGraphBuilder()
  .setOptions({
    edges: {
      shape: {
        hasTargetArrow: true,
      },
    },
  })
  .setUserDraggableNodes()
  .setUserTransformableCanvas()
  .build();

function createNode(
  name: string,
  frontPortId: string,
  backPortId: string,
): [HTMLElement, AddNodePorts] {
  const node = document.createElement("div");
  node.classList.add("node");

  const frontPort = document.createElement("div");
  node.appendChild(frontPort);

  const text = document.createElement("div");
  text.innerText = name;
  node.appendChild(text);

  const backPort = document.createElement("div");
  node.appendChild(backPort);

  return [
    node,
    [
      { id: frontPortId, element: frontPort },
      { id: backPortId, element: backPort },
    ],
  ];
}

const [node1, ports1] = createNode("Node 1", "port-1-1", "port-1-2");

const canvasElement = document.getElementById("canvas")!;

canvas.attach(canvasElement).addNode({
  id: "node-1",
  element: node1,
  x: 400,
  y: 450,
  ports: ports1,
});

let i = 0;

const topLeftCenterFn: CenterFn = () => ({ x: 0, y: 0 });
const bottomRightCenterFn: CenterFn = (w, h) => ({ x: w, y: h });

setInterval(() => {
  if (i % 2) {
    canvas.updateNode("node-1", { centerFn: topLeftCenterFn });
  } else {
    canvas.updateNode("node-1", { centerFn: bottomRightCenterFn });
  }

  i++;
}, 1000);
