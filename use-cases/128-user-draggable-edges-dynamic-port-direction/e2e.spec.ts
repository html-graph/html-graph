import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should connect ports", async ({ page }) => {
  await page.goto(
    `${e2eBase}/128-user-draggable-edges-dynamic-port-direction/`,
  );
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(250, 400);
  await page.mouse.down();

  await page.mouse.move(550, 150);

  await expect(page).toHaveScreenshot("left-port-direction.png");
});
