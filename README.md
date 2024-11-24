<h1>
  <img src="/media/favicon.png" alt="HTMLGraph" width="25" height="25"/> HTMLGraph
</h1>

## Graph visualization library that enables to customize nodes using HTML

![CI](https://github.com/html-graph/html-graph/actions/workflows/ci.yml/badge.svg?branch=master)

Visit <a target="_blank" href="https://html-graph.github.io">live demo</a>

<a target="_blank" href="https://html-graph.github.io/">
    <img width="100%" src="https://raw.githubusercontent.com/html-graph/html-graph/master/media/full-demo.gif"/>
</a>

Instead of connecting nodes dirrectly this library uses concept of ports, which provide greater fexibility at managing connections.
Port is an entity of the node to which connection can be attached to.

This library fits for tasks where easy nodes customization and interactiveness are required.

## Features:

- easy nodes customization using HTML
- wide configuration options out of the box
- draggable and scalable canvas with draggable nodes
- exhaustive set of examples
- typescript support
- mobile devices support

## Getting started:

```
npm i @html-graph/core
```

```typescript
import { ApiPortPayload, CanvasBuilder } from "@html-graph/core";

const canvasElement = document.getElementById("canvas")!;

const canvas = new CanvasBuilder()
  .options({
    background: { type: "dots" },
  })
  .draggable()
  .transformable()
  .build();

function createNode(
  name: string,
  frontPortId: string,
  backPortId: string,
): [HTMLElement, Record<string, ApiPortPayload>] {
  const node = document.createElement("div");
  node.classList.add("node");

  const frontPort = document.createElement("div");
  frontPort.classList.add("port");
  node.appendChild(frontPort);

  const text = document.createElement("div");
  text.innerText = name;
  node.appendChild(text);

  const backPort = document.createElement("div");
  backPort.classList.add("port");
  node.appendChild(backPort);

  return [node, { [frontPortId]: frontPort, [backPortId]: backPort }];
}

const [node1, ports1] = createNode("Node 1", "port-1-1", "port-1-2");
const [node2, ports2] = createNode("Node 2", "port-2-1", "port-2-2");

canvas
  .attach(canvasElement)
  .addNode({ element: node1, x: 200, y: 400, ports: ports1 })
  .addNode({ element: node2, x: 600, y: 500, ports: ports2 })
  .addConnection({ from: "port-1-2", to: "port-2-1" });
```

Refer to [Examples](examples) for more.

## Run examples locally

Use node version >= 20

```
npm install

npm run start
```

or

```
docker compose up
```

Open `http://localhost:3100`
