import { EventSubject } from "../event-subject";

export class EventHandler<T> {
  public constructor(private readonly eventSubject: EventSubject<T>) {}

  public subscribe(callback: (payload: T) => void): void {
    this.eventSubject.subscribe(callback);
  }

  public unsubscribe(callback: (payload: T) => void): void {
    this.eventSubject.unsubscribe(callback);
  }
}
