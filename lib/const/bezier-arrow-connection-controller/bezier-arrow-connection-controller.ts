import { ConnectionController } from "../../models/connection/connection-controller";

export class BezierArrowConnectionController implements ConnectionController {
  private readonly curvature = 0.4;

  private readonly arrowLength = 15;

  private readonly arrowWidth = 4;

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

    const lp = [
      [0, 0],
      [width * this.curvature, 0],
      [width * (1 - this.curvature) - this.arrowLength, height],
      [width - this.arrowLength, height],
    ];

    const ap = [
      [width, height],
      [width - this.arrowLength, height - this.arrowWidth],
      [width - this.arrowLength, height + this.arrowWidth],
    ];

    const lmove = `M ${lp[0][0]} ${lp[0][1]}`;
    const lcurve = `C ${lp[1][0]} ${lp[1][1]} ${lp[2][0]} ${lp[2][1]} ${lp[3][0]} ${lp[3][1]}`;

    const linePath = `${lmove} ${lcurve}`;

    const amove = `M ${ap[0][0]} ${ap[0][1]}`;
    const lline1 = `L ${ap[1][0]} ${ap[1][1]}`;
    const lline2 = `L ${ap[2][0]} ${ap[2][1]}`;
    const arrowPath = `${amove} ${lline1} ${lline2}`;

    line.setAttribute("d", linePath);
    arrow.setAttribute("d", arrowPath);
  }
}
