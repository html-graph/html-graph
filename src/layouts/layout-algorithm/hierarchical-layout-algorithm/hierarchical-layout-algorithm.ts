import { Identifier } from "@/identifier";
import { MutablePoint, Point } from "@/point";
import { LayoutAlgorithm } from "../layout-algorithm";
import { LayoutAlgorithmParams } from "../layout-algorithm-params";
import { HierarchicalLayoutAlgorithmParams } from "./hierarchical-layout-algorithm-params";
import { WidthFirstSpanningForestGenerator } from "./width-first-spanning-forest-generator";
import { ChildrenOffsetsGenerator } from "./children-offsets-generator";
import { TreeNode } from "./tree";
import { applyCoordsTransform } from "@/layouts/shared";

export class HierarchicalLayoutAlgorithm implements LayoutAlgorithm {
  public constructor(
    private readonly params: HierarchicalLayoutAlgorithmParams,
  ) {}

  public calculateCoordinates(
    params: LayoutAlgorithmParams,
  ): ReadonlyMap<Identifier, Point> {
    const result = new Map<Identifier, MutablePoint>();

    const forestGenerator = new WidthFirstSpanningForestGenerator(params.graph);
    const forest = forestGenerator.generate();

    let currentX = 0;

    forest.forEach((tree) => {
      result.set(tree.root.nodeId, { x: currentX, y: 0 });

      const offsetsGenerator = new ChildrenOffsetsGenerator(tree, {
        spaceAroundRadius: this.params.layerSpace / 2,
      });

      const offsets = offsetsGenerator.generate();
      let currentLayer: TreeNode[] = [tree.root];

      while (currentLayer.length > 0) {
        const nextLayer: TreeNode[] = [];
        currentX += this.params.layerWidth;

        currentLayer.forEach((treeNode) => {
          treeNode.children.forEach((childTreeNode) => {
            const parentY = result.get(treeNode.nodeId)!.y;

            result.set(childTreeNode.nodeId, {
              y: parentY + offsets.get(childTreeNode.nodeId)!,
              x: currentX,
            });

            nextLayer.push(childTreeNode);
          });
        });

        currentLayer = nextLayer;
      }
    });

    applyCoordsTransform(result, this.params.transform);

    return result;
  }
}
