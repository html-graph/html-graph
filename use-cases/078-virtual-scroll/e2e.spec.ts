import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display canvas with virtual scroll", async ({ page }) => {
  await page.goto(`${e2eBase}/078-virtual-scroll/`);
  await expect(page).toHaveScreenshot("initial.png");
});
