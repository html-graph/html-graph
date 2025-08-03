# TODO

```typescript
interface LayoutGraph {
  readonly nodes: ReadonlyArray<LayoutNode>;
  readonly edges: ReadonlyArray<LayoutEdge>;
  readonly incomingEdges: ReadonlyArray<LayoutEdge>;
  readonly outgoingEdges: ReadonlyArray<LayoutEdge>;
  readonly cycleEdges: ReadonlyArray<LayoutEdge>;
}

interface Layout {
  updateCoords(graph: LayoutGraph): void;
}

class MyLayout implements Layout {
  updateCoords(graph: LayoutGraph): void {
    graph.edges.forEach((edge, edgeId) => {
      console.log(edge.source, edge.target, edgeId);
    });

    graph.nodes.forEach((node) => {
      if (node.x === undefined) {
        node.x = 0;
      }

      if (node.y === undefined) {
        node.y = 0;
      }
    });
  }
}
```

nodesWithOptionalCoords => nodesWithMandatoryCoords

storeQueue -> topologyStore readonly?
storeQueue -> geometryStore

- layouts

  - make separate graph store with optional coordinates
  - should be separate model for view
  - move node coordinates from store to layout
  - implement asynchronous store

- arrows customization
- user selectable nodes? lasso selection? multiselection?
- connection preview for connectable ports
- nodes without overlap

- implement edges with label when specified manually
- generics for identifiers?
- transformable canvas shift limit when scaling
- node drag handle example
- sankey connections
