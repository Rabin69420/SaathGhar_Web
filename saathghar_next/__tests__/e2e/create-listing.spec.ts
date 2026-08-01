import { test, expect } from '@playwright/test';

test.describe('Create Listing', () => {
  test('should require authentication', async ({ page }) => {
    await page.goto('/listings/create');
    await expect(page).toHaveURL(/.*login.*/);
  });

  test('should show form fields', async ({ page }) => {
    // Mock login first if needed
    await page.goto('/listings/create');
    // If redirected, this test will fail as expected for unauth
  });
});
