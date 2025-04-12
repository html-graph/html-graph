import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should listen to graph model events", async ({ page }) => {
  await page.goto(`${e2eBase}/079-listening-graph-model-events/`);
  await expect(page).toHaveScreenshot("initial.png");
});
