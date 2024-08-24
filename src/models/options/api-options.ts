import { PublicViewportTransformer } from "@/components/public-viewport-transformer/public-viewport-transformer";
import { SvgController } from "../connection/svg-controller";

export interface ApiOptions {
    readonly scale?: {
        readonly enabled?: boolean;
        readonly velocity?: number;
        readonly min?: number | null;
        readonly max?: number | null;
    },
    readonly background?: {
        readonly drawingFn?: (
            ctx: CanvasRenderingContext2D,
            transformer: PublicViewportTransformer,
        ) => void;
        dotColor?: string;
        dotGap?: number;
        dotRadius?: number;
        color?: string;
    },
    readonly shift?: {
        readonly enabled?: boolean;
    },
    readonly nodes?: {
        readonly draggable?: boolean;
    },
    readonly connections?: {
        readonly svgController: SvgController;
    },
}
