import { test, expect } from '@playwright/test';

const BASE_URL = 'https://raider-test-site.onrender.com/index.php?rt=account/login';

// Selectors
const LOGIN_INPUT = '#loginFrm_loginname';
const PASSWORD_INPUT = '#loginFrm_password';
const LOGIN_BUTTON = 'button[title="Login"]';
const ERROR_ALERT = '.alert-error, .alert-danger';

test.describe('Login Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle'); // Ensure page is fully loaded
  });

  // Take screenshot on failure for all tests
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ path: `screenshots/${testInfo.title.replace(/\s+/g, '_')}.png` });
    }
  });

  test('Should login successfully with valid credentials', async ({ page }) => {
    await page.fill(LOGIN_INPUT, '12341234');
    await page.fill(PASSWORD_INPUT, '12341234');
    await page.click(LOGIN_BUTTON);

    // Verify redirect after successful login
    await expect(page).toHaveURL(/account/);
  });

  test('Should show error for invalid password', async ({ page }) => {
    await page.fill(LOGIN_INPUT, '12341234');
    await page.fill(PASSWORD_INPUT, '8888');
    await page.click(LOGIN_BUTTON);

    const error = page.locator(ERROR_ALERT);

    await expect(error).toBeVisible();
    await expect(error).toContainText(/incorrect|invalid|error/i);
  });

  test('Should not login with empty username', async ({ page }) => {
    await page.fill(LOGIN_INPUT, '');
    await page.fill(PASSWORD_INPUT, '12341234');
    await page.click(LOGIN_BUTTON);

    const usernameField = page.locator(LOGIN_INPUT);

    // Validate browser-side HTML5 validation
    const isInvalid = await usernameField.evaluate((el: HTMLInputElement) => !el.checkValidity());
    expect(isInvalid).toBeTruthy();
  });

  test('Should not login with empty password', async ({ page }) => {
    await page.fill(LOGIN_INPUT, '12341234');
    await page.fill(PASSWORD_INPUT, '');
    await page.click(LOGIN_BUTTON);

    const passwordField = page.locator(PASSWORD_INPUT);

    // Validate browser-side HTML5 validation
    const isInvalid = await passwordField.evaluate((el: HTMLInputElement) => !el.checkValidity());
    expect(isInvalid).toBeTruthy();
  });

});