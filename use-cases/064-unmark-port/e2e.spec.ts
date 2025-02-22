import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should unmark port", async ({ page }) => {
  await page.goto(`${e2eBase}/064-unmark-port/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.locator("#unmark-port").click();

  await expect(page).toHaveScreenshot("after-unmark.png");
});
