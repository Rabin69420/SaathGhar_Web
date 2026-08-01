import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('should filter listings by location', async ({ page }) => {
    await page.goto('/listings');
    await page.getByPlaceholder('Search location...').fill('Kathmandu');
    await page.keyboard.press('Enter');
    
    // Check if URL contains the search param
    await expect(page).toHaveURL(/.*location=Kathmandu.*/);
  });

  test('should show empty state when no results found', async ({ page }) => {
    await page.goto('/listings?location=NonExistentPlace');
    await expect(page.getByText('No listings found')).toBeVisible();
  });
});
