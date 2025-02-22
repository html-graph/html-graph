import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should update node coordinates", async ({ page }) => {
  await page.goto(`${e2eBase}/016-update-node-coords/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.locator("#update-node-coords").click();

  await expect(page).toHaveScreenshot("after.png");
});
