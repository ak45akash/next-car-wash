import { test, expect } from '@playwright/test';

test.describe('Public pages', () => {
  test('homepage loads with navigation and hero', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Diamond Steam Car Wash/i);
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('link', { name: /book now/i }).first()).toBeVisible();
  });

  test('services page loads', async ({ page }) => {
    await page.goto('/services');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /book now/i }).first()).toBeVisible();
  });

  test('about page loads', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('contact page loads with form', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByPlaceholder('Your name')).toBeVisible();
    await expect(page.getByPlaceholder('Your email address')).toBeVisible();
    await expect(page.getByPlaceholder('How can we help you?')).toBeVisible();
  });

  test('privacy and terms pages load', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.goto('/terms');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('navbar links navigate correctly', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /^services$/i }).first().click();
    await expect(page).toHaveURL(/\/services/);

    await page.getByRole('link', { name: /^about$/i }).first().click();
    await expect(page).toHaveURL(/\/about/);

    await page.getByRole('link', { name: /^contact$/i }).first().click();
    await expect(page).toHaveURL(/\/contact/);
  });
});

test.describe('Booking flow', () => {
  test('book page loads with form fields', async ({ page }) => {
    await page.goto('/book');
    await expect(page.getByRole('heading', { name: /book your car wash/i })).toBeVisible();

    await expect(page.getByPlaceholder('Your name')).toBeVisible();
    await expect(page.getByPlaceholder('Your email address')).toBeVisible();
    await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  });

  test('service pre-selection via URL parameter', async ({ page }) => {
    await page.goto('/book?service=1');
    await page.waitForLoadState('networkidle');

    const serviceSelect = page.locator('select[name="service"]');
    if (await serviceSelect.count() > 0) {
      const value = await serviceSelect.inputValue();
      expect(value).toBeTruthy();
    }
  });
});

test.describe('Contact form', () => {
  test('submits contact form successfully', async ({ page }) => {
    await page.goto('/contact');

    await page.getByPlaceholder('Your name').fill('E2E Test User');
    await page.getByPlaceholder('Your email address').fill(`e2e-${Date.now()}@example.com`);
    await page.getByPlaceholder('How can we help you?').fill('This is an automated E2E test message.');

    await page.getByRole('button', { name: /send message/i }).click();

    await expect(page.getByText(/message sent/i)).toBeVisible({ timeout: 15000 });
  });

  test('shows validation for empty required fields', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: /send message/i }).click();
    // HTML5 required attributes prevent submission; success message should not appear
    await expect(page.getByText(/message sent/i)).not.toBeVisible();
    await expect(page.getByPlaceholder('Your name')).toBeVisible();
  });
});

test.describe('Authentication', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in|login/i })).toBeVisible();
  });

  test('dashboard redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });

  test('shows error for invalid login credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword123');
    await page.getByRole('button', { name: /sign in|login/i }).click();

    await expect(
      page.getByText(/invalid|incorrect|failed|error/i).first()
    ).toBeVisible({ timeout: 15000 });
  });
});

test.describe('API health', () => {
  test('health endpoint returns connected status', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.connected).toBe(true);
    expect(body.tables).toBeDefined();
  });
});
