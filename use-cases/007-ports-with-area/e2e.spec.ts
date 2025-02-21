import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should create ports with area", async ({ page }) => {
  await page.goto(`${e2eBase}/007-ports-with-area/`);
  await expect(page).toHaveScreenshot("initial.png");
});
