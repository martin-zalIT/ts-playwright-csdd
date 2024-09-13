import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly authButton: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitLogin: Locator;
  readonly profileIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.authButton = page.getByRole('button', { name: 'Autorizēties uzziņai' });

    this.emailInput = page.getByLabel('E-pasts');
    this.passwordInput = page.getByLabel('Parole');
    this.submitLogin = page.getByRole('button', { name: 'Pieslēgties' });
    this.profileIcon = page.getByRole('link', { name: '...' })
  }

  async loginAsEnvUser() {
    await this.page.goto(String(process.env.URL));
    await expect(this.page).toHaveTitle("E-CSDD pakalpojumi");
    await this.authButton.click()
    await expect(this.page).toHaveTitle("E-CSDD pakalpojumi");
    await this.emailInput.fill((String(process.env.EMAIL)))
    await this.passwordInput.fill((String(process.env.PASS)))
    await this.submitLogin.click()

    await expect(this.page).toHaveTitle("E-CSDD pakalpojumi");
    await this.profileIcon.isVisible()
  }
}