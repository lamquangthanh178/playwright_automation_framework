import { Page, Locator } from '@playwright/test';

import { NavigationComponent } from './components/NavigationComponent';

export class HomePage {
  readonly navigationComponent: NavigationComponent;
  readonly lst_ProductCards: Locator;
  readonly lnk_CategoryPhone: Locator;
  readonly lnk_CategoryLaptop: Locator;
  readonly lnk_CategoryMonitor: Locator;

  constructor(page: Page) {
    this.navigationComponent  = new NavigationComponent(page);
    this.lst_ProductCards     = page.locator('.card');
    this.lnk_CategoryPhone    = page.locator('#itemc[onclick*="phone"]');
    this.lnk_CategoryLaptop   = page.locator('#itemc[onclick*="notebook"]');
    this.lnk_CategoryMonitor  = page.locator('#itemc[onclick*="monitor"]');
  }

  async waitForProductsToLoad(page: Page): Promise<void> {
    await page.waitForLoadState('load');
    await this.lst_ProductCards.first().waitFor({ state: 'visible' });
  }

  async clickProductByName(page: Page, name: string): Promise<void> {
    const lnk_Product = page.locator(
      `xpath=//div[@id="tbodyid"]//h4[contains(@class,"card-title")]/a[normalize-space()="${name}"]`
    );
    await lnk_Product.waitFor({ state: 'visible' });
    await lnk_Product.click();
    await page.waitForLoadState('load');
  }

  async injectAuthToken(page: Page, token: string, username: string): Promise<void> {
    await page.evaluate(
      ({ t, u }) => { localStorage.setItem('user', u); localStorage.setItem('token', t); },
      { t: token, u: username }
    );
    await page.reload({ waitUntil: 'load' });
  }
}
