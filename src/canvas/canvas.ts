import { DiContainer } from "@/components/di-container/di-container";
import { ApiNode } from "@/models/nodes/api-node";
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
                this.apiOptions?.background?.dotColor ?? "#d8d8d8",
                this.apiOptions?.background?.dotGap ?? 25,
                this.apiOptions?.background?.dotRadius ?? 1.5,
                this.apiOptions?.background?.color ?? "#ffffff",
            ),
        },
    };

    private readonly di = new DiContainer(this.canvasWrapper, this.options);

    constructor(
        private readonly canvasWrapper: HTMLElement,
        private readonly apiOptions?: ApiOptions
    ) { }

    addNode(node: ApiNode): Canvas {
        this.di.controller.addNode(node.id, node.html, node.x, node.y);

        return this;
    }

    destroy(): void {
        this.di.controller.destroy();
    }
}
