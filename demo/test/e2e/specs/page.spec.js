const puppeteer = require('puppeteer-core')
const { expect } = require('chai')
const chromePaths = require('chrome-paths')

const CHROME_PATH = chromePaths.chrome

describe('pages', function() {
  let browser
  let page

  this.timeout('30s')

  before(async () => {
    browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
      headless: false,
      slowMo: 100,
      defaultViewport: {
        width: 1200,
        height: 500,
      },
      executablePath: CHROME_PATH,
    })

    page = await browser.newPage()
    await page.goto('http://localhost:8081')
  })

  after(async () => {
    await browser.close()
  })

  it('page title', async () => {
    await page.waitForSelector('h1')
    await page.click('a[href="/pageA"]')
    await page.waitForFunction(() => location.pathname === '/pageA')
    await page.click('a[href="/pageB"]')
    await page.waitForFunction(() => location.pathname === '/pageB')
    const pathname = await page.evaluate(() => location.pathname)

    expect(pathname).to.equal('/pageB')
  })
})