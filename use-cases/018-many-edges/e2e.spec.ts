import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display many edges", async ({ page }) => {
  await page.goto(`${e2eBase}/018-many-edges/`);
  await expect(page).toHaveScreenshot("initial.png");
});
