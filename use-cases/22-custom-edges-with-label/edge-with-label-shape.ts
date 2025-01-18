import { EdgeShape, Point, PortPayload } from "@html-graph/html-graph";
import {
  createArrowPath,
  createDirectionVector,
  createPortCenter,
  createRotatedPoint,
} from "../shared/edge-utils";

export class EdgeWithLabelShape implements EdgeShape {
  public readonly svg: SVGSVGElement;

  private readonly group: SVGGElement;

  private readonly line: SVGPathElement;

  private readonly sourceArrow: SVGPathElement | null = null;

  private readonly targetArrow: SVGPathElement | null = null;

  private readonly text = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text",
  );

  private readonly textRect = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect",
  );

  private readonly textRectRadius = 5;

  private readonly color = "#5c5c5c";

  private readonly width = 1;

  private readonly curvature = 90;

  private readonly arrowLength = 15;

  private readonly arrowWidth = 4;

  private readonly hasSourceArrow = false;

  private readonly hasTargetArrow = true;

  public constructor(label: string) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.style.pointerEvents = "none";
    this.svg.style.position = "absolute";
    this.svg.style.top = "0";
    this.svg.style.left = "0";

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

    this.text.textContent = label;

    this.textRect.setAttribute("fill", "#fff");
    this.textRect.setAttribute("stroke", "#5c5c5c");
    this.textRect.setAttribute("rx", `${this.textRectRadius}`);
    this.text.setAttribute("dominant-baseline", "middle");
    this.text.setAttribute("text-anchor", "middle");
    this.text.setAttribute("font-size", "10px");
    this.svg.appendChild(this.textRect);
    this.svg.appendChild(this.text);
  }

  public updatePosition(
    x: number,
    y: number,
    width: number,
    height: number,
    from: PortPayload,
    to: PortPayload,
  ): void {
    this.svg.style.width = `${width}px`;
    this.svg.style.height = `${height}px`;
    this.svg.style.transform = `translate(${x}px, ${y}px)`;

    const fromCenter = createPortCenter(from);
    const toCenter = createPortCenter(to);
    const flipX = fromCenter.x <= toCenter.x ? 1 : -1;
    const flipY = fromCenter.y <= toCenter.y ? 1 : -1;

    this.group.style.transform = `scale(${flipX}, ${flipY})`;

    const fromVect = createDirectionVector(from.direction, flipX, flipY);
    const toVect = createDirectionVector(to.direction, flipX, flipY);

    const pb = createRotatedPoint({ x: this.arrowLength, y: 0 }, fromVect, {
      x: 0,
      y: 0,
    });

    const pe = createRotatedPoint(
      { x: width - this.arrowLength, y: height },
      toVect,
      {
        x: width,
        y: height,
      },
    );

    const bpb: Point = {
      x: pb.x + fromVect.x * this.curvature,
      y: pb.y + fromVect.y * this.curvature,
    };

    const bpe: Point = {
      x: pe.x - toVect.x * this.curvature,
      y: pe.y - toVect.y * this.curvature,
    };

    const lcurve = `M ${pb.x} ${pb.y} C ${bpb.x} ${bpb.y}, ${bpe.x} ${bpe.y}, ${pe.x} ${pe.y}`;
    const preLine = this.sourceArrow ? "" : `M ${0} ${0} L ${pb.x} ${pb.y} `;
    const postLine = this.targetArrow
      ? ""
      : ` M ${pe.x} ${pe.y} L ${width} ${height}`;
    const linePath = `${preLine}${lcurve}${postLine}`;

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

    const box = this.text.getBBox();

    this.textRect.setAttribute(
      "x",
      `${(width - box.width) / 2 - this.textRectRadius}`,
    );
    this.textRect.setAttribute(
      "y",
      `${(height - box.height) / 2 - this.textRectRadius}`,
    );
    this.textRect.setAttribute(
      "width",
      `${box.width + 2 * this.textRectRadius}`,
    );
    this.textRect.setAttribute(
      "height",
      `${box.height + 2 * this.textRectRadius}`,
    );

    this.text.setAttribute("x", `${width / 2}`);
    this.text.setAttribute("y", `${height / 2}`);
  }
}
