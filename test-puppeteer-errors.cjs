const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.log('ERROR:', err.toString()));
  page.on('requestfailed', request => console.log('REQ FAIL:', request.url(), request.failure().errorText));

  await page.goto('http://localhost:3000/');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // try clicking things in react
  await page.evaluate(() => {
     // Is there an error on screen?
     const root = document.getElementById('root');
     console.log("Root HTML snippet:", root.innerHTML.substring(0, 500));
  });

  await new Promise(resolve => setTimeout(resolve, 2000));
  await browser.close();
})();
