import { EventEmitter } from "./event-emitter";
import { EventHandler } from "./event-handler";
import { EventSubject } from "./event-subject";

export const createPair = <T>(): readonly [
  EventEmitter<T>,
  EventHandler<T>,
] => {
  const subject = new EventSubject<T>();

  return [subject, subject];
};
