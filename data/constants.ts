import { v4 as uuidv4 } from 'uuid';

import { Product, CheckoutData } from './data-interfaces';

export const BASE_URL = process.env.BASE_URL ?? 'https://www.demoblaze.com';
export const API_BASE_URL = process.env.API_BASE_URL ?? 'https://api.demoblaze.com';

export const ACCOUNTS = {
  LOGIN: {
    username: process.env.ACCOUNT_LOGIN_USER ?? 'auto_login_user',
    password: process.env.ACCOUNT_LOGIN_PASS ?? 'Test@1234',
  },
  ADD_CART: {
    username: process.env.ACCOUNT_ADD_CART_USER ?? 'auto_addcart_user',
    password: process.env.ACCOUNT_ADD_CART_PASS ?? 'Test@1234',
  },
  REMOVE_CART: {
    username: process.env.ACCOUNT_REMOVE_CART_USER ?? 'auto_removecart_user',
    password: process.env.ACCOUNT_REMOVE_CART_PASS ?? 'Test@1234',
  },
  PURCHASE: {
    username: process.env.ACCOUNT_PURCHASE_USER ?? 'auto_purchase_user',
    password: process.env.ACCOUNT_PURCHASE_PASS ?? 'Test@1234',
  },
};

export const PRODUCTS: Record<string, Product> = {
  SAMSUNG_S6:    { id: 1,  name: 'Samsung galaxy s6',       category: 'phone',   price: 360 },
  NOKIA_LUMIA:   { id: 2,  name: 'Nokia lumia 1520',        category: 'phone',   price: 820 },
  NEXUS_6:       { id: 3,  name: 'Nexus 6',                 category: 'phone',   price: 650 },
  IPHONE_6:      { id: 8,  name: 'Iphone 6 32gb',           category: 'phone',   price: 790 },
  SONY_VAIO:     { id: 9,  name: 'Sony vaio i5',            category: 'laptop',  price: 790 },
  DELL_I7:       { id: 10, name: 'Dell i7 8gb',             category: 'laptop',  price: 790 },
  APPLE_MONITOR: { id: 12, name: '2560x1440 Apple Display', category: 'monitor', price: 400 },
};

export const DEFAULT_CHECKOUT: CheckoutData = {
  name:       'Automation Tester',
  country:    'Vietnam',
  city:       'Ho Chi Minh',
  creditcard: '4111111111111111',
  month:      '12',
  year:       '2027',
};

export function buildCheckoutData(overrides: Partial<CheckoutData> = {}): CheckoutData {
  return { ...DEFAULT_CHECKOUT, ...overrides };
}

export function encodePassword(plain: string): string {
  return Buffer.from(plain).toString('base64');
}

export function generateCartId(): string {
  return uuidv4();
}
