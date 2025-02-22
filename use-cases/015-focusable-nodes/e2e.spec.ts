import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should focus on node", async ({ page }) => {
  await page.goto(`${e2eBase}/015-focusable-nodes/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.keyboard.press("Tab");

  await expect(page).toHaveScreenshot("after-focus.png");
});
