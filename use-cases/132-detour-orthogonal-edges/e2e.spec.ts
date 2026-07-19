import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display detour orthogonal correctly", async ({ page }) => {
  await page.goto(`${e2eBase}/132-detour-orthogonal-edges/`);
  await expect(page).toHaveScreenshot("initial.png");
});
