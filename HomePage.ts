import type { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly nav: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nav = page.getByRole('navigation');
    this.heading = page.locator('h1.page-title');
  }

  async goto() {
    await this.page.goto('https://raider-test-site.onrender.com/');
  }

  async navigateTo(linkName: string) {
    const link = this.nav.getByRole('link', { name: new RegExp(linkName, 'i') }).first();

    await link.waitFor({ state: 'visible' });

    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      link.click(),
    ]);
  }
}