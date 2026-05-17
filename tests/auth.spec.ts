import { test, expect } from "@playwright/test";

/**
 * End-to-End (E2E) tests for Supabase authentication flow
 * 
 * These tests verify the core authentication functionality:
 * 1. Login page is accessible and displays the form
 * 2. Successful login redirects to the dashboard
 * 3. Sidebar navigation is visible after login
 */

// Test credentials from environment variables
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;

test.describe("Authentication Flow", () => {
  test("LOGIN PAGE VISIBLE: Navigate to /login and verify the login form elements are displayed", async ({
    page,
  }) => {
    // Navigate to the login page
    await page.goto("/login");

    // Verify the page has the expected authentication heading
    const heading = page.getByRole("heading", { name: /welcome back/i });
    await expect(heading).toBeVisible();

    // Verify the page has the authentication badge/label
    const authLabel = page.getByText(/authentication/i);
    await expect(authLabel).toBeVisible();

    // Verify email input field is visible (using placeholder as role-based locator)
    const emailInput = page.getByPlaceholder(/you@example.com/i);
    await expect(emailInput).toBeVisible();

    // Verify password input field is visible (using placeholder as role-based locator)
    const passwordInput = page.getByPlaceholder(/enter your password/i);
    await expect(passwordInput).toBeVisible();

    // Verify the submit button is visible (Sign In or Create Account depending on mode)
    const submitButton = page.getByRole("button", { name: /sign in|create account/i });
    await expect(submitButton).toBeVisible();

    // Verify the form description text is present
    const description = page.getByText(
      /sign in to access your project dashboard or create a new account/i
    );
    await expect(description).toBeVisible();
  });

  test("REDIRECT AFTER LOGIN: After successful login with valid credentials, the user is redirected to the projects page", async ({
    page,
  }) => {
    // Skip this test if credentials are not provided
    test.skip(
      !TEST_USER_EMAIL || !TEST_USER_PASSWORD,
      "TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables are required"
    );

    // Navigate to the login page
    await page.goto("/login");

    // Fill in the email field
   const emailInput = page.getByPlaceholder(/you@example.com/i);
await emailInput.fill(TEST_USER_EMAIL!);

const passwordInput = page.getByPlaceholder(/enter your password/i);
await passwordInput.fill(TEST_USER_PASSWORD!);

   
    // Submit the form
    const submitButton = page.getByRole("button", { name: /sign in/i });
    await submitButton.click();

    await page.waitForURL(/\/(projects|dashboard)/, { timeout: 30000 });


    // Verify we are on the projects page
    const currentUrl = page.url();
   expect(currentUrl).toMatch(/\/(projects|dashboard)/);

  });

  test("SIDEBAR NAVIGATION: After login, verify that sidebar navigation links are visible with correct labels", async ({
    page,
  }) => {
    // Skip this test if credentials are not provided
    test.skip(
      !TEST_USER_EMAIL || !TEST_USER_PASSWORD,
      "TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables are required"
    );

    // Navigate to the login page and authenticate
    await page.goto("/login");

    // Fill in and submit the login form
    const emailInput = page.getByLabel(/email/i);
    await emailInput.fill(TEST_USPlaceholder(/you@example.com/i);
    await emailInput.fill(TEST_USER_EMAIL!);

    const passwordInput = page.getByPlaceholder(/enter your password/i);
    await passwordInput.fill(TEST_USER_PASSWORD!);

    // Ensure we're in "sign-in" mode
    const signInModeButton = page.getByRole("button", { name: /sign in/i }).first();
    await signInModeButton.click();

    // Submit the form
    const submitButton = page.getByRole("button", { name: /sign in/i });
    await submitButton.click();

    // Wait for navigation to /projects
    await page.waitForURL(/\/(projects|dashboard)/, { timeout: 3
    // Verify the sidebar navigation links are visible
    // The sidebar should contain "Overview", "Projects", and "Settings" links

    const overviewLink = page.getByRole("link", { name: /overview/i });
    await expect(overviewLink).toBeVisible();

    const projectsLink = page.getByRole("link", { name: /projects/i });
    await expect(projectsLink).toBeVisible();

    const settingsLink = page.getByRole("link", { name: /settings/i });
    await expect(settingsLink).toBeVisible();

    // Verify the sidebar is rendered (contains the navigation group label)
    const navigationLabel = page.getByText(/navigation/i);
    await expect(navigationLabel).toBeVisible();
  });

  test("SIDEBAR NAVIGATION: Verify navigation links are clickable and navigate correctly", async ({
    page,
  }) => {
    // Skip this test if credentials are not provided
    test.skip(
      !TEST_USER_EMAIL || !TEST_USER_PASSWORD,
      "TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables are required"
    );

    // Navigate to the login page and authenticate
    await page.goto("/login");

    const emailInput = page.getByPlaceholder(/you@example.com/i);
    await emailInput.fill(TEST_USER_EMAIL!);

    const passwordInput = page.getByPlaceholder(/enter your password/i);
    await passwordInput.fill(TEST_USER_PASSWORD!);

    const signInModeButton = page.getByRole("button", { name: /sign in/i }).first();
    await signInModeButton.click();

    const submitButton = page.getByRole("button", { name: /sign in/i });
    await submitButton.click();

    await page.waitForURL(/\/(projects|dashboard)/, { timeout: 30000 });

    // Click on the "Overview" link
    const overviewLink = page.getByRole("link", { name: /overview/i });
    await overviewLink.click();

    // Verify navigation to the overview/home page
    await page.waitForURL("/", { timeout: 5000 });
    expect(page.url()).toContain("/");

    // Click on the "Projects" link
    const projectsLink = page.getByRole("link", { name: /projects/i });
    await projectsLink.click();

    // Verify navigation to the projects page
    await page.waitForURL("/projects", { timeout: 5000 });
    expect(page.url()).toContain("/projects");
  });

  test("LOGIN PAGE VISIBLE: Verify the mode toggle between sign-in and sign-up is accessible", async ({
    page,
  }) => {
    // Navigate to the login page
    await page.goto("/login");

    // Look for buttons or controls that allow switching between sign-in and sign-up modes
    // These might be labeled as "Sign In" and "Sign Up" tabs/buttons
    const modeButtons = page.getByRole("button", { name: /sign.?(in|up)/i });

    // Verify that mode toggle buttons are visible
    const count = await modeButtons.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // Verify both mode options are present
    const signInButton = page.getByRole("button", { name: /sign.?in/i });
    const signUpButton = page.getByRole("button", { name: /sign.?up/i });

    await expect(signInButton).toBeVisible();
    await expect(signUpButton).toBeVisible();
  });
});

test.describe("Sidebar User Info (Authenticated)", () => {
  test("Verify user email is displayed in sidebar footer after login", async ({
    page,
  }) => {
    // Skip this test if credentials are not provided
    test.skip(
      !TEST_USER_EMAIL || !TEST_USER_PASSWORD,
      "TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables are required"
    );

    // Navigate to the login page and authenticate
    await page.goto("/login");

    const emailInput = page.getByPlaceholder(/you@example.com/i);
    await emailInput.fill(TEST_USER_EMAIL!);

    const passwordInput = page.getByPlaceholder(/enter your password/i);
    await passwordInput.fill(TEST_USER_PASSWORD!);

    const signInModeButton = page.getByRole("button", { name: /sign in/i }).first();
    await signInModeButton.click();

    const submitButton = page.getByRole("button", { name: /sign in/i });
    await submitButton.click();

    await page.waitForURL(/\/(projects|dashboard)/, { timeout: 30000 });

    // Verify the user's email is displayed in the sidebar
    const userEmail = page.getByText(TEST_USER_EMAIL!, { exact: false });
    await expect(userEmail).toBeVisible();

    // Verify the "Signed in as" label is visible
    const signedInLabel = page.getByText(/signed in as/i);
    await expect(signedInLabel).toBeVisible();
  });

  test("Verify sign-out button is present in sidebar footer after login", async ({
    page,
  }) => {
    // Skip this test if credentials are not provided
    test.skip(
      !TEST_USER_EMAIL || !TEST_USER_PASSWORD,
      "TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables are required"
    );

    // Navigate to the login page and authenticate
    await page.goto("/login");

    const emailInput = page.getByPlaceholder(/you@example.com/i);
    await emailInput.fill(TEST_USER_EMAIL!);

    const passwordInput = page.getByPlaceholder(/enter your password/i);
    await passwordInput.fill(TEST_USER_PASSWORD!);

    const signInModeButton = page.getByRole("button", { name: /sign in/i }).first();
    await signInModeButton.click();

    const submitButton = page.getByRole("button", { name: /sign in/i });
    await submitButton.click();

    await page.waitForURL(/\/(projects|dashboard)/, { timeout: 30000 });

    // Verify the sign-out button is visible
    const signOutButton = page.getByRole("button", { name: /sign out|log out/i });
    await expect(signOutButton).toBeVisible();
  });
});
