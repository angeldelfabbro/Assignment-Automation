import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Test Suite (POM)', () => {

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: `screenshots/${testInfo.title.replace(/\s+/g, '_')}.png`,
      });
    }
  });

  test('Should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('12341234', '12341234');

    await expect(page).toHaveURL(/account/);
  });

  test('Should show error for invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('12341234', '8888');

    await expect(loginPage.errorAlert).toBeVisible();
    await expect(loginPage.errorAlert).toContainText(/incorrect|invalid|error/i);
  });

  test('Should not login with empty username', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('', '12341234');

    const isInvalid = await loginPage.usernameInput.evaluate(
      (el: HTMLInputElement) => !el.checkValidity()
    );

    expect(isInvalid).toBeTruthy();
  });

  test('Should not login with empty password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('12341234', '');

    const isInvalid = await loginPage.passwordInput.evaluate(
      (el: HTMLInputElement) => !el.checkValidity()
    );

    expect(isInvalid).toBeTruthy();
  });
});
