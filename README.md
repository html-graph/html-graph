# GraphFlow

## Graph visualization library that allows to customize nodes using html 

<img width="100%" src="https://raw.githubusercontent.com/dmarov/graphflow/master/media/demo.gif"/>

#### At the moment this library is under development and might be unstable

Features:

* support for fully customizable html nodes
* support for fully customizable svg connections
* connections between nodes via fully customizable ports
* wide configuration options for canvas, nodes and connections
* automatic adjustment of canvas and nodes on resize
* draggable and scalable canvas with draggable nodes
* zero dependencies
* typescript support

## How to use:
```
npm i @diyguy/graphflow
```

```typescript
import { Canvas } from "@diyguy/graphflow";

const canvasElement = document.createElement('div');
document.body.appendChild(canvasElement);

const canvas = new Canvas(canvasElement, { 
    scale: { enabled: true },
    shift: { enabled: true },
    nodes: { draggable: true }
});

function createNodeElement(name: string): [HTMLElement, HTMLElement, HTMLElement] {
    const node =  document.createElement('div');
    const text =  document.createElement('div');

    node.classList.add("node");
    node.appendChild(text);

    text.innerText = name;

    const frontPort = document.createElement('div');
    node.prepend(frontPort);

    const backPort = document.createElement('div');
    node.appendChild(backPort);

    return [node, frontPort, backPort];
}

const node1 = createNodeElement("Node 1");
const node2 = createNodeElement("Node 2");

canvas
    .addNode({ id: "node-1", element: node1[0], x: 200, y: 400 })
    .markAsPort({ id: "port-1-1", element: node1[1], nodeId: "node-1" })
    .markAsPort({ id: "port-1-2", element: node1[2], nodeId: "node-1" })
    .addNode({ id: "node-2", element: node2[0], x: 600, y: 500 })
    .markAsPort({ id: "port-2-1", element: node2[1], nodeId: "node-2" })
    .markAsPort({ id: "port-2-2", element: node2[2], nodeId: "node-2" })
    .connectPorts({ id: "con-1", from: "port-1-2", to: "port-2-1" });
```

```css
html, body {
    height: 100%;
    padding: 0;
    margin: 0;
}

body {
    display: flex;
    flex-direction: column;
}

#canvas {
    flex-grow: 1;
}

.node  {
    width: 150px;
    max-width: 150px;
    height: 50px;
    max-height: 50px;
    background: #ffdbab;
    border: 1px solid #bababa;
    border-radius: 1000px;
    white-space: nowrap;
    user-select: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```
