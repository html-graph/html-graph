import { DiContainer } from "@/components/di-container/di-container";
import { ApiOptions } from "@/models/options/api-options";
import { Options } from "@/models/options/options";

export class Canvas {
    private readonly defaultBgDrawingFn = (ctx: CanvasRenderingContext2D) => {
        const entries = ([
            [0, 0, "black"],
            [100, 0, "#c9c9c9"],
            [-100, 0, "#c9c9c9"],
            [0, 100, "#c9c9c9"],
            [0, -100, "#c9c9c9"],
        ] as const)

        entries.forEach(entry => {
            const scale = this.di.viewportTransformer.getViewportScale();
            const r = 10 *  scale;
            const pi2 = 2 * Math.PI;

            const [x1, y1] = this.di.viewportTransformer.getViewportCoordsFor(entry[0], entry[1]);

            ctx.beginPath();
            ctx.arc(x1, y1, r, 0, pi2);
            ctx.closePath();

            ctx.fillStyle = entry[2];
            ctx.fill();
        });
    };

    options: Options = {
        scale: {
            velocity: this.apiOptions?.scale?.velocity ?? 1.2,
            min: this.apiOptions?.scale?.min ?? null,
            max: this.apiOptions?.scale?.max ?? null,
        },
        background: {
            drawingFn: this.apiOptions?.background?.drawingFn ?? this.defaultBgDrawingFn
        },
    };


    private readonly di = new DiContainer(this.canvasWrapper, this.options);

    constructor(
        private readonly canvasWrapper: HTMLElement,
        private readonly apiOptions?: ApiOptions
    ) { }

    destroy(): void {
        this.di.htmlController.destroy();
    }
}
