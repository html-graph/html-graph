import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should render direct edges", async ({ page }) => {
  await page.goto(`${e2eBase}/087-direct-edges/`);
  await expect(page).toHaveScreenshot("initial.png");
});
