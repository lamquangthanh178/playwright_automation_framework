import { test, expect } from '@playwright/test';

import { ACCOUNTS, PRODUCTS, BASE_URL, buildCheckoutData } from '@/data/constants';
import { getAuthToken, addProductToCart, clearCart } from '@/helpers/ApiHelpers';
import { POManager } from '@/page-objects/POManager';

const ACCOUNT = ACCOUNTS.PURCHASE;

test.describe('Scenario 4 – Complete Purchase Flow', () => {
  test.describe.configure({ mode: 'parallel' });

  let poManager: POManager;

  test.beforeEach(async ({ page, request }) => {
    poManager = new POManager(page);

    // Ensure a clean cart before each test
    const authToken = await getAuthToken(request, ACCOUNT);
    await clearCart(request, authToken);

    await page.goto(BASE_URL);
    await page.waitForLoadState('load');
    await poManager.getLoginPage().login(ACCOUNT.username, ACCOUNT.password);
  });

  test('TC01 – Order confirmation is displayed after successful checkout', async ({ page, request }) => {
    const cartPage      = poManager.getCartPage();
    const checkoutModal = poManager.getCheckoutModal();
    const product       = PRODUCTS.SAMSUNG_S6;

    // Step 1: Seed exactly one product via API
    const authToken = await getAuthToken(request, ACCOUNT);
    await addProductToCart(request, authToken, product.id);

    // Step 2: Open cart and verify product is listed
    await page.goto(`${BASE_URL}/cart.html`);
    await cartPage.waitForCartToLoad(page);
    const cartItems = await cartPage.getCartItemNames();
    expect(cartItems.some((n: string) => n.includes(product.name))).toBeTruthy();

    // Step 3: Open place order modal and fill checkout form
    await cartPage.openPlaceOrderModal();
    await checkoutModal.fillCheckoutForm(buildCheckoutData());

    // Step 4: Submit order and verify confirmation
    await checkoutModal.submitPurchase(page);
    await expect(checkoutModal.lbl_ConfirmTitle).toContainText('Thank you');
    const message = await checkoutModal.getConfirmationMessage();
    expect(message).toBeTruthy();

    await checkoutModal.dismissConfirmation();
  });

  test('TC02 – Confirmation message contains order details', async ({ page, request }) => {
    const cartPage      = poManager.getCartPage();
    const checkoutModal = poManager.getCheckoutModal();
    const product       = PRODUCTS.DELL_I7;

    // Step 1: Seed exactly one product via API
    const authToken = await getAuthToken(request, ACCOUNT);
    await addProductToCart(request, authToken, product.id);

    // Step 2: Navigate to cart
    await page.goto(`${BASE_URL}/cart.html`);
    await cartPage.waitForCartToLoad(page);

    // Step 3: Open place order modal and complete purchase
    await cartPage.openPlaceOrderModal();
    await checkoutModal.fillCheckoutForm(buildCheckoutData({ name: 'QA Buyer' }));
    await checkoutModal.submitPurchase(page);

    // Step 4: Verify confirmation body contains order info
    const message = await checkoutModal.getConfirmationMessage();
    expect(message.toLowerCase()).toMatch(/amount|card|id/i);

    await checkoutModal.dismissConfirmation();
  });

  test('TC03 – Cart is empty after a successful purchase', async ({ page, request }) => {
    const cartPage      = poManager.getCartPage();
    const checkoutModal = poManager.getCheckoutModal();
    const product       = PRODUCTS.SONY_VAIO;

    // Step 1: Seed exactly one product via API
    const authToken = await getAuthToken(request, ACCOUNT);
    await addProductToCart(request, authToken, product.id);

    // Step 2: Navigate to cart and complete purchase
    await page.goto(`${BASE_URL}/cart.html`);
    await cartPage.waitForCartToLoad(page);
    await cartPage.openPlaceOrderModal();
    await checkoutModal.fillCheckoutForm(buildCheckoutData());
    await checkoutModal.submitPurchase(page);
    await checkoutModal.dismissConfirmation();

    // Step 3: Return to cart and verify it is empty
    await page.goto(`${BASE_URL}/cart.html`);
    await cartPage.waitForCartToLoad(page);
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(0);
  });
});
