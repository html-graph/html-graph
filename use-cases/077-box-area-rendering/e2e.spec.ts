import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display nodes related to viewport", async ({ page }) => {
  await page.goto(`${e2eBase}/077-box-area-rendering/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.locator("#width").fill("3000");
  await page.locator("#height").fill("3000");
  await page.locator("#apply").click();

  await expect(page).toHaveScreenshot("after-viewport-change.png");

  await page.locator("#x").fill("500");
  await page.locator("#y").fill("500");
  await page.locator("#apply").click();

  await expect(page).toHaveScreenshot("after-viewport-shift.png");
});
