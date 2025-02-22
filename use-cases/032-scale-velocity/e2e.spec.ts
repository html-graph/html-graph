import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should have inscreased scale velocity", async ({ page }) => {
  await page.goto(`${e2eBase}/032-scale-velocity/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(400, 500);
  await page.mouse.wheel(0, -3000);

  await expect(page).toHaveScreenshot("after-scale.png");
});
