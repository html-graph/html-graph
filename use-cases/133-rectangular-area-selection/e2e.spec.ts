import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should select nodes with rectanglular selection", async ({ page }) => {
  await page.goto(`${e2eBase}/133-rectangular-area-selection/`);

  await page.mouse.move(100, 300);
  await page.keyboard.down("Control");
  await page.mouse.down();
  await page.mouse.move(600, 600);

  await expect(page).toHaveScreenshot("selection-rectangle.png");

  await page.mouse.up();

  await expect(page).toHaveScreenshot("selected-nodes.png");
});
