# GraphFlow

## Graph visualization library that allows to customize nodes using html 


<a href="https://nflvzr.csb.app/">
    <img width="100%" src="https://raw.githubusercontent.com/dmarov/graphflow/master/media/demo.gif"/>
</a>

Instead of connecting nodes dirrectly this library uses concept of ports, which provide greater fexibility at managing connections.
Port is an entity of node to which connection can be attached to. It might be visually invisible or visible


#### At the moment this library is under development and might be unstable


<a href="https://nflvzr.csb.app/">
   Visit interactive demo
</a>


## Features:

* nodes, connections and ports are fully customizable
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
document.body.prepend(canvasElement);

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
body > div {
    width: 1000px;
    height: 1000px;
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

## Options

```typescript
interface ApiOptions {
    readonly scale?: {
        readonly enabled?: boolean; // enables canvas scaling
        readonly velocity?: number; // determines how fast scale works
        readonly min?: number | null; // sets minimum scale
        readonly max?: number | null; // sets maximum scale
    },
    readonly background?: {
        readonly drawingFn?: (
            ctx: CanvasRenderingContext2D,
            transformer: PublicViewportTransformer,
        ) => void; // custom background drawing function
        readonly dotColor?: string; // color of background dots
        readonly dotGap?: number; // gap between background dots
        readonly dotRadius?: number; // radius of background dots
        readonly color?: string; // color of background
    },
    readonly shift?: {
        readonly enabled?: boolean; // enables canvas shift
    },
    readonly nodes?: {
        readonly draggable?: boolean; // enables draggable nodes behavior
    },
    readonly connections?: {
        readonly svgController: SvgController; // provides custom connections creation rules
    },
}
```
