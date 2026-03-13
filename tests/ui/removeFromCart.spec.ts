import { test, expect } from '@playwright/test';

import { ACCOUNTS, PRODUCTS, BASE_URL } from '@/data/constants';
import { getAuthToken, clearCart } from '@/helpers/ApiHelpers';
import { POManager } from '@/page-objects/POManager';

const ACCOUNT = ACCOUNTS.REMOVE_CART;

test.describe('Scenario 3 – Remove Product from Cart', () => {
  let poManager: POManager;
  const PRODUCT  = PRODUCTS.SONY_VAIO;

  test.beforeEach(async ({ page, request }) => {
    poManager = new POManager(page);

    // Ensure a clean cart before each test
    const authToken = await getAuthToken(request, ACCOUNT);
    await clearCart(request, authToken);

    await page.goto(BASE_URL);
    await page.waitForLoadState('load');
    await poManager.getLoginPage().login(ACCOUNT.username, ACCOUNT.password);
  });

  test('TC01 – Cart is empty after removing the only item', async ({ page }) => {
    const cartPage = poManager.getCartPage();
    const homePage    = poManager.getHomePage();
    const productPage = poManager.getProductPage();
    const product  = PRODUCTS.SONY_VAIO;

    // Step 1: Navigate to product and add to cart
    await homePage.clickProductByName(page, PRODUCT.name);
    await productPage.addToCart(page);

    // Step 2: Open cart and confirm the product is listed
    await page.goto(`${BASE_URL}/cart.html`);
    // Wait for the cart table to be visible before checking items
    await page.waitForSelector('table', { state: 'visible' });
    const cartItemsBefore = await cartPage.getCartItemNames();
    expect(cartItemsBefore).toContain(product.name);

    // Step 3: Remove the product via UI
    await cartPage.removeItemByName(page, product.name);

    // Step 4: Verify cart is now empty
    const itemCountAfter = await cartPage.getCartItemCount();
    expect(itemCountAfter).toBe(0);
  });
});
