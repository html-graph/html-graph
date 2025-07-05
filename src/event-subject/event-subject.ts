import { EventEmitter } from "./event-emitter";
import { EventHandler } from "./event-handler";

// Responsibility: Connects events and event handlers
export class EventSubject<T> implements EventEmitter<T>, EventHandler<T> {
  private readonly callbacks = new Set<(payload: T) => void>();

  public subscribe(callback: (payload: T) => void): void {
    this.callbacks.add(callback);
  }

  public unsubscribe(callback: (payload: T) => void): void {
    this.callbacks.delete(callback);
  }

  public emit(payload: T): void {
    this.callbacks.forEach((callback) => {
      callback(payload);
    });
  }
}
