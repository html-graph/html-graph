export interface EventEmitter<T> {
  emit(payload: T): void;
}
