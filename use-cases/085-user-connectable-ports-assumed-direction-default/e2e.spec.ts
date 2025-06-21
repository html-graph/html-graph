import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should render connection with specified dragging port direction", async ({
  page,
}) => {
  await page.goto(
    `${e2eBase}/085-user-connectable-ports-assumed-direction-default/`,
  );
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(200, 250);
  await page.mouse.down();
  await page.mouse.move(300, 300);

  await expect(page).toHaveScreenshot("dragging-in-progress.png");
});
