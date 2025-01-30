// global.resizeStore = class {
//   public setElementBox(element: HTMLElement, rect: DOMRect): void {
//     element.getBoundingClientRect = (): DOMRect => {
//       return rect;
//     };
//   }

//   public resize(element: HTMLElement, rect: DOMRect): void {
//     element.getBoundingClientRect = (): DOMRect => {
//       return rect;
//     };
//   }
// };

// global.ResizeObserver = class {
//   private readonly elements = new Set<HTMLElement>();

//   public constructor(private readonly callback: ResizeObserverCallback) {}

//   public disconnect(): void {
//     this.elements.clear();
//   }

//   public observe(element: HTMLElement): void {
//     this.elements.add(element);

//     this.callback(
//       [
//         {
//           borderBoxSize: [],
//           contentBoxSize: [],
//           contentRect: element.getBoundingClientRect(),
//           devicePixelContentBoxSize: [],
//           target: element,
//         },
//       ],
//       this,
//     );
//   }

//   public unobserve(element: HTMLElement): void {
//     this.elements.delete(element);
//   }
// };

global.DOMRect = class {
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
};
