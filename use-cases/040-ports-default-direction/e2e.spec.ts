import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should set ports default direction", async ({ page }) => {
  await page.goto(`${e2eBase}/040-ports-default-direction/`);
  await expect(page).toHaveScreenshot("initial.png");
});
