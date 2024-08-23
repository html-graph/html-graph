import { ConnectionDrawingFn } from "@/models/connection/connection-drawing-fn";
import { DiContainer } from "../di-container/di-container";

export class Controller {
    constructor(
        private readonly di: DiContainer
    ) { }

    grabViewport(): void {
        this.di.htmlController.setCursor('grab');
    }

    dragViewport(dx: number, dy: number): void {
        this.di.viewportTransformer.applyShift(-dx, -dy);
        this.di.htmlController.applyTransform();
    }

    releaseViewport(): void {
        this.di.htmlController.setCursor('default');
    }

    scaleCanvas(deltaY: number, centerX: number, centerY: number): void {
        const scaleVelocity = this.di.options.scale.velocity;
        const velocity = deltaY < 0 ? scaleVelocity : (1 / scaleVelocity);

        this.di.viewportTransformer.applyScale(
            1 / velocity,
            centerX,
            centerY,
        );

        this.di.htmlController.applyTransform();
    }

    addNode(nodeId: string, element: HTMLElement, x: number, y: number): void {
        if (this.di.graphStore.hasNode(nodeId)) {
            throw new Error("failed to add node with existing id");
        }

        this.di.graphStore.addNode(nodeId, element, x, y);
        this.di.htmlController.attachNode(nodeId);
    }

    setPort(portId: string, element: HTMLElement, nodeId: string): void {
        if (!this.di.graphStore.hasNode(nodeId)) {
            throw new Error("failed to set port on nonexisting node");
        }

        if (this.di.graphStore.hasPort(portId)) {
            throw new Error("failed to add port with existing id");
        }

        this.di.graphStore.addPort(portId,  element, nodeId);
    }

    unsetPort(portId: string): void {
        if (!this.di.graphStore.hasPort(portId)) {
            throw new Error("failed to unset nonexisting port");
        }

        this.di.graphStore.removePort(portId);
    }

    connectPorts(
        connectionId: string,
        fromPortId: string,
        toPortId: string,
        element: SVGSVGElement,
    ): void {
        this.di.graphStore.addConnection(connectionId, fromPortId, toPortId);
        this.di.htmlController.attachConnection(connectionId, element);
    }

    disconnectPorts(connectionId: string): void {
        this.di.graphStore.removeConnection(connectionId);
        this.di.htmlController.detachConnection(connectionId);
    }

    removeNode(nodeId: string): void {
        if (!this.di.graphStore.hasNode(nodeId)) {
            throw new Error("failed to remove nonexisting node");
        }

        this.di.htmlController.detachNode(nodeId);
        this.di.graphStore.removeNode(nodeId);
    }

    destroy(): void {
        this.di.htmlController.destroy();
    }
}
