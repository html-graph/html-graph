import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should apply draggable edges", async ({ page }) => {
  await page.goto(`${e2eBase}/125-user-draggable-edges-move-outside/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(450, 500);
  await page.mouse.down();
  await page.mouse.move(-100, -100);

  await expect(page).toHaveScreenshot("initial.png");
});
