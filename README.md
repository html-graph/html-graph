# GraphFlow

## Graph visualization library that allows to customize nodes using html 

<img width="100%" src="https://raw.githubusercontent.com/dmarov/graphflow/master/media/demo.gif"/>

#### At the moment this library is under development

Features:

* support for fully customizable html nodes
* support for fully customizable svg connections
* connections between nodes via fully customizable ports
* wide configuration options for canvas, nodes and connections
* automatic adjustment of canvas and nodes on resize
* draggable and scalable canvas with draggable nodes
* zero dependencies
* support for 1k+ nodes and connections in viewport at the same time without lagging

## Probable API:
```
const el = document.querySelector("#canvas");

const canvas = new GraphFlow.Canvas(el, { 
    scale: { enabled: true },
    shift: { enabled: true },
    nodes: { draggable: true }
});

function createPortElement() {
    return document.createElement('div');
}

function createNodeElement(name) {
    const node =  document.createElement('div');
    const text =  document.createElement('div');

    node.classList.add("node");
    node.appendChild(text);

    text.innerText = name;

    const frontPort = createPortElement();
    node.prepend(frontPort);

    const backPort = createPortElement();
    node.appendChild(backPort);

    node.inPort = frontPort;
    node.outPort = backPort;

    return node;
}

const node1 = createNodeElement("Node 1");
const node2 = createNodeElement("Node 2");

canvas
    .addNode({ id: "node-1", element: node1, x: 200, y: 400 })
    .setPort({ id: "port-1-1", element: node1.inPort, nodeId: "node-1" })
    .setPort({ id: "port-1-2", element: node1.outPort, nodeId: "node-1" })
    .addNode({ id: "node-2", element: node2, x: 600, y: 500 })
    .setPort({ id: "port-2-1", element: node2.inPort, nodeId: "node-2" })
    .setPort({ id: "port-2-2", element: node2.outPort, nodeId: "node-2" })
    .connectPorts({ id: "con-1", from: "port-1-2", to: "port-2-1" });
```
