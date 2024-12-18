import { PortPayload } from "@/port-payload";
import { EdgeController } from "../edge-controller";
import { EdgeUtils } from "../edge-utils";

export class StraightEdgeController implements EdgeController {
  public readonly svg: SVGSVGElement;

  private readonly group: SVGGElement;

  private readonly line: SVGPathElement;

  private readonly sourceArrow: SVGPathElement | null = null;

  private readonly targetArrow: SVGPathElement | null = null;

  private readonly roundness: number;

  public constructor(
    private readonly color: string,
    private readonly width: number,
    private readonly arrowLength: number,
    private readonly arrowWidth: number,
    private readonly minPortOffset: number,
    hasSourceArrow: boolean,
    hasTargetArrow: boolean,
    roundness: number,
  ) {
    this.roundness = Math.min(this.minPortOffset, roundness);
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

    const fromCenter = EdgeUtils.getPortCenter(from);
    const toCenter = EdgeUtils.getPortCenter(to);
    const flipX = fromCenter[0] <= toCenter[0] ? 1 : -1;
    const flipY = fromCenter[1] <= toCenter[1] ? 1 : -1;

    this.svg.style.transform = `translate(${x}px, ${y}px)`;
    this.group.style.transform = `scale(${flipX}, ${flipY})`;

    const fromVect = EdgeUtils.getDirectionVector(from.direction, flipX, flipY);

    const toVect = EdgeUtils.getDirectionVector(to.direction, flipX, flipY);

    console.log(this.roundness);

    const gap = this.arrowLength + this.minPortOffset;
    const pb = EdgeUtils.rotate([gap, 0], fromVect, [0, 0]);
    const pe = EdgeUtils.rotate([width - gap, height], toVect, [width, height]);

    const [cx, cy] = [width / 2, height / 2];
    const isOverflown = flipX * (pe[0] - pb[0]) > 0;

    const line = isOverflown
      ? EdgeUtils.createStraightPath([
          [pb[0], pb[1]],
          [cx, pb[1]],
          [cx, pe[1]],
          [pe[0], pe[1]],
        ])
      : EdgeUtils.createStraightPath([
          [pb[0], pb[1]],
          [pb[0], cy],
          [pe[0], cy],
          [pe[0], pe[1]],
        ]);

    const preOffsetLine = EdgeUtils.getArrowOffsetPath(
      fromVect,
      0,
      0,
      this.arrowLength,
      this.minPortOffset,
    );
    const postOffsetLine = EdgeUtils.getArrowOffsetPath(
      toVect,
      width,
      height,
      -this.arrowLength,
      -this.minPortOffset,
    );

    const preLine = `M ${0} ${0} L ${pb[0]} ${pb[1]} `;
    const postLine = ` M ${pe[0]} ${pe[1]} L ${width} ${height}`;
    const pre = this.sourceArrow ? preOffsetLine : preLine;
    const post = this.targetArrow ? postOffsetLine : postLine;

    const linePath = `${pre}${line}${post}`;

    this.line.setAttribute("d", linePath);

    if (this.sourceArrow) {
      const arrowPath = EdgeUtils.getArrowPath(
        fromVect,
        0,
        0,
        this.arrowLength,
        this.arrowWidth,
      );

      this.sourceArrow.setAttribute("d", arrowPath);
    }

    if (this.targetArrow) {
      const arrowPath = EdgeUtils.getArrowPath(
        toVect,
        width,
        height,
        -this.arrowLength,
        this.arrowWidth,
      );

      this.targetArrow.setAttribute("d", arrowPath);
    }
  }
}
