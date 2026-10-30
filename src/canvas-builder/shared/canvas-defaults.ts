import { CenterFn } from "@/center-fn";
import { Priority } from "./priority";
import { EdgeShapeConfig } from "./resolve-edge-shape-factory";
import { EdgeShapeFactory } from "@/graph-controller";

export interface CanvasDefaults {
  readonly nodes?: {
    readonly centerFn?: CenterFn;
    readonly priority?: Priority;
  };
  readonly ports?: {
    readonly direction?: number;
  };
  readonly edges?: {
    readonly shapeFactory?: EdgeShapeFactory;
    /**
     * @deprecated
     * use shapeFactory instead
     */
    readonly shape?: EdgeShapeConfig;
    readonly priority?: Priority;
  };
  readonly focus?: {
    readonly contentPadding?: number;
    readonly minContentScale?: number;
    readonly animationDuration?: number;
  };
}
