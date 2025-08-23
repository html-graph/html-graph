import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should change edge color on hover", async ({ page }) => {
  await page.goto(`${e2eBase}/089-change-edge-color-on-hover/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(260, 400);

  await expect(page).toHaveScreenshot("after-hover.png");

  await page.mouse.move(240, 400);

  await expect(page).toHaveScreenshot("initial.png");
});
