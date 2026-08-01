import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should show login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Assuming there's a toast or error message
    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'Register' }).click();
    await expect(page).toHaveURL('/register');
  });
});
