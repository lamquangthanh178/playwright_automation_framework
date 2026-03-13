export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

export interface CheckoutData {
  name: string;
  country: string;
  city: string;
  creditcard: string;
  month: string;
  year: string;
}

export interface CartItem {
  id: string;
  prod_id: number;
  name: string;
  price: number;
  img: string;
}

export interface ViewCartResponse {
  Items: CartItem[] | null;
}

export interface ApiResponse<T = unknown> {
  status: number;
  body: T;
  headers: Record<string, string>;
}
