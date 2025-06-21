import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should add connection from port element marked twice and unmarked once", async ({
  page,
}) => {
  await page.goto(`${e2eBase}/084-user-connectable-ports-same-element-ports/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(250, 400);
  await page.mouse.down();
  await page.mouse.move(450, 500);
  await page.mouse.up();

  await expect(page).toHaveScreenshot("after-edge-added.png");
});
