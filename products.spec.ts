import { test, expect } from '@playwright/test';

test('product_detail_test', async ({ page }) => {
    await page.goto('https://raider-test-site.onrender.com/');

    const products = page.locator('.product-card');
    const count = await products.count();

    for (let i = 0; i < count; i++) {
        const product = page.locator('.product-card').nth(i);

        const name = (await product.locator('h3').textContent())?.trim();
        const category = (await product.locator('.product-category').textContent())?.trim();
        const price = (await product.locator('.product-price').textContent())?.trim();

        const link = product.locator('a');

        // ✅ More reliable navigation handling
        await Promise.all([
            page.waitForURL(/\/product\/\d+/),
            link.click()
        ]);

        // ✅ Assertions
        await expect(page.locator('.product-detail-info h1')).toHaveText(name!);
        await expect(page.locator('.product-detail-info span')).toHaveText(category!);
        await expect(page.locator('.product-detail-price')).toHaveText(price!);

        // ✅ Go back safely
        await Promise.all([
            page.waitForLoadState('domcontentloaded'),
            page.goBack()
        ]);
    }
});