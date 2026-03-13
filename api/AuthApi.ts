import { APIRequestContext } from '@playwright/test';

import { encodePassword } from '@/data/constants';
import { ApiResponse } from '@/data/data-interfaces';

import { BaseApi } from './BaseApi';

export class AuthApi extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async login(username: string, password: string): Promise<string> {
    const response = await this.post<string>('/login', {
      username,
      password: encodePassword(password),
    });
    const raw = String(response.body ?? '');
    if (response.status !== 200 || !raw || raw.includes('Wrong')) {
      throw new Error(`[AuthApi] Login failed for "${username}": "${raw}"`);
    }
    return raw.replace('Auth_token: ', '').trim();
  }

  async loginRaw(username: string, password: string): Promise<ApiResponse<string>> {
    return this.post<string>('/login', { username, password: encodePassword(password) });
  }
}

