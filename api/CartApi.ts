import { APIRequestContext } from '@playwright/test';

import { generateCartId } from '@/data/constants';
import { ViewCartResponse, ApiResponse } from '@/data/data-interfaces';

import { BaseApi } from './BaseApi';

export class CartApi extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async addToCart(
    authToken: string,
    productId: number,
    cartItemId = generateCartId()
  ): Promise<ApiResponse<string>> {
    return this.post<string>('/addtocart', {
      id:      cartItemId,
      cookie:  authToken,
      flag:    true,
      prod_id: productId,
    });
  }

  async addToCartAndGetId(
    authToken: string,
    productId: number
  ): Promise<{ cartItemId: string; response: ApiResponse<string> }> {
    const cartItemId = generateCartId();
    const response   = await this.addToCart(authToken, productId, cartItemId);
    return { cartItemId, response };
  }

  async viewCart(authToken: string): Promise<ApiResponse<ViewCartResponse>> {
    return this.post<ViewCartResponse>('/viewcart', { cookie: authToken, flag: true });
  }

  async deleteCartItem(cartItemId: string): Promise<ApiResponse<string>> {
    return this.post<string>('/deleteitem', { id: cartItemId });
  }
}
