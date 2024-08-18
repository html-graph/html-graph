import { PublicViewportTransformer } from "@/components/public-viewport-transformer/public-viewport-transformer";

export interface ApiOptions {
    readonly scale?: {
        readonly velocity?: number;
        readonly min?: number | null;
        readonly max?: number | null;
    },
    readonly background?: {
        readonly drawingFn?: (
            ctx: CanvasRenderingContext2D,
            transformer: PublicViewportTransformer,
        ) => void;
    },
}
