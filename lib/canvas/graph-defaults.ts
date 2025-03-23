import { EdgeShapeFactory } from "@/canvas-controller/core-canvas-controller/options/edge-shape-factory";
import { CenterFn } from "@/center-fn";
import { PriorityFn } from "@/priority";

export interface GraphDefaults {
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
}
