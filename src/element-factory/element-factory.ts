export class ElementFactory {
    static createCanvas(onRelease: (event: MouseEvent) => void, onMove: (event: MouseEvent) => void): HTMLDivElement {
        const canvas = document.createElement('div');

        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.position = "relative";
        canvas.style.overflow = "hidden";
        canvas.addEventListener("mouseup", (event: MouseEvent) => {
            if (event.button === 0) {
                onRelease(event);
            }
        });
        canvas.addEventListener("mousemove", (event: MouseEvent) => {
            onMove(event);
        });

        return canvas;
    }

    static createSvg(): SVGSVGElement {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.position = "absolute";

        return svg;
    }

    static createNodeWrapper(el: HTMLElement): HTMLElement {
        const wrapper = document.createElement('div');

        wrapper.appendChild(el);
        wrapper.style.position = "absolute";
        wrapper.style.visibility = "hidden";
        wrapper.style.cursor = "grab";
        wrapper.style.userSelect = "none";

        return wrapper;
    }

    static createSvgLine(id: string, x1: number, y1: number, x2: number, y2: number): SVGLineElement {
        const line = document.createElementNS("http://www.w3.org/2000/svg","line");

        line.setAttribute("id", `${id}`);
        line.setAttribute("x1", `${x1}`);
        line.setAttribute("y1", `${y1}`);
        line.setAttribute("x2", `${x2}`);
        line.setAttribute("y2", `${y2}`);
        line.setAttribute("stroke", "black")

        return line;
    }
}
