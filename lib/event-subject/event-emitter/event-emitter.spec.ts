import { EventEmitter } from "./event-emitter";
import { EventSubject } from "../event-subject";

describe("EventEmitter", () => {
  it("should call callback on emit", () => {
    const subject = new EventSubject<number>();
    const emitter = new EventEmitter(subject);

    const callback = jest.fn();

    subject.subscribe(callback);

    emitter.emit(10);

    expect(callback).toHaveBeenCalledWith(10);
  });
});
