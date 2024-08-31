# GraphFlow

## Graph visualization library that allows to customize nodes using HTML

![CI](https://github.com/dmarov/graphflow/actions/workflows/ci.yml/badge.svg?branch=master)

<a href="https://codesandbox.io/p/sandbox/interesting-bhaskara-nflvzr?layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522cm09ioakj000620686fxv0xva%2522%252C%2522sizes%2522%253A%255B100%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522cm09ioakj00022068rbdcywmn%2522%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522cm09ioakj000320687k3o1yrz%2522%257D%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522cm09ioakj00052068txgnxc88%2522%257D%255D%257D%255D%252C%2522sizes%2522%253A%255B50%252C50%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522cm09ioakj00022068rbdcywmn%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522cm09ioakj00012068005q4p7u%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522FILE%2522%252C%2522filepath%2522%253A%2522%252Findex.html%2522%252C%2522state%2522%253A%2522IDLE%2522%252C%2522initialSelections%2522%253A%255B%257B%2522startLineNumber%2522%253A1%252C%2522startColumn%2522%253A1%252C%2522endLineNumber%2522%253A1%252C%2522endColumn%2522%253A1%257D%255D%257D%255D%252C%2522id%2522%253A%2522cm09ioakj00022068rbdcywmn%2522%252C%2522activeTabId%2522%253A%2522cm09ioakj00012068005q4p7u%2522%257D%252C%2522cm09ioakj00052068txgnxc88%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522cm09ioakj00042068rn5hf7oc%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522UNASSIGNED_PORT%2522%252C%2522port%2522%253A0%257D%255D%252C%2522id%2522%253A%2522cm09ioakj00052068txgnxc88%2522%252C%2522activeTabId%2522%253A%2522cm09ioakj00042068rn5hf7oc%2522%257D%252C%2522cm09ioakj000320687k3o1yrz%2522%253A%257B%2522tabs%2522%253A%255B%255D%252C%2522id%2522%253A%2522cm09ioakj000320687k3o1yrz%2522%257D%257D%252C%2522showDevtools%2522%253Atrue%252C%2522showShells%2522%253Afalse%252C%2522showSidebar%2522%253Atrue%252C%2522sidebarPanelSize%2522%253A15%257D">
    <img width="100%" src="https://raw.githubusercontent.com/dmarov/graphflow/master/media/demo.gif"/>
</a>

Instead of connecting nodes dirrectly this library uses concept of ports, which provide greater fexibility at managing connections.
Port is an entity of node to which connection can be attached to.

The purpose of this library is to provide low level api for displaying and interacting with graph structures.
This library fits for tasks where it is required easy nodes customization and interactiveness.

## Features:

- easy customization of nodes using HTML
- wide configuration options out of the box
- draggable and scalable canvas with draggable nodes
- zero dependencies
- typescript support

## Getting started:

```
npm i @diyguy/graphflow
```

```typescript
import { GraphFlowCanvas } from "@diyguy/graphflow";

const canvasElement = document.getElementById("canvas")!;

const canvas = new GraphFlowCanvas(canvasElement);

const node1 = document.createElement("div");
node1.classList.add("node");
node1.innerText = "1";

const node2 = document.createElement("div");
node2.classList.add("node");
node2.innerText = "2";

const port1 = document.createElement("div");
port1.classList.add("port");
port1.style.right = "0";

const port2 = document.createElement("div");
port2.classList.add("port");
port2.style.left = "0";

node1.appendChild(port1);
node2.appendChild(port2);

canvas
  .addNode({ id: "node-1", element: node1, x: 200, y: 300 })
  .markPort({ id: "port-1", element: port1, nodeId: "node-1" })
  .addNode({ id: "node-2", element: node2, x: 600, y: 500 })
  .markPort({ id: "port-2", element: port2, nodeId: "node-2" })
  .addConnection({ from: "port-1", to: "port-2" });
```

```css
#canvas {
  width: 1000px;
  height: 1000px;
}

.node {
  position: relative;
  width: 50px;
  height: 50px;
  background: #ffdbab;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.port {
  position: absolute;
  top: 50%;
  width: 0;
  height: 0;
}

.port::after {
  display: block;
  content: "";
  position: relative;
  top: -2.5px;
  left: -2.5px;
  width: 5px;
  height: 5px;
  background: #737373;
  border-radius: 2.5px;
  border: none;
}
```

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GraphFlow | Getting Started</title>
    <link rel="stylesheet" href="main.css" />
  </head>
  <body>
    <div id="canvas"></div>
    <script type="module" src="main.ts"></script>
  </body>
</html>
```

Refer to [Examples](examples) for more.

## Development with Docker

1. [optional] Create `.env` file and set default variables:

```
SERVER_PORT=3100 # (3100 by default)
HOST_USER_ID=1000 # (1000 by default) host user id to fix file permissions issue
HOST_GROUP_ID=1000 # (1000 by default) host group id to fix file permissions issue
```

2. `docker compose up [--build]` - to run development container [and rebuild]. Press `Ctrl+C` to stop container.

3. `docker compose exec graphflow zsh` - to enter container shell (to install packages and so on)

```
npm install {some package}
...
```

4. `docker compose down [--volumes]` - to stop detached container [and clear volumes]

5. `docker compose -f idle.docker-compose.yml up` - to start idle container (to upgrade packages and so on)

## Development without Docker

```
npm install

npm run start
...
```
