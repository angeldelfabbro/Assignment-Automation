import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Scan - WCAG 2.1 A & AA', () => {

  test('should not have accessibility violations', async ({ page }) => {

    await page.goto('https://www.bbc.com/#bbc-main', {
      waitUntil: 'domcontentloaded'
    });

    const results = await new AxeBuilder({ page })
      .withTags([
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa'
      ])
      .analyze();

    if (results.violations.length > 0) {
      console.log(JSON.stringify(results.violations, null, 2));
    }

    expect(results.violations).toEqual([]);
  });

});
