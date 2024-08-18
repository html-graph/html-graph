import { DiContainer } from "@/di-container/di-container";
import { ApiOptions } from "@/models/api-options";
import { Options } from "@/models/options";

export class Canvas {
    private readonly di: DiContainer;

    constructor(canvasWrapper: HTMLElement, apiOptions?: ApiOptions) {
        const options: Options = {
            scale: {
                velocity: apiOptions?.scale?.velocity ?? 1.2,
            },
            background: {
                drawingFn: (ctx) => {
                    this.drawBackground(ctx);
                }
            }
        };

        this.di = new DiContainer(canvasWrapper, options);
    }

    destroy(): void {
        this.di.htmlController.destroy();
    }

    private drawBackground(ctx: CanvasRenderingContext2D): void {
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
    }
}
