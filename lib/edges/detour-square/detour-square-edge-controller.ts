import { PortPayload } from "@/port-payload";
import { EdgeController } from "../edge-controller";
import {
  createArrowPath,
  createDirectionVector,
  createPortCenter,
  createRotatedPoint,
} from "../utils";

export class DetourSquareEdgeController implements EdgeController {
  public readonly svg: SVGSVGElement;

  private readonly group: SVGGElement;

  private readonly line: SVGPathElement;

  private readonly sourceArrow: SVGPathElement | null = null;

  private readonly targetArrow: SVGPathElement | null = null;

  private readonly detourX: number;

  private readonly detourY: number;

  public constructor(
    private readonly color: string,
    private readonly width: number,
    private readonly arrowLength: number,
    private readonly arrowWidth: number,
    private readonly arrowOffset: number,
    hasSourceArrow: boolean,
    hasTargetArrow: boolean,
    private readonly roundness: number,
    detourDistance: number,
    detourDirection: number,
  ) {
    this.detourX = Math.cos(detourDirection) * detourDistance;
    this.detourY = Math.sin(detourDirection) * detourDistance;
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
    console.log(this.roundness);
    this.svg.style.width = `${width}px`;
    this.svg.style.height = `${height}px`;

    const fromCenter = createPortCenter(from);
    const toCenter = createPortCenter(to);
    const flipX = fromCenter[0] <= toCenter[0] ? 1 : -1;
    const flipY = fromCenter[1] <= toCenter[1] ? 1 : -1;

    this.svg.style.transform = `translate(${x}px, ${y}px)`;
    this.group.style.transform = `scale(${flipX}, ${flipY})`;

    const fromVect = createDirectionVector(from.direction, flipX, flipY);
    const toVect = createDirectionVector(to.direction, flipX, flipY);

    const pba = this.sourceArrow
      ? createRotatedPoint([this.arrowLength, 0], fromVect, [0, 0])
      : [0, 0];
    const pea = this.targetArrow
      ? createRotatedPoint([width - this.arrowLength, height], toVect, [
          width,
          height,
        ])
      : [width, height];

    const gap1 = this.arrowLength + this.arrowOffset;

    const pbl1 = createRotatedPoint([gap1, 0], fromVect, [0, 0]);
    const pbl2 = [pbl1[0] - this.detourX, pbl1[1] - this.detourY];
    const pel1 = createRotatedPoint([width - gap1, height], toVect, [
      width,
      height,
    ]);
    const pel2 = [pel1[0] - this.detourX, pel1[1] - this.detourY];

    const linePath = [
      `M ${pba[0]} ${pba[1]}`,
      `L ${pbl1[0]} ${pbl1[1]}`,
      `L ${pbl2[0]} ${pbl2[1]}`,
      `L ${pel2[0]} ${pel2[1]}`,
      `L ${pel1[0]} ${pel1[1]}`,
      `L ${pea[0]} ${pea[1]}`,
    ].join(" ");

    this.line.setAttribute("d", linePath);

    if (this.sourceArrow) {
      const arrowPath = createArrowPath(
        fromVect,
        0,
        0,
        this.arrowLength,
        this.arrowWidth,
      );

      this.sourceArrow.setAttribute("d", arrowPath);
    }

    if (this.targetArrow) {
      const arrowPath = createArrowPath(
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
