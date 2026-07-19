import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display orthogonal edges correctly", async ({ page }) => {
  await page.goto(`${e2eBase}/131-orthogonal-edges/`);
  await expect(page).toHaveScreenshot("initial.png");
});
