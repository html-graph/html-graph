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

  private readonly text = this.createText();

  private readonly textRectRadius = 5;

  private readonly textRect = this.createTextRect(this.textRectRadius);

  private readonly color = "#5c5c5c";

  private readonly width = 1;

  private readonly curvature = 90;

  private readonly arrowLength = 15;

  private readonly arrowWidth = 4;

  private readonly hasSourceArrow = false;

  private readonly hasTargetArrow = true;

  public constructor(label: string) {
    this.svg = this.createSvg();

    this.group = this.createGroup();
    this.svg.appendChild(this.group);

    this.line = this.createLine();
    this.group.appendChild(this.line);

    if (this.hasSourceArrow) {
      this.sourceArrow = this.createArrow();
      this.group.appendChild(this.sourceArrow);
    }

    if (this.hasTargetArrow) {
      this.targetArrow = this.createArrow();
      this.group.appendChild(this.targetArrow);
    }

    this.svg.appendChild(this.textRect);

    this.text.textContent = label;
    this.svg.appendChild(this.text);
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
    this.svg.style.transform = `translate(${x}px, ${y}px)`;

    const fromCenter = createPortCenter(from);
    const toCenter = createPortCenter(to);
    const flipX = fromCenter.x <= toCenter.x ? 1 : -1;
    const flipY = fromCenter.y <= toCenter.y ? 1 : -1;

    this.group.style.transform = `scale(${flipX}, ${flipY})`;

    const fromVect = createDirectionVector(from.direction, flipX, flipY);
    const toVect = createDirectionVector(to.direction, flipX, flipY);

    const begin: Point = { x: 0, y: 0 };
    const end: Point = { x: width, y: height };

    const pb = createRotatedPoint(
      { x: this.arrowLength, y: 0 },
      fromVect,
      begin,
    );

    const pe = createRotatedPoint(
      { x: width - this.arrowLength, y: height },
      toVect,
      end,
    );

    const bpb: Point = {
      x: pb.x + fromVect.x * this.curvature,
      y: pb.y + fromVect.y * this.curvature,
    };

    const bpe: Point = {
      x: pe.x - toVect.x * this.curvature,
      y: pe.y - toVect.y * this.curvature,
    };

    const preLine = this.sourceArrow
      ? ""
      : `M ${begin.x} ${begin.y} L ${pb.x} ${pb.y} `;

    const lcurve = `M ${pb.x} ${pb.y} C ${bpb.x} ${bpb.y}, ${bpe.x} ${bpe.y}, ${pe.x} ${pe.y}`;

    const postLine = this.targetArrow
      ? ""
      : ` M ${pe.x} ${pe.y} L ${end.x} ${end.y}`;

    const linePath = `${preLine}${lcurve}${postLine}`;

    this.line.setAttribute("d", linePath);

    if (this.sourceArrow) {
      const arrowPath = createArrowPath(
        fromVect,
        begin.x,
        begin.y,
        this.arrowLength,
        this.arrowWidth,
      );

      this.sourceArrow.setAttribute("d", arrowPath);
    }

    if (this.targetArrow) {
      const arrowPath = createArrowPath(
        toVect,
        end.x,
        end.y,
        -this.arrowLength,
        this.arrowWidth,
      );

      this.targetArrow.setAttribute("d", arrowPath);
    }

    const box = this.text.getBBox();
    console.log(box);

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

  private createSvg(): SVGSVGElement {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    svg.style.pointerEvents = "none";
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.overflow = "visible";

    return svg;
  }

  private createGroup(): SVGGElement {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

    group.style.transformOrigin = `50% 50%`;

    return group;
  }

  private createLine(): SVGPathElement {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");

    line.setAttribute("stroke", this.color);
    line.setAttribute("stroke-width", `${this.width}`);
    line.setAttribute("fill", "none");

    return line;
  }

  private createArrow(): SVGPathElement {
    const arrow = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );

    arrow.setAttribute("fill", this.color);

    return arrow;
  }

  private createTextRect(r: number): SVGRectElement {
    const textRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );
    textRect.setAttribute("fill", "#fff");
    textRect.setAttribute("stroke", "#5c5c5c");
    textRect.setAttribute("rx", `${r}`);

    return textRect;
  }

  private createText(): SVGTextElement {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "10px");

    return text;
  }
}
