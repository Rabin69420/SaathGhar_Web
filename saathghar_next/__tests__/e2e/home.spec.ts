import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load home page with hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Find Your Perfect Roommate' })).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Listings' })).toBeVisible();
  });
});
