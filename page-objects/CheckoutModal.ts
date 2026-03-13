import { Page, Locator } from '@playwright/test';

import { CheckoutData } from '../data/data-interfaces';

export class CheckoutModal {
  readonly modal_Order: Locator;
  readonly inp_Name: Locator;
  readonly inp_Country: Locator;
  readonly inp_City: Locator;
  readonly inp_CreditCard: Locator;
  readonly inp_Month: Locator;
  readonly inp_Year: Locator;
  readonly btn_Purchase: Locator;
  readonly modal_Confirmation: Locator;
  readonly lbl_ConfirmTitle: Locator;
  readonly lbl_ConfirmBody: Locator;
  readonly btn_ConfirmOk: Locator;

  constructor(page: Page) {
    this.modal_Order        = page.locator('#orderModal');
    this.inp_Name           = page.locator('#name');
    this.inp_Country        = page.locator('#country');
    this.inp_City           = page.locator('#city');
    this.inp_CreditCard     = page.locator('#card');
    this.inp_Month          = page.locator('#month');
    this.inp_Year           = page.locator('#year');
    this.btn_Purchase       = page.locator('button[onclick="purchaseOrder()"]');
    this.modal_Confirmation = page.locator('.sweet-alert');
    this.lbl_ConfirmTitle   = page.locator('.sweet-alert h2');
    this.lbl_ConfirmBody    = page.locator('.sweet-alert p.lead');
    this.btn_ConfirmOk      = page.locator('.sweet-alert button.confirm');
  }

  async waitForModal(): Promise<void> {
    await this.modal_Order.waitFor({ state: 'visible' });
  }

  async fillCheckoutForm(data: CheckoutData): Promise<void> {
    await this.modal_Order.waitFor({ state: 'visible' });
    await this.inp_Name.fill(data.name);
    await this.inp_Country.fill(data.country);
    await this.inp_City.fill(data.city);
    await this.inp_CreditCard.fill(data.creditcard);
    await this.inp_Month.fill(data.month);
    await this.inp_Year.fill(data.year);
  }

  async submitPurchase(page: Page): Promise<void> {
    // The purchase endpoint is /deletecart — it processes payment and clears the cart
    await Promise.all([
      page.waitForResponse((r) => r.url().includes('deletecart') && r.status() < 400),
      this.btn_Purchase.click(),
    ]);
    await this.modal_Confirmation.waitFor({ state: 'visible' });
  }

  async getConfirmationMessage(): Promise<string> {
    return (await this.lbl_ConfirmBody.textContent()) ?? '';
  }

  async dismissConfirmation(): Promise<void> {
    await this.btn_ConfirmOk.click();
  }
}
