import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should not shift when Space not pressed", async ({ page }) => {
  await page.goto(`${e2eBase}/075-custom-canvas-shift-mouse-event-verifier/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(300, 300);
  await page.mouse.down();
  await page.mouse.move(600, 300);

  await expect(page).toHaveScreenshot("initial.png");
});

test("should shift when Space pressed", async ({ page }) => {
  await page.goto(`${e2eBase}/075-custom-canvas-shift-mouse-event-verifier/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(300, 300);
  await page.keyboard.down("Space");
  await page.mouse.down();
  await page.mouse.move(600, 300);

  await expect(page).toHaveScreenshot("after-shift.png");
});
