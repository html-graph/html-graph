import { ConnectionController } from "../../models/connection/connection-controller";
import { PortPayload } from "../../models/store/port-payload";

export class BezierConnectionController implements ConnectionController {
  constructor(
    private readonly color: string,
    private readonly curvature: number,
    private readonly arrowLength: number,
    private readonly arrowWidth: number,
    private readonly hasSourceArrow: boolean,
    private readonly hasTargetArrow: boolean,
  ) {}

  createSvg(): SVGSVGElement {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    line.setAttribute("stroke", this.color);
    line.setAttribute("stroke-width", "1");
    line.setAttribute("fill", "none");
    svg.appendChild(line);

    if (this.hasSourceArrow) {
      const arrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );

      arrow.setAttribute("fill", this.color);
      svg.appendChild(arrow);
    }

    if (this.hasTargetArrow) {
      const arrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );

      arrow.setAttribute("fill", this.color);
      svg.appendChild(arrow);
    }

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
    const m = fromCenter[0] <= toCenter[0] ? 1 : -1;
    const shift = this.curvature + this.arrowLength;

    const lp = [
      [m * (this.hasSourceArrow ? this.arrowLength : 0), 0],
      [m * shift, 0],
      [width - m * shift, height],
      [width - m * (this.hasTargetArrow ? this.arrowLength : 0), height],
    ];

    const lmove = `M ${lp[0][0]} ${lp[0][1]}`;
    const lcurve = `C ${lp[1][0]} ${lp[1][1]} ${lp[2][0]} ${lp[2][1]} ${lp[3][0]} ${lp[3][1]}`;
    const linePath = `${lmove} ${lcurve}`;

    const line = svg.children[0]!;
    line.setAttribute("d", linePath);

    if (this.hasSourceArrow) {
      const ap = [
        [0, 0],
        [m * this.arrowLength, this.arrowWidth],
        [m * this.arrowLength, -this.arrowWidth],
      ];

      const amove = `M ${ap[0][0]} ${ap[0][1]}`;
      const aline1 = `L ${ap[1][0]} ${ap[1][1]}`;
      const aline2 = `L ${ap[2][0]} ${ap[2][1]}`;
      const arrowPath = `${amove} ${aline1} ${aline2}`;

      const arrow = svg.children[1]!;
      arrow.setAttribute("d", arrowPath);
    }

    if (this.hasTargetArrow) {
      const ap = [
        [width, height],
        [width - m * this.arrowLength, height - this.arrowWidth],
        [width - m * this.arrowLength, height + this.arrowWidth],
      ];

      const amove = `M ${ap[0][0]} ${ap[0][1]}`;
      const aline1 = `L ${ap[1][0]} ${ap[1][1]}`;
      const aline2 = `L ${ap[2][0]} ${ap[2][1]}`;
      const arrowPath = `${amove} ${aline1} ${aline2}`;

      const arrow = svg.children[this.hasSourceArrow ? 2 : 1]!;
      arrow.setAttribute("d", arrowPath);
    }
  }

  private getPortCenter(port: PortPayload): [number, number] {
    const { top, left, width, height } = port.element.getBoundingClientRect();

    const center = port.centerFn(width, height);

    return [left + center[0], top + center[1]];
  }
}
