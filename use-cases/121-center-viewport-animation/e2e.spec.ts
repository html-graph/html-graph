import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should animate viewport centering", async ({ page }) => {
  await page.goto(`${e2eBase}/121-center-viewport-animation/`);

  await expect(page).toHaveScreenshot("initial.png");

  page.click("[data-animate]");

  await new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, 200);
  });
  await expect(page).toHaveScreenshot("after.png");
});
