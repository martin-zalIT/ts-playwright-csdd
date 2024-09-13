import { expect, type Locator, type Page } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  readonly profileIcon: Locator;
  readonly profileEdit: Locator;
  readonly profileEmail: Locator;

  constructor(page: Page) {
    this.page = page;
    this.profileIcon = page.getByRole('link', { name: '...' })
    this.profileEdit = page.getByRole('link', { name: 'Profila labošana' })
    this.profileEmail = page.locator('#demail')
  }

  async visibleProfileIcon() {
    await this.profileIcon.isVisible()
  }
  async loggedInAsEnvUser() {
    await this.page.goto(String(process.env.URL));
    // 1
    await this.profileIcon.click()
    await this.profileEdit.click()
    await this.profileEmail.isVisible()
    // 2 
    await expect(this.profileEmail).toHaveValue(String(process.env.EMAIL));
  }
}