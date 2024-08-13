import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto(String(process.env.URL));
  await expect(page).toHaveTitle("E-CSDD pakalpojumi");
  await page.getByRole('button', { name: 'Autorizēties uzziņai' }).click()
  await expect(page).toHaveTitle("E-CSDD pakalpojumi");
  await page.getByLabel('E-pasts').fill((String(process.env.EMAIL)))
  await page.getByLabel('Parole').fill((String(process.env.PASS)))
  await page.getByRole('button', { name: 'Pieslēgties' }).click()
  await expect(page).toHaveTitle("E-CSDD pakalpojumi");
  await page.getByRole('link', { name: '...' }).isVisible()

});

test('logged in as user from .env email && password', async ({ page }) => { //Test 1
  await page.goto(String(process.env.URL));
  // 1
  await page.getByRole('link', { name: '...' }).click()
  await page.getByRole('link', { name: 'Profila labošana' }).click()
  await page.locator('#demail').isVisible()
  // 2 
  await expect(page.locator('#demail')).toHaveValue(String(process.env.EMAIL));
});

export function assertInRange(from: string, to: string, value: string): boolean {
  let _value = toNum(value)
  if (Number(_value) > Number(from)) {
    if (Number(_value) < Number(to)) {
      return true
    }  
  }
  return false
}
export function toNum(numString: string): number {
  let postString = String(numString).split('EUR')
  let matches = String(postString[0].match(/\d+/g))
  return Number(matches)
}

const testData1 = ['CITROEN', 'C3' , 'Benzīns' , 'Manuālā' , '500' , '10000'] as const;

test('search testData1 assert results table and selected link', async ({ page }) => { //Test 1
  const testData = testData1
  await page.goto(String(process.env.URL) + 'tltr');

  await expect(page).toHaveTitle("E-CSDD pakalpojumi");
  await page.getByLabel('Transportlīdzekļa veids:').isVisible()
  await page.locator("#MarkaList").selectOption(testData[0])
  await page.locator('#ModelsList').click()
  await page.locator('#ModelsList').selectOption(testData[1])
  
  await page.getByLabel('Degvielas veids:').selectOption(testData[2])
  await page.locator('#TransmList').selectOption(testData[3])
  await page.locator('#cenano').fill(testData[4])
  await page.locator('#cenalidz').fill(testData[5])
  await page.locator('#findExtend').getByText('Visi').click()
  await page.getByRole('link', { name: 'Meklēt' }).click()
  await expect(page).toHaveTitle("E-CSDD pakalpojumi");
  
  const selToRow = '//table[@id="vehicles-table"]/tbody/tr[@class="tr-data"]['
  const selEndRow = ']/td['
  const selClose = ']'
  
  for(let _i = 1; _i < 6; _i++) { // expect table data to match criteria
    await expect(page.locator(selToRow + _i + selEndRow + '2' + selClose)).toHaveText(testData[0]);
    await expect(page.locator(selToRow + _i + selEndRow + '3' + selClose)).toHaveText(testData[1]);
    await expect(page.locator(selToRow + _i + selEndRow + '5' + selClose)).toHaveText(testData[2]);
    let price = await page.locator((selToRow + _i + selEndRow + '7' + selClose)).textContent()
    expect(assertInRange(testData[4], testData[5], String(price)))
  }
  
  // click on 1st offer
  //   c. Click on the first record in the results table
  await page.locator('td').filter({ hasText: '.svg-accordion-arrow{fill-' }).first().click()
  await expect(page).toHaveTitle("E-CSDD pakalpojumi");
  // await page.getByRole('heading', { name: 'CITROEN C3' })
  // d. Verify that the car info page contains values from step 1:
  // i. Assert that title contains Marka & Model values
  await page.getByRole('heading', { name: testData[0] + ' ' + testData[1] })
  // ii. Assert that the record table contains: Marka, models: Citroen C3
  // await page.getByRole('cell', { name: 'CITROEN C3' }) // not using because it does not assert which cell has the data so i am using xPath
  await expect(page.locator('//tr/td[text()= "Marka, modelis:"]/following-sibling::td')).toHaveText(testData[0] + ' ' + testData[1]);
  // await page.locator('//tr/td[text()= "Marka, modelis:"]/following-sibling::td').textContent()
  
  
  // iii. Assert that papildus informācija contains text ‘benzīns’
  await expect(page.locator('//tr/td[text()= "Papildus informācija:"]/following-sibling::td')).toContainText('benzīns');
  
  // iv. Assert that 'Transmisijas veids' value is displayed in 2 tabs: 'Vispārīgā
  // informācija ' & 'Tehniskie dati '
  await page.getByRole('cell', { name: 'Manuāla' }).isVisible()
  await page.locator('label').filter({ hasText: 'Tehniskie dati' }).click()
  await page.getByRole('cell', { name: 'Manuāla' }).isVisible()
  
  // await expect(page).toHaveTitle("E-CSDD pakalpojz");
});

const testData2 = ['CITROEN', 'C3' , 'Benzīns' , 'Manuālā' , '5' , '6'] as const;
test('search testData2 assert results negative and selected link', async ({ page }) => { //Test 1
  const testData = testData2
  await page.goto(String(process.env.URL) + 'tltr');

  await expect(page).toHaveTitle("E-CSDD pakalpojumi");
  await page.getByLabel('Transportlīdzekļa veids:').isVisible()
  await page.locator("#MarkaList").selectOption(testData[0])
  await page.locator('#ModelsList').click()
  await page.locator('#ModelsList').selectOption(testData[1])
  
  await page.getByLabel('Degvielas veids:').selectOption(testData[2])
  await page.locator('#TransmList').selectOption(testData[3])
  await page.locator('#cenano').fill(testData[4])
  await page.locator('#cenalidz').fill(testData[5])
  await page.locator('#findExtend').getByText('Visi').click()
  await page.getByRole('link', { name: 'Meklēt' }).click()
  await expect(page).toHaveTitle("E-CSDD pakalpojumi");

  await expect(page.locator('//table[@id="vehicles-table"]/tbody/tr[@class="tr-data"]')).toHaveCount(0);

});