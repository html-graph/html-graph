import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should handle transform events", async ({ page }) => {
  await page.goto(`${e2eBase}/073-transform-events/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(470, 670);
  await page.mouse.down();

  await expect(page).toHaveScreenshot("started.png");

  await page.mouse.up();

  await expect(page).toHaveScreenshot("finished.png");
});
