import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display horizontal detour parallel edges", async ({ page }) => {
  await page.goto(`${e2eBase}/096-horizontal-edge-detour-parallel/`);
  await expect(page).toHaveScreenshot("initial.png");
});
