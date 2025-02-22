import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should remove node", async ({ page }) => {
  await page.goto(`${e2eBase}/065-remove-node/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.locator("#remove-node").click();

  await expect(page).toHaveScreenshot("after-remove.png");
});
