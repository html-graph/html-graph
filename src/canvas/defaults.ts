import { CenterFn } from "@/center-fn";
import { EdgeShapeFactory } from "@/create-canvas-defaults";
import { PriorityFn } from "@/priority";

export interface Defaults {
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
