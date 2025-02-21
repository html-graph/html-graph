import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should create bezier directed port", async ({ page }) => {
  await page.goto(`${e2eBase}/009-bezier-directed-port/`);
  await expect(page).toHaveScreenshot("initial.png");
});
