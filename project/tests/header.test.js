const puppeteer = require('puppeteer');

let browser, page;

beforeEach( async () => {
    browser = await puppeteer.launch({
        headless: false
    }); // launch the browser
    page = await browser.newPage(); // create page object
    await page.goto('localhost:3000'); // go to our project
});

afterEach( async () => {
    await browser.close();
});

test('Header renders correct text', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);

    expect(text).toEqual('Blogster');
});

test('Clicking login starts oauth flow', async () => {
    await page.click('.right a');

    const url = await page.url();

    expect(url).toMatch(/accounts\.google\.com/);

});