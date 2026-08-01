import { test, expect } from '@playwright/test';

test.describe('Registration Flow', () => {
  test('should show registration form', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/register');
    await page.getByRole('button', { name: 'Register' }).click();
    
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });
});
