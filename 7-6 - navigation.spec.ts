import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Navigation Menu Click Tests (POM)', () => {

  const navItems = [
    { menuText: 'Home', expectedHeading: 'Featured Products' },
    { menuText: 'Apparel', expectedHeading: 'Apparel' },
    { menuText: 'Makeup', expectedHeading: 'Makeup' },
    { menuText: 'Skincare', expectedHeading: 'Skincare' },
    { menuText: 'Fragrance', expectedHeading: 'Fragrance' },
    { menuText: 'Men', expectedHeading: 'Men' },
    { menuText: 'Hair Care', expectedHeading: 'Hair Care' },
    { menuText: 'Books', expectedHeading: 'Books' },
  ];

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
  });

  for (const item of navItems) {
    test(`Click "${item.menuText}" and verify page loads`, async ({ page }) => {
      const homePage = new HomePage(page);

      try {
        await homePage.navigateTo(item.menuText);

        await expect(homePage.heading).toHaveText(
          new RegExp(item.expectedHeading, 'i'),
          { timeout: 7000 }
        );

      } catch (error) {
        const headings = await page.locator('h1, h2, h3, .title').allTextContents();

        console.error(`\n❌ Navigation to "${item.menuText}" failed.`);
        console.error(`Expected heading: "${item.expectedHeading}"`);
        console.error('Headings found on page:', headings, '\n');

        throw error;
      }
    });
  }
});
