import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should snap nodes to grid", async ({ page }) => {
  await page.goto(`${e2eBase}/095-snap-nodes-to-grid/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(200, 400);
  await page.mouse.down();
  await page.mouse.move(488, 400);

  await expect(page).toHaveScreenshot("after-move.png");
});
