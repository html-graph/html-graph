import { CenterFn } from "@/center-fn";
import { EdgeShapeFactory } from "@/graph-controller";
import { PriorityFn } from "@/priority";

export interface CanvasParams {
  readonly nodes: {
    readonly centerFn: CenterFn;
    readonly priorityFn: PriorityFn;
  };
  readonly ports: {
    readonly direction: number;
  };
  readonly edges: {
    readonly shapeFactory: EdgeShapeFactory;
    readonly priorityFn: PriorityFn;
  };
  readonly focus: {
    readonly contentOffset: number;
    readonly minContentScale: number;
  };
}
