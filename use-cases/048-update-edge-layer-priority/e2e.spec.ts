import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should update node layer priority", async ({ page }) => {
  await page.goto(`${e2eBase}/048-update-edge-layer-priority/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.locator("#priority").click();

  await expect(page).toHaveScreenshot("updated.png");
});
