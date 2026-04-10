import { EventTagger } from "./event-tagger";

describe("EventTagger", () => {
  it("should verify event has no tag when not set", () => {
    const event = new MouseEvent("mouseup");

    const eventTagger = new EventTagger();

    expect(eventTagger.has(event, "test-tag")).toBe(false);
  });

  it("should verify event has tag when set", () => {
    const event = new MouseEvent("mouseup");

    const eventTagger = new EventTagger();

    eventTagger.tag(event, "test-tag");

    expect(eventTagger.has(event, "test-tag")).toBe(true);
  });

  it("should keep added tags", () => {
    const event = new MouseEvent("mouseup");

    const eventTagger = new EventTagger();

    eventTagger.tag(event, "test-tag-1");
    eventTagger.tag(event, "test-tag-2");

    expect(eventTagger.has(event, "test-tag-1")).toBe(true);
  });
});
