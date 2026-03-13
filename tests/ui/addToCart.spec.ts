import { test } from '@playwright/test';

import { ACCOUNTS, PRODUCTS, BASE_URL } from '@/data/constants';
import { clearCart, getAuthToken } from '@/helpers/ApiHelpers';
import { POManager } from '@/page-objects/POManager';

const ACCOUNT  = ACCOUNTS.ADD_CART;
const PRODUCT  = PRODUCTS.SAMSUNG_S6;

test.describe('Scenario 2 – Add Product to Cart', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page, request }) => {
    poManager = new POManager(page);
    await page.goto(BASE_URL);
    await page.waitForLoadState('load');
    await poManager.getLoginPage().login(ACCOUNT.username, ACCOUNT.password);

    // Ensure a clean cart before each test
    const authToken = await getAuthToken(request, ACCOUNT);
    await clearCart(request, authToken);
  });

  test('TC01 – Cart displays correct product, price, total and Place Order button', async ({ page }) => {
    const homePage    = poManager.getHomePage();
    const productPage = poManager.getProductPage();
    const cartPage    = poManager.getCartPage();

    // Step 1: Navigate to product and add to cart
    await homePage.clickProductByName(page, PRODUCT.name);
    await productPage.addToCart(page);

    // Step 2: Go to cart
    await homePage.navigationComponent.goToCart();
    await cartPage.waitForCartToLoad(page);

    // Step 3: Verify product name, price, total and Place Order button
    await cartPage.verifyProductInCart(PRODUCT.name, PRODUCT.price);
    await cartPage.verifyTotalAmount(PRODUCT.price);
    await cartPage.verifyPlaceOrderButtonIsVisible();
  });
});
