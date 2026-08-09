import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should resolve in and out ports", async ({ page }) => {
  await page.goto(`${e2eBase}/020-port-id-resolver/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(750, 450);
  await page.mouse.down();
  await page.mouse.move(300, 300);
  await page.mouse.up();

  await expect(page).toHaveScreenshot("after-edge-added.png");
});
