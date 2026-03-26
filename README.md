<p align="center">
  <img src="/media/logo-label.svg" alt="HTMLGraph" width="520" height="100"/>
</p>

### Graph visualization library that enables rich nodes customization using HTML

![Preview](https://raw.githubusercontent.com/html-graph/html-graph/master/media/preview.jpg)


## Getting Started

```bash
npm i @html-graph/html-graph
```

```typescript
import { CanvasBuilder } from "@html-graph/html-graph";

const element = document.getElementById("canvas");
const canvas = new CanvasBuilder(element)
  .enableUserTransformableViewport()
  .enableUserDraggableNodes()
  .enableBackground()
  .build();
```

Visit the <a target="_blank" href="https://html-graph.github.io">DOCUMENTATION</a> for examples and API reference.
