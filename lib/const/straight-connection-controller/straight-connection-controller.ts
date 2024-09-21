import { ConnectionController } from "../../models/connection/connection-controller";
import { PortPayload } from "../../models/store/port-payload";
import { ConnectionUtils } from "../../utils/connection-utils/connection-utils";

export class StraightConnectionController implements ConnectionController {
  readonly svg: SVGSVGElement;

  private readonly group: SVGGElement;

  private readonly line: SVGPathElement;

  private readonly sourceArrow: SVGPathElement | null = null;

  private readonly targetArrow: SVGPathElement | null = null;

  constructor(
    private readonly color: string,
    private readonly width: number,
    private readonly arrowLength: number,
    private readonly arrowWidth: number,
    private readonly hasSourceArrow: boolean,
    private readonly hasTargetArrow: boolean,
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

    if (this.hasSourceArrow) {
      this.sourceArrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );

      this.sourceArrow.setAttribute("fill", this.color);
      this.group.appendChild(this.sourceArrow);
    }

    if (this.hasTargetArrow) {
      this.targetArrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );

      this.targetArrow.setAttribute("fill", this.color);
      this.group.appendChild(this.targetArrow);
    }

    this.svg.style.overflow = "visible";
  }

  update(
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

    const pointBegin = ConnectionUtils.rotate(
      [this.arrowLength, 0],
      fromVect,
      [0, 0],
    );

    const pointEnd = ConnectionUtils.rotate(
      [width - this.arrowLength, height],
      toVect,
      [width, height],
    );

    const [halfX, halfY] = [width / 2, height / 2];

    const line =
      flipX * (pointEnd[0] - pointBegin[0]) > 0
        ? `M ${pointBegin[0]} ${pointBegin[1]} L ${halfX} ${pointBegin[1]} L ${halfX} ${pointEnd[1]} L ${pointEnd[0]} ${pointEnd[1]}`
        : `M ${pointBegin[0]} ${pointBegin[1]} L ${pointBegin[0]} ${halfY} L ${pointEnd[0]} ${halfY} L ${pointEnd[0]} ${pointEnd[1]}`;

    const preLine = `M ${0} ${0} L ${pointBegin[0]} ${pointBegin[1]} `;
    const postLine = ` M ${pointEnd[0]} ${pointEnd[1]} L ${width} ${height}`;
    const linePath = `${this.sourceArrow ? "" : preLine}${line}${this.targetArrow ? "" : postLine}`;

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
}
