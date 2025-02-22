import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should remove edge", async ({ page }) => {
  await page.goto(`${e2eBase}/063-remove-edge/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.locator("#remove-edge").click();

  await expect(page).toHaveScreenshot("after-remove.png");
});
