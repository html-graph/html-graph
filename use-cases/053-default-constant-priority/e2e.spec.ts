import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display constant priority", async ({ page }) => {
  await page.goto(`${e2eBase}/053-default-constant-priority/`);
  await expect(page).toHaveScreenshot("initial.png");
});
