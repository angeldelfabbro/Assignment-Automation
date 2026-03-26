import { test, expect } from '@playwright/test';

test('broken test example', async ({ page }) => {
  await page.goto('https://example.com');

  // ❌ Intentional failure (wrong selector)
  await page.click('#this-does-not-exist');

  // This will never run
  await expect(page).toHaveTitle(/Example/);
});