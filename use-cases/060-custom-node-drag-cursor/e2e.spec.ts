import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should set custom node drag cursor", async ({ page }) => {
  await page.goto(`${e2eBase}/060-custom-node-drag-cursor/`);

  await page.mouse.move(170, 390);
  await page.mouse.down();

  const canvas = page.locator("#canvas");
  const cursor = await canvas.evaluate((element) => element.style.cursor);

  expect(cursor).toBe("crosshair");
});
