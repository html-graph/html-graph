import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display vertical edges", async ({ page }) => {
  await page.goto(`${e2eBase}/044-vertical-edges/`);
  await expect(page).toHaveScreenshot("initial.png");
});
