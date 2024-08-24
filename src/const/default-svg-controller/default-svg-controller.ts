import { SvgController } from "@/models/connection/svg-controller";

export const defaultSvgController: SvgController = {
    createSvg: () => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); 

        const line = document.createElementNS("http://www.w3.org/2000/svg", "path"); 
        line.setAttribute("id", "line");
        line.setAttribute("stroke", "#5c5c5c");
        line.setAttribute("stroke-width", "1");
        line.setAttribute("fill", "none");
        svg.appendChild(line);

        const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path"); 
        arrow.setAttribute("id", "arrow");
        arrow.setAttribute("fill", "#5c5c5c");
        svg.appendChild(arrow);
        svg.style.overflow = "visible";

        return svg;
    },
    updateSvg: (svg: SVGSVGElement, width: number, height: number) => {
        const line = svg.querySelector("[id='line']")!;
        const arrow = svg.querySelector("[id='arrow']")!;

        line.setAttribute("d", `M 0 0 C ${width * 0.4} 0, ${width * 0.6} ${height}, ${width - 15} ${height}`);
        arrow.setAttribute("d", `M ${width} ${height} L ${width - 15} ${height - 4} L ${width - 15} ${height + 4}`);
    },
}
