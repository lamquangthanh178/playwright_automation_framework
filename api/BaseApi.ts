import { APIRequestContext, APIResponse } from '@playwright/test';

import { API_BASE_URL } from '@/data/constants';
import { ApiResponse } from '@/data/data-interfaces';

export abstract class BaseApi {
  protected readonly request: APIRequestContext;
  protected readonly baseUrl: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseUrl  = API_BASE_URL;
  }

  protected async post<T = unknown>(
    path: string,
    body: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    const response: APIResponse = await this.request.post(`${this.baseUrl}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      data: body,
    });
    return this.parseResponse<T>(response);
  }

  private async parseResponse<T>(response: APIResponse): Promise<ApiResponse<T>> {
    let body: T;
    try {
      body = await response.json() as T;
    } catch {
      body = await response.text() as unknown as T;
    }
    return { status: response.status(), body, headers: response.headers() };
  }
}
