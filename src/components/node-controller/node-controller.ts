import { DiContainer } from "../di-container/di-container";

export class NodeController {
    constructor(
        private readonly di: DiContainer,
        private readonly id: string,
        private readonly html: HTMLElement,
        private readonly x: number,
        private readonly y: number,
    ) { }
}
