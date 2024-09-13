import { expect, type Locator, type Page } from '@playwright/test';
import {assertInRange} from '../helper';


export class TltrPage {
  readonly page: Page;

  readonly vehicleTypeField: Locator;
  readonly vehicleBrandField: Locator;
  readonly vehicleModelField: Locator;
  readonly vehicleFuelField: Locator;
  readonly vehicleTransmissionField: Locator;
  readonly priceFromField: Locator;
  readonly priceToField: Locator;
  readonly findExtendAll: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.vehicleTypeField = page.getByLabel('Transportlīdzekļa veids:')
    this.vehicleBrandField = page.locator("#MarkaList")
    this.vehicleModelField = page.locator('#ModelsList')
    this.vehicleFuelField = page.getByLabel('Degvielas veids:')
    this.vehicleTransmissionField = page.locator('#TransmList')
    this.priceFromField = page.locator('#cenano')
    this.priceToField = page.locator('#cenalidz')
    this.findExtendAll = page.locator('#findExtend').getByText('Visi')
    this.searchButton = page.getByRole('link', { name: 'Meklēt' })
  }
  async searchWithTestData(testData) {
    await this.page.goto(String(process.env.URL) + 'tltr');

    await expect(this.page).toHaveTitle("E-CSDD pakalpojumi");
    await this.vehicleTypeField.isVisible()
    await this.vehicleBrandField.selectOption(testData[0])
    await this.vehicleModelField.click()
    await this.vehicleModelField.selectOption(testData[1])
  
    await this.vehicleFuelField.selectOption(testData[2])
    await this.vehicleTransmissionField.selectOption(testData[3])
    await this.priceFromField.fill(testData[4])
    await this.priceToField.fill(testData[5])
    await this.findExtendAll.click()
    await this.searchButton.click()
    await expect(this.page).toHaveTitle("E-CSDD pakalpojumi");
  }
  async assertTableData(testData) {
    const selToRow = '//table[@id="vehicles-table"]/tbody/tr[@class="tr-data"]['
    const selEndRow = ']/td['
    const selClose = ']'
    let tableLen = await this.page.locator('//table[@id="vehicles-table"]/tbody/tr[@class="tr-data"]').count()
    
    for(let _i = 1; _i < Number(tableLen); _i++) { // expect table data to match criteria
      await expect(this.page.locator(selToRow + _i + selEndRow + '2' + selClose)).toHaveText(testData[0]);
      await expect(this.page.locator(selToRow + _i + selEndRow + '3' + selClose)).toHaveText(testData[1]);
      await expect(this.page.locator(selToRow + _i + selEndRow + '5' + selClose)).toHaveText(testData[2]);
      let price = await this.page.locator((selToRow + _i + selEndRow + '7' + selClose)).textContent()
      expect(assertInRange(testData[4], testData[5], String(price)))
    }
  }
  async click1stOpt() {
    await this.page.locator('td').filter({ hasText: '.svg-accordion-arrow{fill-' }).first().click()
    await expect(this.page).toHaveTitle("E-CSDD pakalpojumi");
  }
  async assertResultPage(testData) {
    await this.page.getByRole('heading', { name: testData[0] + ' ' + testData[1] })
    // await page.getByRole('cell', { name: 'CITROEN C3' }) // not using because it does not assert which cell has the data so i am using xPath
    await this.page.locator('//tr/td[text()= "Marka, modelis:"]/following-sibling::td[text()="' + testData[0] + ' ' + testData[1] + '"]').isVisible()
  
  
    // iii. Assert that papildus informācija contains text ‘benzīns’
    await this.page.locator('//tr/td[text()= "Papildus informācija:"]/following-sibling::td[contains(text(), "benzīns")]').isVisible()
  
    // iv. Assert that 'Transmisijas veids' value is displayed in 2 tabs: 'Vispārīgā
    // informācija ' & 'Tehniskie dati '
    await this.page.getByRole('cell', { name: 'Manuāla' }).isVisible()
    await this.page.locator('label').filter({ hasText: 'Tehniskie dati' }).click()
    await this.page.getByRole('cell', { name: 'Manuāla' }).isVisible()
  }
}