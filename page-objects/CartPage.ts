
import { Page, Locator, expect } from '@playwright/test';

import { NavigationComponent } from './components/NavigationComponent';

export class CartPage {
  readonly navigationComponent: NavigationComponent;
  readonly tbl_CartBody: Locator;
  readonly lst_CartRows: Locator;
  readonly lbl_TotalAmount: Locator;
  readonly btn_PlaceOrder: Locator;
  readonly btn_Delete: Locator;

  constructor(page: Page) {
    this.navigationComponent = new NavigationComponent(page);
    this.tbl_CartBody    = page.locator('#tbodyid');
    this.lst_CartRows    = page.locator('#tbodyid tr.success');
    this.lbl_TotalAmount = page.locator('#totalp');
    this.btn_PlaceOrder  = page.getByRole('button', { name: 'Place Order' });
    this.btn_Delete      = page.getByRole('link', { name: 'Delete' });
  }

  // Wait for the viewcart XHR to complete — rows are rendered after this response.
  // #tbodyid stays hidden when empty so we never assert its visibility here.
  async waitForCartToLoad(page: Page): Promise<void> {
    await page.waitForResponse((r) => r.url().includes('viewcart') && r.status() < 400);
  }

  async verifyProductInCart(productName: string, productPrice: number): Promise<void> {
    const row = this.tbl_CartBody.getByRole('row', { name: `${productName} ${productPrice}` });
    await expect.poll(() => row.count(), { timeout: 10000 }).toBeGreaterThan(0);
  }

  async verifyTotalAmount(expectedTotal: number): Promise<void> {
    await expect(this.lbl_TotalAmount).toHaveText(String(expectedTotal));
  }

  async verifyPlaceOrderButtonIsVisible(): Promise<void> {
    await expect(this.btn_PlaceOrder).toBeVisible();
  }

  async clearCart(page: Page): Promise<void> {
    await this.waitForCartToLoad(page);
    const count = await this.btn_Delete.count();
    for (let i = 0; i < count; i++) {
      await this.btn_Delete.first().click({ timeout: 2000 });
      await page.waitForResponse((r) => r.url().includes('deleteitem') && r.status() < 400);
    }
  }

  async removeItemByName(page: Page, productName: string): Promise<void> {
    const lnk_Delete = page.locator(
      `xpath=//tbody[@id="tbodyid"]//tr[td[normalize-space()="${productName}"]]//a[text()="Delete"]`
    );
    await lnk_Delete.waitFor({ state: 'visible' });
    await Promise.all([
      page.waitForResponse((r) => r.url().includes('deleteitem') && r.status() < 400),
      lnk_Delete.click(),
    ]);
    const row = page.locator(
      `xpath=//tbody[@id="tbodyid"]//tr[td[normalize-space()="${productName}"]]`
    );
    await row.waitFor({ state: 'detached' });
  }

  async getCartItemNames(): Promise<string[]> {
    await this.lst_CartRows.waitFor({ state: 'visible' });
    const count = await this.lst_CartRows.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const cell = this.lst_CartRows.nth(i).locator('td:nth-child(2)');
      names.push(((await cell.textContent()) ?? '').trim());
    }
    return names;
  }

  async getCartItemCount(): Promise<number> {
    return this.lst_CartRows.count();
  }

  async getTotalPrice(): Promise<number> {
    const raw = (await this.lbl_TotalAmount.textContent()) ?? '0';
    return parseFloat(raw.trim()) || 0;
  }

  async openPlaceOrderModal(): Promise<void> {
    await this.btn_PlaceOrder.waitFor({ state: 'visible' });
    await this.btn_PlaceOrder.click();
  }
}
