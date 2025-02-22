import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should clear canvas", async ({ page }) => {
  await page.goto(`${e2eBase}/066-clear/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.locator("#clear").click();

  await expect(page).toHaveScreenshot("after-clear.png");
});
