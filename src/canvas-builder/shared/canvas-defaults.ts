import { CenterFn } from "@/center-fn";
import { Priority } from "./priority";
import { EdgeShapeConfig } from "./resolve-edge-shape-factory";

export interface CanvasDefaults {
  readonly nodes?: {
    readonly centerFn?: CenterFn;
    readonly priority?: Priority;
  };
  readonly ports?: {
    readonly direction?: number;
  };
  readonly edges?: {
    readonly shape?: EdgeShapeConfig;
    readonly priority?: Priority;
  };
  readonly focus?: {
    readonly contentPadding?: number;
    readonly minContentScale?: number;
    readonly animationDuration?: number;
  };
}
