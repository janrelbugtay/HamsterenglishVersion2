const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('requestfailed', request => {
    console.log('Failed request:', request.url(), request.failure().errorText);
  });
  page.on('response', response => {
    if(!response.ok()) {
        console.log('Failed response:', response.url(), response.status());
    }
  });
  
  await page.goto('http://localhost:3000/bubble-sentence.html');
  await new Promise(resolve => setTimeout(resolve, 2000));
  await browser.close();
})();
