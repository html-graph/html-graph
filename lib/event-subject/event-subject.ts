export class EventSubject<T> {
  private callbacks = new Set<(payload: T) => void>();

  public emit(payload: T): void {
    this.callbacks.forEach((callback) => {
      callback(payload);
    });
  }

  public subscribe(callback: (payload: T) => void): void {
    this.callbacks.add(callback);
  }

  public unsubscribe(callback: (payload: T) => void): void {
    this.callbacks.delete(callback);
  }
}
