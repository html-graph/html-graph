import { EventSubject } from "./event-subject";

describe("EventSubject", () => {
  it("should call callback on emit", () => {
    const subject = new EventSubject<number>();

    const callback = jest.fn();

    subject.subscribe(callback);

    subject.emit(10);

    expect(callback).toHaveBeenCalledWith(10);
  });

  it("should not call callback after unsubscribe", () => {
    const subject = new EventSubject<number>();

    const callback = jest.fn();

    subject.subscribe(callback);
    subject.unsubscribe(callback);

    subject.emit(10);

    expect(callback).not.toHaveBeenCalled();
  });
});
