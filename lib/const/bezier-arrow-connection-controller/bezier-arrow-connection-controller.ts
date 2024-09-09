import { ConnectionController } from "../../models/connection/connection-controller";

export class BezierArrowConnectionController implements ConnectionController {
  constructor(private readonly color: string) {}

  createSvg(): SVGSVGElement {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    line.setAttribute("stroke", this.color);
    line.setAttribute("stroke-width", "1");
    line.setAttribute("fill", "none");
    svg.appendChild(line);

    const arrow = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );

    arrow.setAttribute("fill", this.color);
    svg.appendChild(arrow);
    svg.style.overflow = "visible";

    return svg;
  }

  updateSvg(svg: SVGSVGElement, width: number, height: number): void {
    const line = svg.children[0]!;
    const arrow = svg.children[1]!;

    const linePath = `M 0 0 C ${width * 0.4} 0 ${width * 0.6} ${height} ${width - 15} ${height}`;
    const arrowPath = `M ${width} ${height} L ${width - 15} ${height - 4} L ${width - 15} ${height + 4}`;

    line.setAttribute("d", linePath);
    arrow.setAttribute("d", arrowPath);
  }
}
