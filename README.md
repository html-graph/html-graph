# GraphFlow

## Graph visualization library that allows to customize nodes using html 


<a href="https://codesandbox.io/p/sandbox/graphflow-simple-demo-nflvzr?layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522cm09ioakj000620686fxv0xva%2522%252C%2522sizes%2522%253A%255B100%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522cm09ioakj00022068rbdcywmn%2522%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522cm09ioakj000320687k3o1yrz%2522%257D%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522cm09ioakj00052068txgnxc88%2522%257D%255D%257D%255D%252C%2522sizes%2522%253A%255B50%252C50%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522cm09ioakj00022068rbdcywmn%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522cm09ioakj00012068005q4p7u%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522FILE%2522%252C%2522filepath%2522%253A%2522%252Findex.html%2522%252C%2522state%2522%253A%2522IDLE%2522%252C%2522initialSelections%2522%253A%255B%257B%2522startLineNumber%2522%253A1%252C%2522startColumn%2522%253A1%252C%2522endLineNumber%2522%253A1%252C%2522endColumn%2522%253A1%257D%255D%257D%255D%252C%2522id%2522%253A%2522cm09ioakj00022068rbdcywmn%2522%252C%2522activeTabId%2522%253A%2522cm09ioakj00012068005q4p7u%2522%257D%252C%2522cm09ioakj00052068txgnxc88%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522cm09ioakj00042068rn5hf7oc%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522UNASSIGNED_PORT%2522%252C%2522port%2522%253A0%257D%255D%252C%2522id%2522%253A%2522cm09ioakj00052068txgnxc88%2522%252C%2522activeTabId%2522%253A%2522cm09ioakj00042068rn5hf7oc%2522%257D%252C%2522cm09ioakj000320687k3o1yrz%2522%253A%257B%2522tabs%2522%253A%255B%255D%252C%2522id%2522%253A%2522cm09ioakj000320687k3o1yrz%2522%257D%257D%252C%2522showDevtools%2522%253Atrue%252C%2522showShells%2522%253Afalse%252C%2522showSidebar%2522%253Afalse%252C%2522sidebarPanelSize%2522%253A15%257D">
    <img width="100%" src="https://raw.githubusercontent.com/dmarov/graphflow/master/media/demo.gif"/>
</a>

Instead of connecting nodes dirrectly this library uses concept of ports, which provide greater fexibility in managing connections.
Port is an entity of node to which connection can be attached to. It might be visually invisible or visible


#### At the moment this library is under development and might be unstable


<a href="https://codesandbox.io/p/sandbox/graphflow-simple-demo-nflvzr?layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522cm09ioakj000620686fxv0xva%2522%252C%2522sizes%2522%253A%255B100%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522cm09ioakj00022068rbdcywmn%2522%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522cm09ioakj000320687k3o1yrz%2522%257D%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522cm09ioakj00052068txgnxc88%2522%257D%255D%257D%255D%252C%2522sizes%2522%253A%255B50%252C50%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522cm09ioakj00022068rbdcywmn%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522cm09ioakj00012068005q4p7u%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522FILE%2522%252C%2522filepath%2522%253A%2522%252Findex.html%2522%252C%2522state%2522%253A%2522IDLE%2522%252C%2522initialSelections%2522%253A%255B%257B%2522startLineNumber%2522%253A1%252C%2522startColumn%2522%253A1%252C%2522endLineNumber%2522%253A1%252C%2522endColumn%2522%253A1%257D%255D%257D%255D%252C%2522id%2522%253A%2522cm09ioakj00022068rbdcywmn%2522%252C%2522activeTabId%2522%253A%2522cm09ioakj00012068005q4p7u%2522%257D%252C%2522cm09ioakj00052068txgnxc88%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522cm09ioakj00042068rn5hf7oc%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522UNASSIGNED_PORT%2522%252C%2522port%2522%253A0%257D%255D%252C%2522id%2522%253A%2522cm09ioakj00052068txgnxc88%2522%252C%2522activeTabId%2522%253A%2522cm09ioakj00042068rn5hf7oc%2522%257D%252C%2522cm09ioakj000320687k3o1yrz%2522%253A%257B%2522tabs%2522%253A%255B%255D%252C%2522id%2522%253A%2522cm09ioakj000320687k3o1yrz%2522%257D%257D%252C%2522showDevtools%2522%253Atrue%252C%2522showShells%2522%253Afalse%252C%2522showSidebar%2522%253Afalse%252C%2522sidebarPanelSize%2522%253A15%257D">
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

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Simple GraphFlow Demo</title>
    <style>
      html,
      body {
        height: 100%;
        padding: 0;
        margin: 0;
      }

      #canvas {
        height: 100%;
      }

      .node {
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
    </style>
  </head>

  <body>
    <div id="canvas"></div>
    <script type="module">
      import { Canvas } from "https://unpkg.com/@diyguy/graphflow@0.0.5";

      const canvasElement = document.querySelector("#canvas");
      document.body.prepend(canvasElement);

      const canvas = new Canvas(canvasElement, {
        scale: { enabled: true },
        shift: { enabled: true },
        nodes: { draggable: true },
      });

      function createNodeElement(name) {
        const node = document.createElement("div");
        const text = document.createElement("div");

        node.classList.add("node");
        node.appendChild(text);

        text.innerText = name;

        const frontPort = document.createElement("div");
        node.prepend(frontPort);

        const backPort = document.createElement("div");
        node.appendChild(backPort);

        return [node, frontPort, backPort];
      }

      const node1 = createNodeElement("Node 1");
      const node2 = createNodeElement("Node 2");

      canvas
        .addNode({ id: "node-1", element: node1[0], x: 200, y: 200 })
        .markAsPort({ id: "port-1-1", element: node1[1], nodeId: "node-1" })
        .markAsPort({ id: "port-1-2", element: node1[2], nodeId: "node-1" })
        .addNode({ id: "node-2", element: node2[0], x: 500, y: 300 })
        .markAsPort({ id: "port-2-1", element: node2[1], nodeId: "node-2" })
        .markAsPort({ id: "port-2-2", element: node2[2], nodeId: "node-2" })
        .connectPorts({ id: "con-1", from: "port-1-2", to: "port-2-1" });
    </script>
  </body>
</html>
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
        dotColor?: string; // color of background dots
        dotGap?: number; // gap between background dots
        dotRadius?: number; // radius of background dots
        color?: string; // color of background
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
