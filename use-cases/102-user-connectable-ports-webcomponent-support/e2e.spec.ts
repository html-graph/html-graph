import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should connect ports", async ({ page }) => {
  await page.goto(
    `${e2eBase}/102-user-connectable-ports-webcomponent-support/`,
  );
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(250, 400);
  await page.mouse.down();
  await page.mouse.move(450, 500);
  await page.mouse.up();

  await expect(page).toHaveScreenshot("after-edge-added.png");
});
