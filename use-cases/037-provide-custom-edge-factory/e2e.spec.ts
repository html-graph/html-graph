import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should create customized edges", async ({ page }) => {
  await page.goto(`${e2eBase}/037-provide-custom-edge-factory/`);
  await expect(page).toHaveScreenshot("initial.png");
});
