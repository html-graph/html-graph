import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should update port coordinates", async ({ page }) => {
  await page.goto(`${e2eBase}/010-port-coordinates-update/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.locator("#update-port-coordinates").click();

  await expect(page).toHaveScreenshot("after.png");
});
