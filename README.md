<h1>
  <img src="/media/favicon.png" alt="HTMLGraph" width="25" height="25"/> HTMLGraph
</h1>

### Graph visualization library that enables nodes customization using HTML

![CI](https://github.com/html-graph/html-graph/actions/workflows/ci.yml/badge.svg?branch=master)

<a target="_blank" href="https://html-graph.github.io/">
    <img width="100%" src="https://raw.githubusercontent.com/html-graph/html-graph/master/media/full-demo.gif"/>
</a>

Visit <a target="_blank" href="https://html-graph.github.io">live demo</a>.

Instead of connecting nodes directly this library uses concept of ports, which provide greater fexibility at managing edges.
Port is an entity of a node to which edge can be attached to.

## Features:

- easy nodes customization using HTML
- wide configuration options out of the box
- draggable and scalable canvas with draggable nodes
- exhaustive set of examples
- typescript support
- mobile devices support

## Getting started:

```
npm i @html-graph/html-graph
```

```typescript
import { HtmlGraphBuilder, AddNodeRequest } from "@html-graph/html-graph";

const canvas = new HtmlGraphBuilder()
  .setOptions({
    background: {
      type: "dots",
    },
    edges: {
      shape: {
        hasTargetArrow: true,
      },
    },
  })
  .setUserDraggableNodes()
  .setUserTransformableCanvas()
  .build();

function createNode(params: {
  name: string;
  x: number;
  y: number;
  frontPortId: string;
  backPortId: string;
}): AddNodeRequest {
  const node = document.createElement("div");
  node.classList.add("node");

  const frontPort = document.createElement("div");
  frontPort.classList.add("port");
  node.appendChild(frontPort);

  const text = document.createElement("div");
  text.innerText = params.name;
  node.appendChild(text);

  const backPort = document.createElement("div");
  backPort.classList.add("port");
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

const node1 = createNode({
  name: "Node 1",
  x: 200,
  y: 400,
  frontPortId: "port-1-1",
  backPortId: "port-1-2",
});

const node2 = createNode({
  name: "Node 2",
  x: 600,
  y: 500,
  frontPortId: "port-2-1",
  backPortId: "port-2-2",
});

const canvasElement = document.getElementById("canvas")!;

canvas
  .attach(canvasElement)
  .addNode(node1)
  .addNode(node2)
  .addEdge({ from: "port-1-2", to: "port-2-1" });
```

Refer to [Use cases](use-cases) for more.

## Run use cases

```
npm install
npm run start
```

or

```
docker compose up
```

Open `http://localhost:3100`
