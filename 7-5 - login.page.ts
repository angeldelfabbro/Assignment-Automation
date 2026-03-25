import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#loginFrm_loginname');
    this.passwordInput = page.locator('#loginFrm_password');
    this.loginButton = page.locator('button[title="Login"]');
    this.errorAlert = page.locator('.alert-error, .alert-danger');
  }

  async goto() {
    await this.page.goto('https://raider-test-site.onrender.com/index.php?rt=account/login');
    await this.page.waitForLoadState('networkidle');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async isUsernameInvalid() {
    return await this.usernameInput.evaluate(
      (el: HTMLInputElement) => !el.checkValidity()
    );
  }

  async isPasswordInvalid() {
    return await this.passwordInput.evaluate(
      (el: HTMLInputElement) => !el.checkValidity()
    );
  }
}
