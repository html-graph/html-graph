import { EdgeShape, Point } from "@html-graph/html-graph";
import {
  createArrowPath,
  createDirectionVector,
  createRotatedPoint,
} from "../shared/edge-utils";
import { RenderParams } from "@/edges";

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

  private readonly rectCurvature = 50;

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

  public render(params: RenderParams): void {
    this.group.style.transform = `scale(${params.flipX}, ${params.flipY})`;

    const fromVect = createDirectionVector(
      params.fromDir,
      params.flipX,
      params.flipY,
    );
    const toVect = createDirectionVector(
      params.toDir,
      params.flipX,
      params.flipY,
    );

    const fromRectVect: Point = { x: -1 * params.flipX, y: 0 };
    const toRectVect: Point = { x: 1 * params.flipX, y: 0 };

    const from: Point = { x: 0, y: 0 };

    const pbl = createRotatedPoint(
      { x: this.arrowLength, y: 0 },
      fromVect,
      from,
    );

    const pel = createRotatedPoint(
      { x: params.to.x - this.arrowLength, y: params.to.y },
      toVect,
      params.to,
    );

    const pbb: Point = {
      x: pbl.x + fromVect.x * this.curvature,
      y: pbl.y + fromVect.y * this.curvature,
    };

    const peb: Point = {
      x: pel.x - toVect.x * this.curvature,
      y: pel.y - toVect.y * this.curvature,
    };

    const box = this.text.getBBox();
    const halfW = params.to.x / 2;
    const halfH = params.to.y / 2;
    const halfRectW = box.width / 2 + this.textRectRadius;
    const halfRectH = box.height / 2 + this.textRectRadius;
    const rectX = halfW - halfRectW;
    const rectY = halfH - halfRectH;
    const rectW = halfRectW * 2;
    const rectH = halfRectH * 2;

    const pbr: Point = {
      x: halfW - halfRectW,
      y: halfH,
    };

    const per: Point = {
      x: halfW + halfRectW,
      y: halfH,
    };

    const pbrb: Point = {
      x: pbr.x + this.rectCurvature * fromRectVect.x * params.flipX,
      y: pbr.y + this.rectCurvature * fromRectVect.y,
    };

    const perb: Point = {
      x: per.x + this.rectCurvature * toRectVect.x * params.flipX,
      y: per.y + this.rectCurvature * toRectVect.y,
    };

    const preLine = this.sourceArrow
      ? ""
      : `M ${from.x} ${from.y} L ${pbl.x} ${pbl.y} `;

    const bcurve = `M ${pbl.x} ${pbl.y} C ${pbb.x} ${pbb.y}, ${pbrb.x} ${pbrb.y}, ${pbr.x} ${pbr.y}`;
    const ecurve = `M ${per.x} ${per.y} C ${perb.x} ${perb.y}, ${peb.x} ${peb.y}, ${params.to.x} ${params.to.y}`;

    const postLine = this.targetArrow
      ? ""
      : ` M ${pel.x} ${pel.y} L ${params.to.x} ${params.to.y}`;

    const linePath = `${preLine}${bcurve}${ecurve}${postLine}`;

    this.line.setAttribute("d", linePath);

    if (this.sourceArrow) {
      const arrowPath = createArrowPath(
        fromVect,
        from.x,
        from.y,
        this.arrowLength,
        this.arrowWidth,
      );

      this.sourceArrow.setAttribute("d", arrowPath);
    }

    if (this.targetArrow) {
      const arrowPath = createArrowPath(
        toVect,
        params.to.x,
        params.to.y,
        -this.arrowLength,
        this.arrowWidth,
      );

      this.targetArrow.setAttribute("d", arrowPath);
    }

    this.textRect.setAttribute("x", `${rectX}`);
    this.textRect.setAttribute("y", `${rectY}`);
    this.textRect.setAttribute("width", `${rectW}`);
    this.textRect.setAttribute("height", `${rectH}`);

    this.text.setAttribute("x", `${halfW}`);
    this.text.setAttribute("y", `${halfH}`);
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
