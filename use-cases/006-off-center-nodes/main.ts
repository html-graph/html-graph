import { HtmlGraphBuilder } from "@html-graph/html-graph";

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

const node1 = document.createElement("div");
node1.classList.add("node");

const text1 = document.createElement("div");
text1.classList.add("text");
text1.innerText = "1";
node1.appendChild(text1);

const node2 = document.createElement("div");
node2.classList.add("node");

const text2 = document.createElement("div");
text2.classList.add("text");
text2.innerText = "2";
node2.appendChild(text2);

const port1 = document.createElement("div");
port1.classList.add("port");
port1.style.right = "0";

const port2 = document.createElement("div");
port2.classList.add("port");
port2.style.left = "0";

node1.appendChild(port1);
node2.appendChild(port2);

const canvasElement = document.getElementById("canvas")!;

canvas
  .attach(canvasElement)
  .addNode({
    element: node1,
    x: 200,
    y: 300,
    ports: [{ id: "port-1", element: port1 }],
    centerFn: (w, h) => ({ x: w, y: h }),
  })
  .addNode({
    element: node2,
    x: 600,
    y: 500,
    ports: [{ id: "port-2", element: port2 }],
    centerFn: () => ({ x: 0, y: 0 }),
  })
  .addEdge({ from: "port-1", to: "port-2" });

let i = 0;

setInterval(() => {
  text1.innerText = i % 2 ? "1" : "111111111111";
  text2.innerText = i % 2 ? "222222222222" : "2";
  i++;
}, 1000);
