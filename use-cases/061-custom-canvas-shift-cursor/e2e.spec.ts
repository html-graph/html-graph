import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should set custom canvas shift cursor", async ({ page }) => {
  await page.goto(`${e2eBase}/061-custom-canvas-shift-cursor/`);

  await page.mouse.move(700, 300);
  await page.mouse.down();

  const canvas = page.locator('//*[@id="canvas"]/div[1]/div[2]');
  const cursor = await canvas.evaluate((element) => element.style.cursor);

  expect(cursor).toBe("crosshair");
});
