import { CenterFn } from "@/center-fn";
import { PriorityFn } from "@/priority";
import { EdgeShapeFactory } from "./edge-shape-factory";

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
