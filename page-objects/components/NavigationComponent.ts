import { Page, Locator } from '@playwright/test';

export class NavigationComponent {
  readonly lnk_NavBrand: Locator;
  readonly lnk_Cart: Locator;
  readonly lnk_Login: Locator;
  readonly lnk_Logout: Locator;
  readonly lnk_SignUp: Locator;
  readonly lbl_Username: Locator;

  constructor(page: Page) {
    this.lnk_NavBrand  = page.locator('a.navbar-brand');
    this.lnk_Cart      = page.locator('#cartur');
    this.lnk_Login     = page.locator('#login2');
    this.lnk_Logout    = page.locator('#logout2');
    this.lnk_SignUp    = page.locator('xpath=//a[@id="signin2"]');
    this.lbl_Username  = page.locator('#nameofuser');
  }

  async goToHome(): Promise<void> {
    await this.lnk_NavBrand.click();
  }

  async goToCart(): Promise<void> {
    await this.lnk_Cart.click();
  }

  async openLoginModal(): Promise<void> {
    await this.lnk_Login.click();
  }

  async logout(): Promise<void> {
    await this.lnk_Logout.waitFor({ state: 'visible' });
    await this.lnk_Logout.click();
  }
}
