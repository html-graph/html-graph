import { PortPayload } from "@/port-payload";
import { ConnectionController } from "../connection-controller";
import { ConnectionUtils } from "../connection-utils";
import { Point } from "../point";

export class StraightConnectionController implements ConnectionController {
  public readonly svg: SVGSVGElement;

  private readonly group: SVGGElement;

  private readonly line: SVGPathElement;

  private readonly sourceArrow: SVGPathElement | null = null;

  private readonly targetArrow: SVGPathElement | null = null;

  public constructor(
    private readonly color: string,
    private readonly width: number,
    private readonly arrowLength: number,
    private readonly arrowWidth: number,
    private readonly minPortOffset: number,
    hasSourceArrow: boolean,
    hasTargetArrow: boolean,
    private readonly roundness: number,
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.style.pointerEvents = "none";

    this.group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.appendChild(this.group);

    this.line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.line.setAttribute("stroke", this.color);
    this.line.setAttribute("stroke-width", `${this.width}`);
    this.line.setAttribute("fill", "none");
    this.group.appendChild(this.line);
    this.group.style.transformOrigin = `50% 50%`;

    if (hasSourceArrow) {
      this.sourceArrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );

      this.sourceArrow.setAttribute("fill", this.color);
      this.group.appendChild(this.sourceArrow);
    }

    if (hasTargetArrow) {
      this.targetArrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );

      this.targetArrow.setAttribute("fill", this.color);
      this.group.appendChild(this.targetArrow);
    }

    this.svg.style.overflow = "visible";
  }

  public update(
    x: number,
    y: number,
    width: number,
    height: number,
    from: PortPayload,
    to: PortPayload,
  ): void {
    this.svg.style.width = `${width}px`;
    this.svg.style.height = `${height}px`;

    const fromCenter = ConnectionUtils.getPortCenter(from);
    const toCenter = ConnectionUtils.getPortCenter(to);
    const flipX = fromCenter[0] <= toCenter[0] ? 1 : -1;
    const flipY = fromCenter[1] <= toCenter[1] ? 1 : -1;

    this.svg.style.transform = `translate(${x}px, ${y}px)`;
    this.group.style.transform = `scale(${flipX}, ${flipY})`;

    const fromVect = ConnectionUtils.getDirectionVector(
      from.direction,
      flipX,
      flipY,
    );

    const toVect = ConnectionUtils.getDirectionVector(
      to.direction,
      flipX,
      flipY,
    );

    console.log(this.roundness);

    const gap = this.arrowLength + this.minPortOffset;
    const pb = ConnectionUtils.rotate([gap, 0], fromVect, [0, 0]);
    const pe = ConnectionUtils.rotate([width - gap, height], toVect, [
      width,
      height,
    ]);

    const [cx, cy] = [width / 2, height / 2];
    const isOverflown = flipX * (pe[0] - pb[0]) > 0;

    const line = isOverflown
      ? this.createSvgPath([
          [pb[0], pb[1]],
          [cx, pb[1]],
          [cx, pe[1]],
          [pe[0], pe[1]],
        ])
      : this.createSvgPath([
          [pb[0], pb[1]],
          [pb[0], cy],
          [pe[0], cy],
          [pe[0], pe[1]],
        ]);

    const preLine = `M ${0} ${0} L ${pb[0]} ${pb[1]} `;
    const postLine = ` M ${pe[0]} ${pe[1]} L ${width} ${height}`;
    const preOffsetLine = ConnectionUtils.getArrowOffsetPath(
      fromVect,
      0,
      0,
      this.arrowLength,
      this.minPortOffset,
    );
    const postOffsetLine = ConnectionUtils.getArrowOffsetPath(
      toVect,
      width,
      height,
      -this.arrowLength,
      -this.minPortOffset,
    );

    const pre = this.sourceArrow ? preOffsetLine : preLine;
    const post = this.targetArrow ? postOffsetLine : postLine;
    const linePath = `${pre}${line}${post}`;

    this.line.setAttribute("d", linePath);

    if (this.sourceArrow) {
      const arrowPath = ConnectionUtils.getArrowPath(
        fromVect,
        0,
        0,
        this.arrowLength,
        this.arrowWidth,
      );

      this.sourceArrow.setAttribute("d", arrowPath);
    }

    if (this.targetArrow) {
      const arrowPath = ConnectionUtils.getArrowPath(
        toVect,
        width,
        height,
        -this.arrowLength,
        this.arrowWidth,
      );

      this.targetArrow.setAttribute("d", arrowPath);
    }
  }

  private createSvgPath(p: Point[]): string {
    return `M ${p[0][0]} ${p[0][1]} L ${p[1][0]} ${p[1][1]} L ${p[2][0]} ${p[2][1]} L ${p[3][0]} ${p[3][1]}`;
  }
}
