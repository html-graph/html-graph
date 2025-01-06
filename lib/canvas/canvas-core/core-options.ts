import { CenterFn } from "@/center-fn";
import { EdgeOptions } from "../canvas/edge-options";
import { BackgroundOptions } from "./background-options";

export interface CoreOptions {
  /**
   * canvas background settings
   */
  readonly background?: BackgroundOptions;
  /**
   * nodes related behavior
   */
  readonly nodes?: {
    /**
     * specifies how to determine center of node
     * center of nodes specified in addNode method by x and y
     */
    readonly centerFn?: CenterFn;
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
    shape?: EdgeOptions;
  };
}
