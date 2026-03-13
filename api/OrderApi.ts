import { APIRequestContext } from '@playwright/test';

import { CheckoutData, ApiResponse } from '@/data/data-interfaces';

import { BaseApi } from './BaseApi';

export class OrderApi extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  // /deletecart is the checkout endpoint — it processes payment and empties the cart
  async checkout(authToken: string, data: CheckoutData): Promise<ApiResponse<unknown>> {
    return this.post<unknown>('/deletecart', {
      name:       data.name,
      country:    data.country,
      city:       data.city,
      creditcard: data.creditcard,
      month:      data.month,
      year:       data.year,
      cookie:     authToken,
      flag:       true,
    });
  }
}
