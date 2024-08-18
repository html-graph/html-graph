import { DiContainer } from "@/components/di-container/di-container";
import { defaultBackgroundDrawingFn } from "@/const/options/background-drawing-fn";
import { ApiOptions } from "@/models/options/api-options";
import { Options } from "@/models/options/options";

export class Canvas {
    private readonly options: Options = {
        scale: {
            velocity: this.apiOptions?.scale?.velocity ?? 1.2,
            min: this.apiOptions?.scale?.min ?? null,
            max: this.apiOptions?.scale?.max ?? null,
        },
        background: {
            drawingFn: this.apiOptions?.background?.drawingFn ?? defaultBackgroundDrawingFn,
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
