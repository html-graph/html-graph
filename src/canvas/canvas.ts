import { DiContainer } from "@/components/di-container/di-container";
import { ApiOptions } from "@/models/options/api-options";
import { Options } from "@/models/options/options";
import { createBackgroundDrawingFn } from "@/utils/create-background-drawing-fn/create-background-drawing-fn";

export class Canvas {
    private readonly options: Options = {
        scale: {
            velocity: this.apiOptions?.scale?.velocity ?? 1.2,
            min: this.apiOptions?.scale?.min ?? null,
            max: this.apiOptions?.scale?.max ?? null,
        },
        background: {
            drawingFn: this.apiOptions?.background?.drawingFn ?? createBackgroundDrawingFn(
                this.apiOptions?.background?.dotColor ?? "#e8e8e8",
                this.apiOptions?.background?.dotGap ?? 100,
                this.apiOptions?.background?.dotRadius ?? 5,
            ),
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
