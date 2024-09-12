import { ConnectionController } from "../../models/connection/connection-controller";
import { PortPayload } from "../../models/store/port-payload";

export class LineConnectionController implements ConnectionController {
  constructor(
    private readonly color: string,
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
    const multX = fromCenter[0] <= toCenter[0] ? 1 : -1;
    const multY = fromCenter[1] <= toCenter[1] ? 1 : -1;

    const fromNorm = [
      multX * Math.cos(from.dir ?? 0),
      multY * Math.sin(from.dir ?? 0),
    ];

    const toNorm = [
      multX * Math.cos(to.dir ?? 0),
      multY * Math.sin(to.dir ?? 0),
    ];

    const ps = this.rotate(
      [this.hasSourceArrow ? this.arrowLength : 0, 0],
      fromNorm[0],
      fromNorm[1],
      0,
      0,
    );

    const pe = this.rotate(
      [width - (this.hasTargetArrow ? this.arrowLength : 0), height],
      toNorm[0],
      toNorm[1],
      width,
      height,
    );

    const lp = [ps, pe];

    const lmove = `M ${lp[0][0]} ${lp[0][1]}`;
    const lline = `L ${lp[1][0]} ${lp[1][1]}`;
    const linePath = `${lmove} ${lline}`;

    const line = svg.children[0]!;
    line.setAttribute("d", linePath);

    if (this.hasSourceArrow) {
      const ap: [number, number][] = [
        [0, 0],
        [this.arrowLength, this.arrowWidth],
        [this.arrowLength, -this.arrowWidth],
      ];

      const tap = ap.map((p) => this.rotate(p, fromNorm[0], fromNorm[1], 0, 0));

      const amove = `M ${tap[0][0]} ${tap[0][1]}`;
      const aline1 = `L ${tap[1][0]} ${tap[1][1]}`;
      const aline2 = `L ${tap[2][0]} ${tap[2][1]}`;
      const arrowPath = `${amove} ${aline1} ${aline2}`;

      const arrow = svg.children[1]!;
      arrow.setAttribute("d", arrowPath);
    }

    if (this.hasTargetArrow) {
      const ap: [number, number][] = [
        [width, height],
        [width - this.arrowLength, height - this.arrowWidth],
        [width - this.arrowLength, height + this.arrowWidth],
      ];

      const tap = ap.map((p) =>
        this.rotate(p, toNorm[0], toNorm[1], width, height),
      );

      const amove = `M ${tap[0][0]} ${tap[0][1]}`;
      const aline1 = `L ${tap[1][0]} ${tap[1][1]}`;
      const aline2 = `L ${tap[2][0]} ${tap[2][1]}`;
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

  private rotate(
    p: [number, number],
    cos: number,
    sin: number,
    cx: number,
    cy: number,
  ): [number, number] {
    /**
     * translate to center
     *  1  0  cx
     *  0  1  cy
     *  0  0  1
     *
     * rotate
     *  c -s  0
     *  s  c  0
     *  0  0  1
     *
     * translate back
     *  1  0  -cx
     *  0  1  -cy
     *  0  0  1
     *
     *  c -s  -c * cx + s * cy + cx
     *  s  c  -s * cx - c * cy + cy
     *  0  0  1
     */

    return [
      cos * p[0] - sin * p[1] - cos * cx + sin * cy + cx,
      sin * p[0] + cos * p[1] - sin * cx - cos * cy + cy,
    ];
  }
}
