export interface Options {
    readonly scale: {
        readonly velocity: number;
    },
    readonly background: {
        readonly drawingFn: (ctx: CanvasRenderingContext2D) => void;
    }
}
