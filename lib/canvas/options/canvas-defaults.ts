import { CenterFn } from "@/center-fn";
import { EdgeShapeConfig } from "./edge-shape-config";
import { Priority } from "../create-defaults";

export interface CanvasDefaults {
  /**
   * nodes related behavior
   */
  readonly nodes?: {
    /**
     * specifies how to determine center of node
     * center of nodes specified in addNode method by x and y
     */
    readonly centerFn?: CenterFn;
    /**
     * specifies default z-index value
     */
    readonly priority?: Priority;
  };
  /**
   * ports related behavior
   */
  readonly ports?: {
    /**
     * specifies default direction of port
     */
    readonly direction?: number;
  };
  /**
   *edges related behavior
   */
  readonly edges?: {
    /**
     * specifies default controller
     */
    readonly shape?: EdgeShapeConfig;
    /**
     * specifies default z-index value
     */
    readonly priority?: Priority;
  };
}
