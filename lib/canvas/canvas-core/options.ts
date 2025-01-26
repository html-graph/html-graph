import { CenterFn } from "@/center-fn";
import { EdgeShapeFactory } from "@/edges";
import { PriorityFn } from "@/priority";

export interface Options {
  readonly nodes: {
    readonly centerFn: CenterFn;
    readonly priorityFn: PriorityFn;
  };
  readonly ports: {
    readonly centerFn: CenterFn;
    readonly direction: number;
  };
  readonly edges: {
    readonly shapeFactory: EdgeShapeFactory;
    readonly priorityFn: PriorityFn;
  };
}
