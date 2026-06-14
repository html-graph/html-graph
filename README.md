<p align="center">
  <img src="/media/logo-label.svg" alt="HTMLGraph" width="520" height="100"/>
</p>

<h3 align="center">
  Graph visualization library that enables rich nodes customization using HTML
</h3>

<div>
&nbsp;
</div>

<a target="_blank" href="https://html-graph.github.io">
  <img src="https://raw.githubusercontent.com/html-graph/html-graph/master/media/preview.jpg">
</a>

<div>
&nbsp;
</div>

## Getting Started

```bash
npm i @html-graph/html-graph
```

```typescript
import { CanvasBuilder } from "@html-graph/html-graph";

const element = document.getElementById("canvas");

const canvas = new CanvasBuilder(element)
  .enableUserTransformableViewport() // Enables viewport pan and zoom
  .enableUserDraggableNodes() // Enables draggable nodes
  .enableBackground() // Renders background
  .build();
```

## Links

- <a target="_blank" href="https://html-graph.github.io">DOCUMENTATION</a>
- <a target="_blank" href="/blob/master/CONTRIBUTING.md">CONTRIBUTING</a>
- <a target="_blank" href="/blob/master/DEVELOPMENT.md">DEVELOPMENT</a>
