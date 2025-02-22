import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should handle node drag programmatically", async ({ page }) => {
  await page.goto(`${e2eBase}/026-nodes-programmatic-drag/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(170, 390);
  await page.mouse.down();
  await page.mouse.move(500, 350);

  await expect(page).toHaveScreenshot("after-move.png");
});
