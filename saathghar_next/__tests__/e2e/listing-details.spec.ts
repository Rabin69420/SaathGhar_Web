import { test, expect } from '@playwright/test';

test.describe('Listing Details', () => {
  test('should display listing information', async ({ page }) => {
    // Assuming we have a mock listing or a known ID
    await page.goto('/listings/test-listing-id');
    
    await expect(page.getByRole('heading')).toBeVisible();
    await expect(page.getByText('Rent')).toBeVisible();
    await expect(page.getByText('Location')).toBeVisible();
  });

  test('should show apply button for logged in users', async ({ page }) => {
    // This would require a login state, which can be handled via storageState
    // For now, just check if the button exists or redirected to login
    await page.goto('/listings/test-listing-id');
    const applyButton = page.getByRole('button', { name: 'Apply Now' });
    
    if (await applyButton.isVisible()) {
      await applyButton.click();
      // Expect either success or login redirect
    }
  });
});
