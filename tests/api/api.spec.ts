import { test, expect } from '@playwright/test';

import { AuthApi } from '@/api/AuthApi';
import { CartApi } from '@/api/CartApi';
import { OrderApi } from '@/api/OrderApi';
import { ACCOUNTS, PRODUCTS, buildCheckoutData } from '@/data/constants';

const ACCOUNT = ACCOUNTS.LOGIN;

test.describe('API – Demoblaze', () => {
  test.describe.configure({ mode: 'parallel' });

  let authApi: AuthApi;
  let cartApi: CartApi;
  let orderApi: OrderApi;
  let authToken: string;

  test.beforeEach(async ({ request }) => {
    authApi   = new AuthApi(request);
    cartApi   = new CartApi(request);
    orderApi  = new OrderApi(request);
    authToken = await authApi.login(ACCOUNT.username, ACCOUNT.password);
  });

  test('TC01 – Login returns a valid auth token', async () => {
    expect(typeof authToken).toBe('string');
    expect(authToken.length).toBeGreaterThan(0);
  });

  test('TC02 – Add product to cart returns 200', async () => {
    const { response, cartItemId } = await cartApi.addToCartAndGetId(authToken, PRODUCTS.SAMSUNG_S6.id);

    expect(response.status).toBe(200);

    // Cleanup
    await cartApi.deleteCartItem(cartItemId);
  });

  test('TC03 – Added product appears in viewcart response', async () => {
    const product = PRODUCTS.NOKIA_LUMIA;
    const { cartItemId } = await cartApi.addToCartAndGetId(authToken, product.id);

    try {
      const viewResponse = await cartApi.viewCart(authToken);

      expect(viewResponse.status).toBe(200);
      const items = viewResponse.body.Items ?? [];
      expect(items.some((item) => item.prod_id === product.id)).toBeTruthy();
    } finally {
      await cartApi.deleteCartItem(cartItemId);
    }
  });

  test('TC04 – Delete cart item returns 200', async () => {
    const { cartItemId } = await cartApi.addToCartAndGetId(authToken, PRODUCTS.SAMSUNG_S6.id);

    const deleteResponse = await cartApi.deleteCartItem(cartItemId);

    expect(deleteResponse.status).toBe(200);
  });

  test('TC05 – Create order returns 200', async () => {
    await cartApi.addToCartAndGetId(authToken, PRODUCTS.DELL_I7.id);

    const orderResponse = await orderApi.checkout(authToken, buildCheckoutData());

    expect(orderResponse.status).toBe(200);
    expect(orderResponse.body).not.toBeNull();
  });
});
