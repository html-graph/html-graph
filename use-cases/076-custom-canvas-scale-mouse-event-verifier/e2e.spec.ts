import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should not scale when Space not pressed", async ({ page }) => {
  await page.goto(`${e2eBase}/076-custom-canvas-scale-mouse-event-verifier/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(300, 300);
  await page.mouse.wheel(0, -300);

  await expect(page).toHaveScreenshot("initial.png");
});

test("should scale when Space pressed", async ({ page }) => {
  await page.goto(`${e2eBase}/076-custom-canvas-scale-mouse-event-verifier/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(300, 300);
  await page.keyboard.down("Space");
  await page.mouse.wheel(0, -300);

  await expect(page).toHaveScreenshot("after-scale.png");
});
