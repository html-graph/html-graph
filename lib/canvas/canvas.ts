import { DiContainer } from "../components/di-container/di-container";
import { defaultSvgController } from "../const/default-svg-controller/default-svg-controller";
import { ApiConnection } from "../models/connection/api-connection";
import { ApiNode } from "../models/nodes/api-node";
import { ApiOptions } from "../models/options/api-options";
import { Options } from "../models/options/options";
import { ApiPort } from "../models/port/api-port";
import { createBackgroundDrawingFn } from "../utils/create-background-drawing-fn/create-background-drawing-fn";

export class Canvas {
    private readonly options: Options;

    private readonly di: DiContainer;

    constructor(
        private readonly canvasWrapper: HTMLElement,
        private readonly apiOptions?: ApiOptions
    ) {
        this.options = {
            scale: {
                enabled: this.apiOptions?.scale?.enabled ?? false,
                velocity: this.apiOptions?.scale?.velocity ?? 1.2,
                min: this.apiOptions?.scale?.min ?? null,
                max: this.apiOptions?.scale?.max ?? null,
                trigger: this.apiOptions?.scale?.trigger ?? 'wheel',
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

        this.di = new DiContainer(this.canvasWrapper, this.options);

    }

    addNode(node: ApiNode): Canvas {
        this.di.controller.addNode(node.id, node.element, node.x, node.y);

        return this;
    }

    markPort(port: ApiPort): Canvas {
        this.di.controller.markPort(port.id, port.element, port.nodeId);

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
