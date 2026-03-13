import { Page, Locator } from '@playwright/test';

import { NavigationComponent } from './components/NavigationComponent';

export class LoginPage {
  readonly navigationComponent: NavigationComponent;
  readonly modal_Login: Locator;
  readonly lbl_ModalTitle: Locator;
  readonly inp_Username: Locator;
  readonly inp_Password: Locator;
  readonly btn_Login: Locator;
  readonly btn_Close: Locator;

  constructor(page: Page) {
    this.navigationComponent = new NavigationComponent(page);
    this.modal_Login    = page.locator('#logInModal');
    this.lbl_ModalTitle = page.locator('xpath=//div[@id="logInModal"]//h5[@class="modal-title"]');
    this.inp_Username   = page.locator('#loginusername');
    this.inp_Password   = page.locator('#loginpassword');
    this.btn_Login      = page.locator('button[onclick="logIn()"]');
    this.btn_Close      = page.locator('#logInModal .btn-secondary');
  }

  async openLoginModal(): Promise<void> {
    await this.navigationComponent.openLoginModal();
    await this.modal_Login.waitFor({ state: 'visible' });
  }

  async login(username: string, password: string): Promise<void> {
    await this.openLoginModal();
    await this.inp_Username.fill(username);
    await this.inp_Password.fill(password);
    await this.btn_Login.click();
    await this.modal_Login.waitFor({ state: 'hidden' });
  }

  async fillCredentialsAndSubmit(username: string, password: string): Promise<void> {
    await this.openLoginModal();
    await this.inp_Username.fill(username);
    await this.inp_Password.fill(password);
    await this.btn_Login.click();
  }
}
