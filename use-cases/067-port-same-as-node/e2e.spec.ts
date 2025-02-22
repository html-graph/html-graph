import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should have port same as node", async ({ page }) => {
  await page.goto(`${e2eBase}/067-port-same-as-node/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(170, 390);
  await page.mouse.down();
  await page.mouse.move(500, 350);

  await expect(page).toHaveScreenshot("after-move.png");
});
