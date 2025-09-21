export class AnimationSeries {
  private previousTimeStamp: number | undefined = undefined;

  private readonly step = (timeStamp: number): void => {
    if (this.previousTimeStamp === undefined) {
      this.previousTimeStamp = timeStamp;
    } else {
      const dtSec = (timeStamp - this.previousTimeStamp) / 1000;
      this.previousTimeStamp = timeStamp;

      this.callback(dtSec);
    }

    this.win.requestAnimationFrame(this.step);
  };

  public constructor(
    private readonly win: Window,
    private readonly callback: (dtSec: number) => void,
  ) {
    this.win.requestAnimationFrame(this.step);
  }
}
