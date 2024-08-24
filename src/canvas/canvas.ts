import { DiContainer } from "@/components/di-container/di-container";
import { defaultSvgController } from "@/const/default-svg-controller/default-svg-controller";
import { ApiConnection } from "@/models/connection/api-connection";
import { ApiNode } from "@/models/nodes/api-node";
import { ApiOptions } from "@/models/options/api-options";
import { Options } from "@/models/options/options";
import { ApiPort } from "@/models/port/api-port";
import { createBackgroundDrawingFn } from "@/utils/create-background-drawing-fn/create-background-drawing-fn";

export class Canvas {
    private readonly options: Options = {
        scale: {
            enabled: this.apiOptions?.scale?.enabled ?? false,
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
        shift: {
            enabled: this.apiOptions?.shift?.enabled ?? false,
        },
        nodes: {
            draggable: this.apiOptions?.nodes?.draggable ?? false,
        },
        connections: {
            svgController: this.apiOptions?.connections?.svgController ?? defaultSvgController,
        }
    };

    private readonly di = new DiContainer(this.canvasWrapper, this.options);

    constructor(
        private readonly canvasWrapper: HTMLElement,
        private readonly apiOptions?: ApiOptions
    ) { }

    addNode(node: ApiNode): Canvas {
        this.di.controller.addNode(node.id, node.element, node.x, node.y);

        return this;
    }

    setPort(port: ApiPort): Canvas {
        this.di.controller.setPort(port.id, port.element, port.nodeId);

        return this;
    }

    removeNode(nodeId: string): Canvas {
        this.di.controller.removeNode(nodeId);

        return this;
    }

    connectPorts(connection: ApiConnection): Canvas {
        this.di.controller.connectPorts(
            connection.id,
            connection.from,
            connection.to,
            connection.svgController ?? this.options.connections.svgController,
        );

        return this;
    }

    removeConnection(connectionId: string): Canvas {
        this.di.controller.removeConnection(connectionId);

        return this;
    }

    destroy(): void {
        this.di.controller.destroy();
    }
}
