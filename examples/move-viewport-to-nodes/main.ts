import { HtmlGraphBuilder } from "@html-graph/html-graph";

const canvas = new HtmlGraphBuilder()
  .setOptions({
    background: {
      type: "dots",
    },
    edges: {
      shape: {
        hasTargetArrow: true,
      },
      priority: 1,
    },
    nodes: {
      priority: 0,
    },
  })
  .setUserDraggableNodes({
    grabPriorityStrategy: "freeze",
  })
  .setUserTransformableCanvas()
  .build();

const node1 = document.createElement("div");
node1.classList.add("node");

const node2 = document.createElement("div");
node2.classList.add("node");
node2.innerText = "2";

const node3 = document.createElement("div");
node3.classList.add("node");
node3.innerText = "3";

const port1 = document.createElement("div");
port1.classList.add("port");
port1.style.right = "0";

const port2 = document.createElement("div");
port2.classList.add("port");

const port3 = document.createElement("div");
port3.classList.add("port");

node1.appendChild(port1);
node2.appendChild(port2);
node3.appendChild(port3);

const btn1 = document.createElement("button");
btn1.innerText = "Move to 2 and 3";
node1.appendChild(btn1);

const canvasElement = document.getElementById("canvas")!;

canvas
  .attach(canvasElement)
  .addNode({ id: "node-1", element: node1, x: 700, y: 300 })
  .markPort({ nodeId: "node-1", element: port1, id: "port-1" })
  .addNode({ id: "node-2", element: node2, x: 1700, y: 300 })
  .markPort({ nodeId: "node-2", element: port2, id: "port-2" })
  .addNode({ id: "node-3", element: node3, x: 2000, y: 300 })
  .markPort({ nodeId: "node-3", element: port3, id: "port-3" })
  .addEdge({ from: "port-1", to: "port-2" })
  .addEdge({ from: "port-2", to: "port-3" });

btn1.addEventListener("click", () => {
  const nodes = [
    canvas.model.getNode("node-2")!,
    canvas.model.getNode("node-3")!,
  ];

  const [x, y] = nodes.reduce(
    (acc, cur) => [acc[0] + cur.x, acc[1] + cur.y],
    [0, 0],
  );

  const avgX = x / nodes.length;
  const avgY = y / nodes.length;
  const rect = canvasElement.getBoundingClientRect();
  const sv = canvas.transformation.getViewportMatrix().scale;

  const targetX = avgX - (sv * rect.width) / 2;
  const targetY = avgY - (sv * rect.height) / 2;

  canvas.patchViewportMatrix({ dx: targetX, dy: targetY });
});
