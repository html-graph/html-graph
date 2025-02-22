import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display custom priority", async ({ page }) => {
  await page.goto(`${e2eBase}/056-default-custom-priority/`);
  await expect(page).toHaveScreenshot("initial.png");
});
