import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should not drag node when Space not pressed", async ({ page }) => {
  await page.goto(`${e2eBase}/074-custom-node-drag-mouse-event-verifier/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(170, 390);
  await page.mouse.down();
  await page.mouse.move(500, 350);

  await expect(page).toHaveScreenshot("initial.png");
});

test("should drag node when Space pressed", async ({ page }) => {
  await page.goto(`${e2eBase}/074-custom-node-drag-mouse-event-verifier/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(170, 390);
  await page.keyboard.down("Space");
  await page.mouse.down();
  await page.mouse.move(500, 350);

  await expect(page).toHaveScreenshot("after-drag.png");
});
