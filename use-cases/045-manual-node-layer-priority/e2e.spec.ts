import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should set manual node layer priority", async ({ page }) => {
  await page.goto(`${e2eBase}/045-manual-node-layer-priority/`);
  await expect(page).toHaveScreenshot("initial.png");
});
