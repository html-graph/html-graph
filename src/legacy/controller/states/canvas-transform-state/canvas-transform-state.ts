import { ShiftVector } from "@/controller/models/shift-vector";

export class CanvasTransformState {
    private shift: ShiftVector = { dx: 0, dy: 0 };

    private scaleVector = 1;

    private currentShift: ShiftVector = { dx: 0, dy: 0 };

    setCurrentShift(dx: number, dy: number): void {
        this.currentShift = { dx, dy };
    }

    getShift(): ShiftVector {
        return this.shift;
    }

    releaseCurrentShift(): void {
        this.shift = {
            dx: this.shift.dx + this.currentShift.dx,
            dy: this.shift.dy + this.currentShift.dy
        }

        this.currentShift = { dx: 0, dy: 0};
    }

    updateScaleVector(value: number): void {
        this.scaleVector += value;
    }

    getScaleFactor(): number {
        if (this.scaleVector >= 1) {
            return this.scaleVector;
        }

        return -1 / (this.scaleVector - 2);
    }
}
