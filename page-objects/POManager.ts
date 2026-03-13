import { Page } from '@playwright/test';

import { CartPage } from './CartPage';
import { CheckoutModal } from './CheckoutModal';
import { HomePage } from './HomePage';
import { LoginPage } from './LoginPage';
import { ProductPage } from './ProductPage';

export class POManager {
  private readonly page: Page;

  private readonly _loginPage: LoginPage;
  private readonly _homePage: HomePage;
  private readonly _productPage: ProductPage;
  private readonly _cartPage: CartPage;
  private readonly _checkoutModal: CheckoutModal;

  constructor(page: Page) {
    this.page           = page;
    this._loginPage     = new LoginPage(page);
    this._homePage      = new HomePage(page);
    this._productPage   = new ProductPage(page);
    this._cartPage      = new CartPage(page);
    this._checkoutModal = new CheckoutModal(page);
  }

  getLoginPage(): LoginPage       { return this._loginPage; }
  getHomePage(): HomePage         { return this._homePage; }
  getProductPage(): ProductPage   { return this._productPage; }
  getCartPage(): CartPage         { return this._cartPage; }
  getCheckoutModal(): CheckoutModal { return this._checkoutModal; }
}
