import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ProfilePage } from '../pages/profile.page';
import { TltrPage } from '../pages/tltr.page';

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAsEnvUser()
});

test('logged in as user from .env email && password', async ({ page }) => { //Test 1
  const profilePage = new ProfilePage(page)
  await profilePage.loggedInAsEnvUser()
});

const testData1 = ['CITROEN', 'C3' , 'Benzīns' , 'Manuālā' , '500' , '10000'] as const;
test('search testData1 - table and 1st link', async ({ page }) => { //Test 2
  const testData = testData1
  const tltrPage = new TltrPage(page)

  await tltrPage.searchWithTestData(testData)
  await tltrPage.assertTableData(testData)
  await tltrPage.click1stOpt()
  await tltrPage.assertResultPage(testData)
});

const testData2 = ['CITROEN', 'C3' , 'Benzīns' , 'Manuālā' , '5' , '6'] as const;
test('search testData2 - negative', async ({ page }) => { //Test 3
  const testData = testData2
  const tltrPage = new TltrPage(page)
  await tltrPage.searchWithTestData(testData)
  await expect(page.locator('//table[@id="vehicles-table"]/tbody/tr[@class="tr-data"]')).toHaveCount(0);
});
