import { test, expect } from '@playwright/test';

test.describe('Navigation Menu Click Tests (Final Robust Version)', () => {
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
    await page.goto('https://raider-test-site.onrender.com/');
  });

  for (const item of navItems) {
    test(`Click "${item.menuText}" and verify page loads`, async ({ page }) => {
      try {
        // Click nav link inside nav only
        const navLink = page.locator('nav a', { hasText: item.menuText }).first();
        await expect(navLink).toBeVisible({ timeout: 5000 });
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle' }),
          navLink.click(),
        ]);

        // Wait for main heading only
        const heading = page.locator('h1.page-title');
        await expect(heading).toHaveText(new RegExp(item.expectedHeading, 'i'), { timeout: 7000 });

      } catch (error) {
        // Log all headings if test fails
        const headings = await page.locator('h1, h2, h3, .title').allTextContents();
        console.error(`\n❌ Navigation to "${item.menuText}" failed.`);
        console.error(`Expected heading: "${item.expectedHeading}"`);
        console.error('Headings found on page:', headings, '\n');
        throw error;
      }
    });
  }
});