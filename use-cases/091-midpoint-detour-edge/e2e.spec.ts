import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display midpoint for detour edge", async ({ page }) => {
  await page.goto(`${e2eBase}/091-midpoint-detour-edge/`);
  await expect(page).toHaveScreenshot("initial.png");
});
