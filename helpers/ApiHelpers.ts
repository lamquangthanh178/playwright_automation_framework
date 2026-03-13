import { APIRequestContext } from '@playwright/test';

import { API_BASE_URL, encodePassword, generateCartId } from '@/data/constants';
import { ViewCartResponse } from '@/data/data-interfaces';

async function post<T = unknown>(
  request: APIRequestContext,
  path: string,
  body: Record<string, unknown>
): Promise<{ status: number; body: T }> {
  const response = await request.post(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
  let responseBody: T;
  try {
    responseBody = await response.json() as T;
  } catch {
    responseBody = await response.text() as unknown as T;
  }
  return { status: response.status(), body: responseBody };
}

export async function getAuthToken(
  request: APIRequestContext,
  credentials: { username: string; password: string }
): Promise<string> {
  const { body } = await post<string>(request, '/login', {
    username: credentials.username,
    password: encodePassword(credentials.password),
  });
  const raw = String(body ?? '');
  if (!raw || raw.includes('Wrong')) {
    throw new Error(`[ApiHelpers] Login failed for "${credentials.username}": "${raw}"`);
  }
  return raw.replace('Auth_token: ', '').trim();
}

export async function addProductToCart(
  request: APIRequestContext,
  authToken: string,
  productId: number
): Promise<string> {
  const cartItemId = generateCartId();
  await post(request, '/addtocart', {
    id:      cartItemId,
    cookie:  authToken,
    flag:    true,
    prod_id: productId,
  });
  return cartItemId;
}

export async function deleteCartItem(
  request: APIRequestContext,
  cartItemId: string
): Promise<void> {
  await post(request, '/deleteitem', { id: cartItemId });
}

export async function viewCart(
  request: APIRequestContext,
  authToken: string
): Promise<ViewCartResponse> {
  const { body } = await post<ViewCartResponse>(request, '/viewcart', {
    cookie: authToken,
    flag:   true,
  });
  return body;
}

export async function clearCart(
  request: APIRequestContext,
  authToken: string
): Promise<void> {
  const cart = await viewCart(request, authToken);
  const items = cart?.Items ?? [];
  await Promise.all(items.map((item) => deleteCartItem(request, item.id)));
}
