import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should update edge shape", async ({ page }) => {
  await page.goto(`${e2eBase}/017-update-edge-shape/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.locator("#update-edge-shape").click();

  await expect(page).toHaveScreenshot("after.png");
});
