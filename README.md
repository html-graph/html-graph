<h1>
  <img src="/media/favicon.png" alt="HTMLGraph" width="25" height="25"/> HTMLGraph
</h1>

### Graph visualization library that enables nodes customization using HTML


<video width="1280" height="720" autoplay muted loop src="/media/advanced-demo.webm"></video>

<a target="_blank" href="https://html-graph.github.io/use-cases/advanced-demo/">
    <!-- <img width="100%" src="https://raw.githubusercontent.com/html-graph/html-graph/master/media/full-demo.gif"/> -->
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

class Application {
  constructor(element) {
    this.canvas = new CanvasBuilder(element)
      .setDefaults({
        edges: {
          shape: {
            hasTargetArrow: true,
          },
        },
      })
      .enableUserDraggableNodes()
      .enableUserTransformableViewport()
      .enableBackground()
      .build();
  }

  initGraph() {
    this.canvas
      .addNode(
        this.createNode({
          name: "Node 1",
          x: 200,
          y: 400,
          frontPortId: "node-1-in",
          backPortId: "node-1-out",
        }),
      )
      .addNode(
        this.createNode({
          name: "Node 2",
          x: 600,
          y: 500,
          frontPortId: "node-2-in",
          backPortId: "node-2-out",
        }),
      )
      .addEdge({ from: "node-1-out", to: "node-2-in" });
  }

  createNode({ name, x, y, frontPortId, backPortId }) {
    const nodeElement = document.createElement("div");
    const text = document.createElement("div");
    const frontPortElement = document.createElement("div");
    const backPortElement = document.createElement("div");

    nodeElement.classList.add("node");
    frontPortElement.classList.add("port");
    backPortElement.classList.add("port");
    text.innerText = name;

    nodeElement.appendChild(frontPortElement);
    nodeElement.appendChild(text);
    nodeElement.appendChild(backPortElement);

    return {
      element: nodeElement,
      x: x,
      y: y,
      ports: [
        { id: frontPortId, element: frontPortElement },
        { id: backPortId, element: backPortElement },
      ],
    };
  }
}

const element = document.getElementById("canvas");
const app = new Application(element);

app.initGraph();
```
