import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "../core-html-view";
import { ViewportTransformer } from "@/viewport-transformer";
import { ViewportHtmlView } from "./viewport-html-view";
import { EventSubject } from "@/event-subject";
import { ViewportBox } from "./viewport-box";

const create = (): {
  trigger: EventSubject<ViewportBox>;
  store: GraphStore;
  coreView: CoreHtmlView;
  viewportView: ViewportHtmlView;
} => {
  const trigger = new EventSubject<ViewportBox>();
  const store = new GraphStore();
  const transformer = new ViewportTransformer();
  const coreView = new CoreHtmlView(store, transformer);
  const viewportView = new ViewportHtmlView(coreView, store, trigger);

  return { trigger, store, coreView, viewportView };
};

describe("ViewportHtmlView", () => {
  it("should call attach on core view", () => {
    const { coreView, viewportView } = create();
    const wrapper = document.createElement("div");
    const spy = jest.spyOn(coreView, "attach");

    viewportView.attach(wrapper);

    expect(spy).toHaveBeenCalledWith(wrapper);
  });

  it("should call detach on core view", () => {
    const { coreView, viewportView } = create();
    const spy = jest.spyOn(coreView, "detach");

    viewportView.detach();

    expect(spy).toHaveBeenCalled();
  });
});
