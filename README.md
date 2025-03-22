<h1>
  <img src="/media/favicon.png" alt="HTMLGraph" width="25" height="25"/> HTMLGraph
</h1>

### Graph visualization library that enables nodes customization using HTML

<a target="_blank" href="https://html-graph.github.io/use-cases/advanced-demo/">
    <img width="100%" src="https://raw.githubusercontent.com/html-graph/html-graph/master/media/full-demo.gif"/>
</a>

Instead of connecting nodes directly, this library utilizes the concept of ports,
which provide greater flexibility in managing edges. A port is an entity on a
node to which edges can be attached.

Visit the <a target="_blank" href="https://html-graph.github.io">DOCUMENTATION</a> for more details.

## Getting started:

```
npm i @html-graph/html-graph
```

```javascript
import { CanvasBuilder } from "@html-graph/html-graph";

function createNode({ name, x, y, frontPortId, backPortId }) {
  const node = document.createElement("div");
  const text = document.createElement("div");
  const frontPort = document.createElement("div");
  const backPort = document.createElement("div");

  node.classList.add("node");
  frontPort.classList.add("port");
  backPort.classList.add("port");
  text.innerText = name;

  node.appendChild(frontPort);
  node.appendChild(text);
  node.appendChild(backPort);

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

const canvas = new CanvasBuilder()
  .setOptions({
    edges: {
      shape: {
        hasTargetArrow: true,
      },
    },
  })
  .enableUserDraggableNodes()
  .enableUserTransformableViewport()
  .enableResizeReactiveNodes()
  .enableVirtualScroll()
  .build();

canvas
  .attach(document.getElementById("canvas"))
  .addNode(
    createNode({
      name: "Node 1",
      x: 200,
      y: 400,
      frontPortId: "node-1-in",
      backPortId: "node-1-out",
    }),
  )
  .addNode(
    createNode({
      name: "Node 2",
      x: 600,
      y: 500,
      frontPortId: "node-2-in",
      backPortId: "node-2-out",
    }),
  )
  .addEdge({ from: "node-1-out", to: "node-2-in" });
```
