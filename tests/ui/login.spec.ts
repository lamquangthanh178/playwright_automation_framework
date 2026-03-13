import { test, expect } from '@playwright/test';

import { ACCOUNTS, BASE_URL } from '@/data/constants';
import { POManager } from '@/page-objects/POManager';

const ACCOUNT = ACCOUNTS.LOGIN;

test.describe('Scenario 1 – Login Successfully', () => {
  test.describe.configure({ mode: 'parallel' });

  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState('load');
  });

  test('TC01 – Valid credentials show username in navbar', async ({ page: _page }) => {
    const loginPage = poManager.getLoginPage();

    // Step 1: Login with valid credentials
    await loginPage.login(ACCOUNT.username, ACCOUNT.password);

    // Step 2: Verify username label and logout link are visible
    await expect(loginPage.navigationComponent.lbl_Username).toBeVisible();
    await expect(loginPage.navigationComponent.lbl_Username).toContainText(ACCOUNT.username);
    await expect(loginPage.navigationComponent.lnk_Logout).toBeVisible();
  });

  test('TC02 – Login modal opens with correct title', async ({ page: _page }) => {
    const loginPage = poManager.getLoginPage();

    // Step 1: Open login modal
    await loginPage.openLoginModal();

    // Step 2: Verify modal is visible with correct heading
    await expect(loginPage.modal_Login).toBeVisible();
    await expect(loginPage.lbl_ModalTitle).toContainText('Log in');
  });

  test('TC03 – Wrong password shows error alert and user stays logged out', async ({ page }) => {
    const loginPage = poManager.getLoginPage();

    // Step 1: Submit with wrong password and capture alert
    const dialogPromise = page.waitForEvent('dialog');
    await loginPage.fillCredentialsAndSubmit(ACCOUNT.username, 'WRONG_PASSWORD');
    const dialog = await dialogPromise;

    // Step 2: Verify error alert appears
    expect(dialog.message()).toBeTruthy();
    await dialog.accept();

    // Step 3: Verify user is not logged in
    await expect(loginPage.navigationComponent.lbl_Username).not.toBeVisible();
  });
});
