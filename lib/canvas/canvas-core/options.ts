import { CenterFn } from "@/center-fn";
import { EdgeShapeFactory } from "@/edges";
import { PriorityFn } from "@/priority";
import { PublicViewportTransformer } from "@/viewport-transformer";

export interface Options {
  readonly background: {
    readonly drawingFn: (
      ctx: CanvasRenderingContext2D,
      transformer: PublicViewportTransformer,
    ) => void;
  };
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
