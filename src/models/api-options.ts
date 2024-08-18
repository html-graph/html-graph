export interface ApiOptions {
    readonly scale?: {
        readonly velocity?: number;
    },
    readonly background?: {
        readonly drawingFn?: (ctx: CanvasRenderingContext2D) => void;
    },
}
