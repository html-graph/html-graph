import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should to specific nodes", async ({ page }) => {
  await page.goto(`${e2eBase}/112-viewport-navigation-specific-nodes/`);

  await expect(page).toHaveScreenshot("initial.png");
});
