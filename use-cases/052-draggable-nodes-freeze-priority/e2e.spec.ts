import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should freeze node priority when dragging", async ({ page }) => {
  await page.goto(`${e2eBase}/052-draggable-nodes-freeze-priority/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(170, 390);
  await page.mouse.down();
  await page.mouse.move(450, 480);

  await expect(page).toHaveScreenshot("after-move.png");
});
