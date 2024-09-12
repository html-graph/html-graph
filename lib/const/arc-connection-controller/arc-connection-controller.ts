import { ConnectionController } from "../../models/connection/connection-controller";
import { PortPayload } from "../../models/store/port-payload";

export class ArcConnectionController implements ConnectionController {
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

  updateSvg(
    svg: SVGSVGElement,
    width: number,
    height: number,
    from: PortPayload,
    to: PortPayload,
  ): void {
    const fromCenter = this.getPortCenter(from);
    const toCenter = this.getPortCenter(to);

    if (fromCenter[0] < toCenter[0]) {
      this.updateDirect(svg, width, height);
    } else {
      this.updateAdaptive(svg, width, height);
    }
  }

  private updateDirect(svg: SVGSVGElement, width: number, height: number) {
    const lp = [
      [0, 0],
      [width * this.curvature, 0],
      [width * (1 - this.curvature) - this.arrowLength, height],
      [width - this.arrowLength, height],
    ];

    const lmove = `M ${lp[0][0]} ${lp[0][1]}`;
    const lcurve = `C ${lp[1][0]} ${lp[1][1]} ${lp[2][0]} ${lp[2][1]} ${lp[3][0]} ${lp[3][1]}`;
    const linePath = `${lmove} ${lcurve}`;

    const line = svg.children[0]!;
    line.setAttribute("d", linePath);

    const ap = [
      [width, height],
      [width - this.arrowLength, height - this.arrowWidth],
      [width - this.arrowLength, height + this.arrowWidth],
    ];

    const amove = `M ${ap[0][0]} ${ap[0][1]}`;
    const aline1 = `L ${ap[1][0]} ${ap[1][1]}`;
    const aline2 = `L ${ap[2][0]} ${ap[2][1]}`;
    const arrowPath = `${amove} ${aline1} ${aline2}`;

    const arrow = svg.children[1]!;
    arrow.setAttribute("d", arrowPath);
  }

  private updateAdaptive(svg: SVGSVGElement, width: number, height: number) {
    const lmove = `M ${0} ${0}`;
    const d = height / 2;
    const r = d / 2;
    const arc1 = `A ${r} ${r} 0 0 0 ${0} ${d}`;
    const lline1 = `L ${width + this.arrowLength} ${d}`;
    const arc2 = `A ${r} ${r} 0 0 1 ${width + this.arrowLength} ${height}`;
    const linePath = `${lmove} ${arc1} ${lline1} ${arc2}`;

    const line = svg.children[0]!;
    line.setAttribute("d", linePath);

    const ap = [
      [width, height],
      [width + this.arrowLength, height - this.arrowWidth],
      [width + this.arrowLength, height + this.arrowWidth],
    ];

    const amove = `M ${ap[0][0]} ${ap[0][1]}`;
    const aline1 = `L ${ap[1][0]} ${ap[1][1]}`;
    const aline2 = `L ${ap[2][0]} ${ap[2][1]}`;
    const arrowPath = `${amove} ${aline1} ${aline2}`;

    const arrow = svg.children[1]!;
    arrow.setAttribute("d", arrowPath);
  }

  private getPortCenter(port: PortPayload): [number, number] {
    const { top, left, width, height } = port.element.getBoundingClientRect();

    const center = port.centerFn(width, height);

    return [left + center[0], top + center[1]];
  }
}
