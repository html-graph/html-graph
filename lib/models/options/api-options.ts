import { PublicViewportTransformer } from "../../components/public-viewport-transformer/public-viewport-transformer";
import { SvgController } from "../connection/svg-controller";
import { ScaleTrigger } from "../scale/scale-trigger.type";
import { BackgroundOptions } from "./background-options";

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
  };
  /**
   * nodes related behavior
   */
  readonly connections?: {
    /**
     * connection creation configuration
     */
    readonly svgController?: SvgController;
  };
}
