import { CenterFn } from "@/center-fn";
import { EdgeShape } from "../canvas/edge-options";
import { Priority } from "./priority";

export interface CoreOptions {
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
     * specifies how to determine center of port
     * center of port determines point to which edge attaches
     */
    readonly centerFn?: CenterFn;
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
    readonly shape?: EdgeShape;
    /**
     * specifies default z-index value
     */
    readonly priority?: Priority;
  };
}
