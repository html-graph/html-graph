import { PublicViewportTransformer } from "../../components/public-viewport-transformer/public-viewport-transformer";
import { SvgController } from "../connection/svg-controller";
import { ScaleTrigger } from "../scale/scale-trigger.type";

export interface ApiOptions {
    /**
     * canvas scale related behavior
     */
    readonly scale?: {
        /*
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
    },
    /**
     * canvas background settings
     */
    readonly background?: {
        /**
         * custom background drawing function
         */
        readonly drawingFn?: (
            ctx: CanvasRenderingContext2D,
            transformer: PublicViewportTransformer,
        ) => void;
        /**
         * color of background dots
         */
        readonly dotColor?: string;
        /**
         * gap between background dots
         */
        readonly dotGap?: number;
        /**
         * radius of background dots
         */
        readonly dotRadius?: number;
        /**
         * color of background
         */
        readonly color?: string;
    },
    /**
     * viewport shift related behavior
     */
    readonly shift?: {
        /**
         * enables viewport shift
         */
        readonly enabled?: boolean;
    },
    /**
     * nodes related behavior
     */
    readonly nodes?: {
        /**
         * enables nodes drag behavior
         */
        readonly draggable?: boolean;
    },
    /**
     * nodes related behavior
     */
    readonly connections?: {
        /**
         * connection creation configuration
         */
        readonly svgController?: SvgController;
    },
}
