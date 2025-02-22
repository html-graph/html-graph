import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display many nodes", async ({ page }) => {
  await page.goto(`${e2eBase}/019-many-nodes/`);
  await expect(page).toHaveScreenshot("initial.png");
});
