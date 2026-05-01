import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should calculate box port offset", async ({ page }) => {
  await page.goto(`${e2eBase}/129-dynamic-arrow-offset/`);
  await expect(page).toHaveScreenshot("initial.png");
});
