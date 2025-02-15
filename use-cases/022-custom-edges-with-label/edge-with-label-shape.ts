import {
  EdgeRenderParams,
  EdgeRenderPort,
  EdgeShape,
  Point,
} from "@html-graph/html-graph";

export interface EdgeRectangle {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly flipX: number;
  readonly flipY: number;
}

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

  public render(params: EdgeRenderParams): void {
    const { x, y, width, height, flipX, flipY } = this.createEdgeRectangle(
      params.source,
      params.target,
    );

    this.svg.style.width = `${width}px`;
    this.svg.style.height = `${height}px`;
    this.svg.style.transform = `translate(${x}px, ${y}px)`;
    this.group.style.transform = `scale(${flipX}, ${flipY})`;

    const fromVect = this.createDirectionVector(
      params.source.direction,
      flipX,
      flipY,
    );
    const toVect = this.createDirectionVector(
      params.target.direction,
      flipX,
      flipY,
    );

    const fromRectVect: Point = { x: -1 * flipX, y: 0 };
    const toRectVect: Point = { x: 1 * flipX, y: 0 };

    const from: Point = { x: 0, y: 0 };

    const pbl = this.createRotatedPoint(
      { x: this.arrowLength, y: 0 },
      fromVect,
      from,
    );

    const pel = this.createRotatedPoint(
      { x: width - this.arrowLength, y: height },
      toVect,
      { x: width, y: height },
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
    const halfW = width / 2;
    const halfH = height / 2;
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
      x: pbr.x + this.rectCurvature * fromRectVect.x * flipX,
      y: pbr.y + this.rectCurvature * fromRectVect.y,
    };

    const perb: Point = {
      x: per.x + this.rectCurvature * toRectVect.x * flipX,
      y: per.y + this.rectCurvature * toRectVect.y,
    };

    const preLine = this.sourceArrow
      ? ""
      : `M ${from.x} ${from.y} L ${pbl.x} ${pbl.y} `;

    const bcurve = `M ${pbl.x} ${pbl.y} C ${pbb.x} ${pbb.y}, ${pbrb.x} ${pbrb.y}, ${pbr.x} ${pbr.y}`;
    const ecurve = `M ${per.x} ${per.y} C ${perb.x} ${perb.y}, ${peb.x} ${peb.y}, ${width} ${height}`;

    const postLine = this.targetArrow
      ? ""
      : ` M ${pel.x} ${pel.y} L ${width} ${height}`;

    const linePath = `${preLine}${bcurve}${ecurve}${postLine}`;

    this.line.setAttribute("d", linePath);

    if (this.sourceArrow) {
      const arrowPath = this.createArrowPath(
        fromVect,
        from.x,
        from.y,
        this.arrowLength,
        this.arrowWidth,
      );

      this.sourceArrow.setAttribute("d", arrowPath);
    }

    if (this.targetArrow) {
      const arrowPath = this.createArrowPath(
        toVect,
        width,
        height,
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

  private createEdgeRectangle(
    source: EdgeRenderPort,
    target: EdgeRenderPort,
  ): EdgeRectangle {
    const centerFrom: Point = {
      x: source.x + source.width / 2,
      y: source.y + source.height / 2,
    };

    const centerTo: Point = {
      x: target.x + target.width / 2,
      y: target.y + target.height / 2,
    };

    const x = Math.min(centerFrom.x, centerTo.x);
    const y = Math.min(centerFrom.y, centerTo.y);
    const width = Math.abs(centerTo.x - centerFrom.x);
    const height = Math.abs(centerTo.y - centerFrom.y);

    const flipX = centerFrom.x <= centerTo.x ? 1 : -1;
    const flipY = centerFrom.y <= centerTo.y ? 1 : -1;

    return {
      x,
      y,
      width,
      height,
      flipX,
      flipY,
    };
  }

  private createArrowPath(
    vect: Point,
    shiftX: number,
    shiftY: number,
    arrowLength: number,
    arrowWidth: number,
  ): string {
    const arrowPoints: Point[] = [
      { x: 0, y: 0 },
      { x: arrowLength, y: arrowWidth },
      { x: arrowLength, y: -arrowWidth },
    ];

    const p: readonly Point[] = arrowPoints
      .map((p) => this.createRotatedPoint(p, vect, { x: 0, y: 0 }))
      .map((p) => ({ x: p.x + shiftX, y: p.y + shiftY }));

    const amove = `M ${p[0].x} ${p[0].y}`;
    const aline1 = `L ${p[1].x} ${p[1].y}`;
    const aline2 = `L ${p[2].x} ${p[2].y}`;

    return `${amove} ${aline1} ${aline2}`;
  }

  private createRotatedPoint(
    point: Point,
    vector: Point,
    center: Point,
  ): Point {
    /**
     * translate to center
     *  1  0  c1
     *  0  1  c2
     *  0  0  1
     *
     * rotate
     *  v0 -v1  0
     *  v1  v0  0
     *  0   0   1
     *
     * translate back
     *  1  0  -c1
     *  0  1  -c2
     *  0  0  1
     *
     *  v0 -v1 (1 - v0) * c1 + v1 * c2
     *  v1  v0 (1 - v0) * c2 -v1 * c1
     *  0   0  1
     */

    return {
      x:
        vector.x * point.x -
        vector.y * point.y +
        ((1 - vector.x) * center.x + vector.y * center.y),
      y:
        vector.y * point.x +
        vector.x * point.y +
        ((1 - vector.x) * center.y - vector.y * center.x),
    };
  }

  private createDirectionVector(
    direction: number,
    flipX: number,
    flipY: number,
  ): Point {
    return { x: flipX * Math.cos(direction), y: flipY * Math.sin(direction) };
  }
}
