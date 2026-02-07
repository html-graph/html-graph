import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should mirror layout", async ({ page }) => {
  await page.goto(`${e2eBase}/110-viewport-navigation-all-nodes/`);

  await expect(page).toHaveScreenshot("initial.png");
});
