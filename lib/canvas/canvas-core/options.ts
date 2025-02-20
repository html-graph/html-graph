import { CenterFn } from "@/center-fn";
import { EdgeShapeFactory } from "../edge-shape-factory";
import { PriorityFn } from "@/priority";

export interface Options {
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
