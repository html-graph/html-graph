class CustomDOMRect {
  public bottom: number = 0;

  public left: number = 0;

  public right: number = 0;

  public top: number = 0;

  public constructor(
    public x: number = 0,
    public y: number = 0,
    public width: number = 0,
    public height: number = 0,
  ) {
    this.left = x;
    this.top = y;
    this.right = x + width;
    this.bottom = y + height;
  }

  public static fromRect(other?: DOMRectInit): DOMRect {
    return new DOMRect(other?.x, other?.y, other?.width, other?.height);
  }

  public toJSON(): string {
    return JSON.stringify(this);
  }
}

global.DOMRect = CustomDOMRect;
