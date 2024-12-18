import { CenterFn } from "@/center-fn";
import { LayersMode } from "@/layers";
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
     * center of port determines point to which connection attaches
     */
    readonly centerFn?: CenterFn;
  };
  /**
   *connections related behavior
   */
  readonly edges?: EdgeOptions;

  /**
   * layers related behavior
   */
  readonly layers?: {
    /**
     * sets layers order
     */
    readonly mode?: LayersMode;
  };
}
