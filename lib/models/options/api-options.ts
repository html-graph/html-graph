import { CenterFn } from "../center/center-fn";
import { ScaleTrigger } from "../scale/scale-trigger.type";
import { BackgroundOptions } from "./background-options";
import { ConnectionOptions } from "./connection-options";
import { LayersMode } from "./layers-mode";

export interface ApiOptions {
  /**
   * canvas scale related behavior
   */
  readonly scale?: {
    /**
     * enables canvas scaling
     */
    readonly enabled?: boolean;
    /**
     * determines how fast scale works
     * number between 1 and 2 is recommended
     */
    readonly velocity?: number;
    /**
     * sets minimum scale
     */
    readonly min?: number | null;
    /**
     * sets maximum scale
     */
    readonly max?: number | null;
    /**
     * sets trigger for scroll
     */
    readonly trigger?: ScaleTrigger;
  };
  /**
   * canvas background settings
   */
  readonly background?: BackgroundOptions;
  /**
   * viewport shift related behavior
   */
  readonly shift?: {
    /**
     * enables viewport shift
     */
    readonly enabled?: boolean;
  };
  /**
   * nodes related behavior
   */
  readonly nodes?: {
    /**
     * enables nodes drag behavior
     */
    readonly draggable?: boolean;
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
  readonly connections?: ConnectionOptions;

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
