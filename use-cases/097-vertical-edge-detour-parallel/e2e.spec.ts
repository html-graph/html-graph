import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display vertical detour parallel edges", async ({ page }) => {
  await page.goto(`${e2eBase}/097-vertical-edge-detour-parallel/`);
  await expect(page).toHaveScreenshot("initial.png");
});
