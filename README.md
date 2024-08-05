# GraphFlow

### At the moment this library is under development and not stable

Whats planned:

* support for html nodes, because it will allow huge customization possibilities
* wide configuration options for canvas, nodes and arrows
* respond to canvas and nodes resize
* draggable and scalable canvas with draggable nodes option
* nodes positioning layouts
* connections between nodes via ports
* zero dependencies
* framework independency in order to provide one easy to support API
* virtual scroll in order to optimize large graphs

## Probable API:
```
function createNode(text) {
    const node = document.createElement('div');

    node.innerText = text;
    node.classList.add('node');

    return node;
}

const el = document.querySelector("#canvas");
const canvas = new GraphFlow.Canvas(el);

const htmlNode1 = createNode('Node 1');
const htmlNode2 = createNode('Node 2');

canvas
    .addNode({ id: "1", el: htmlNode1, x: 200, y: 200 })
    .addNode({ id: "2", el: htmlNode2, x: 600, y: 200 })
    .connectNodes({ id: '1-to-2', from: "1", to: "2" })
    .flush();
```
