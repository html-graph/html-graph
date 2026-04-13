import { EventHandler } from "@/event-subject";
import { LayoutApplier } from "../layout-applier";

export class ManualLayoutApplicationStrategyConfigurator {
  private constructor(
    private readonly applier: LayoutApplier,
    private readonly trigger: EventHandler<void>,
  ) {
    this.trigger.subscribe(() => {
      this.applier.apply();
    });
  }

  public static configure(
    applier: LayoutApplier,
    trigger: EventHandler<void>,
  ): void {
    new ManualLayoutApplicationStrategyConfigurator(applier, trigger);
  }
}
