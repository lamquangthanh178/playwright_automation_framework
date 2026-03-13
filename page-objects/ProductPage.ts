import { Page, Locator, expect } from '@playwright/test';

import { NavigationComponent } from './components/NavigationComponent';

export class ProductPage {
  readonly navigationComponent: NavigationComponent;
  readonly lbl_ProductName: Locator;
  readonly lbl_ProductPrice: Locator;
  readonly btn_AddToCart: Locator;

  constructor(page: Page) {
    this.navigationComponent = new NavigationComponent(page);
    this.lbl_ProductName  = page.locator('.name');
    this.lbl_ProductPrice = page.locator('.price-container');
    this.btn_AddToCart    = page.locator('xpath=//a[contains(@onclick,"addToCart")]');
  }

  async addToCart(page: Page): Promise<void> {
    const dialogPromise = page.waitForEvent('dialog');
    await Promise.all([
      page.waitForResponse((r) => r.url().includes('addtocart') && r.status() < 400),
      this.btn_AddToCart.click(),
    ]);
    const dialog = await dialogPromise;
    expect(dialog.message()).toContain('Product added');
    await dialog.accept();
  }

  async getProductName(): Promise<string> {
    await this.lbl_ProductName.waitFor({ state: 'visible' });
    return (await this.lbl_ProductName.textContent()) ?? '';
  }
}
