import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should update port direction", async ({ page }) => {
  await page.goto(`${e2eBase}/049-update-port-direction/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.locator("#direction").fill("1.5");

  await expect(page).toHaveScreenshot("updated.png");
});
