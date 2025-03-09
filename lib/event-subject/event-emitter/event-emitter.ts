import { EventSubject } from "../event-subject";

export class EventEmitter<T> {
  public constructor(private readonly eventSubject: EventSubject<T>) {}

  public emit(payload: T): void {
    this.eventSubject.emit(payload);
  }
}
