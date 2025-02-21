import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should mark port after node creation", async ({ page }) => {
  await page.goto(`${e2eBase}/005-mark-port-after-node-creation/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.locator("#mark-ports").click();

  await expect(page).toHaveScreenshot("marked-ports.png");

  await page.locator("#create-edge").click();

  await expect(page).toHaveScreenshot("created-edge.png");
});
