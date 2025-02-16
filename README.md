<h1>
  <img src="/media/favicon.png" alt="HTMLGraph" width="25" height="25"/> HTMLGraph
</h1>

### Graph visualization library that enables nodes customization using HTML

<a target="_blank" href="https://html-graph.github.io/use-cases/020-advanced-demo/">
    <img width="100%" src="https://raw.githubusercontent.com/html-graph/html-graph/master/media/full-demo.gif"/>
</a>

Instead of connecting nodes directly this library uses concept of ports, which provide greater fexibility at managing edges.
Port is an entity of a node to which an edge can be attached to.

Visit <a target="_blank" href="https://html-graph.github.io/use-cases/">use cases</a> and [use cases implementation](use-cases).

## Getting started:

```
npm i @html-graph/html-graph
```

```javascript
import { HtmlGraphBuilder } from "@html-graph/html-graph";

function createNode({ name, x, y, frontPortId, backPortId }) {
  const node = document.createElement("div");
  const text = document.createElement("div");
  const frontPort = document.createElement("div");
  const backPort = document.createElement("div");

  node.classList.add("node");
  frontPort.classList.add("port");
  backPort.classList.add("port");
  text.innerText = name;

  node.appendChild(backPort);
  node.appendChild(text);
  node.appendChild(frontPort);

  return {
    element: node,
    x: x,
    y: y,
    ports: [
      { id: frontPortId, element: frontPort },
      { id: backPortId, element: backPort },
    ],
  };
}

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
  .setResizeReactiveNodes()
  .build();

const node1 = createNode({
  name: "Node 1",
  x: 200,
  y: 400,
  frontPortId: "node-1-in",
  backPortId: "node-1-out",
});

const node2 = createNode({
  name: "Node 2",
  x: 600,
  y: 500,
  frontPortId: "node-2-in",
  backPortId: "node-2-out",
});

const canvasElement = document.getElementById("canvas");

canvas
  .attach(canvasElement)
  .addNode(node1)
  .addNode(node2)
  .addEdge({ from: "node-1-out", to: "node-2-in" });
```
