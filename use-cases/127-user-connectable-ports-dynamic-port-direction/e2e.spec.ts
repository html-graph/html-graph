import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should change dragging port direction", async ({ page }) => {
  await page.goto(
    `${e2eBase}/127-user-connectable-ports-dynamic-port-direction/`,
  );
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(200, 350);
  await page.mouse.down();
  await page.mouse.move(200, 550);

  await expect(page).toHaveScreenshot("down-port-direction.png");

  await page.mouse.move(450, 500);

  await expect(page).toHaveScreenshot("left-port-direction.png");
});
