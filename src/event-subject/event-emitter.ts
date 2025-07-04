// Responsibility: Provides a way to trigger events
export interface EventEmitter<T> {
  emit(payload: T): void;
}
