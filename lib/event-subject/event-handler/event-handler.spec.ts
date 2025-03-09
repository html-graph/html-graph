import { EventHandler } from "./event-handler";
import { EventSubject } from "../event-subject";

describe("EventHandler", () => {
  it("should call callback on emit", () => {
    const subject = new EventSubject<number>();
    const handler = new EventHandler(subject);

    const callback = jest.fn();

    handler.subscribe(callback);

    subject.emit(10);

    expect(callback).toHaveBeenCalledWith(10);
  });

  it("should not call callback after unsubscribe", () => {
    const subject = new EventSubject<number>();
    const handler = new EventHandler(subject);

    const callback = jest.fn();

    handler.subscribe(callback);
    handler.unsubscribe(callback);

    subject.emit(10);

    expect(callback).not.toHaveBeenCalled();
  });
});
