import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should handle drag events", async ({ page }) => {
  await page.goto(`${e2eBase}/068-drag-started-event/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(170, 390);
  await page.mouse.down();

  await expect(page).toHaveScreenshot("after-grab.png");

  await page.mouse.move(500, 350);

  await expect(page).toHaveScreenshot("after-move.png");

  await page.mouse.up();

  await expect(page).toHaveScreenshot("after-move-finished.png");
});
