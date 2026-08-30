const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  await page.goto('http://localhost:3000/bubble-sentence.html');
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Click settings
  console.log('Clicking settings...');
  await page.evaluate(() => {
    Game.openSettings();
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await browser.close();
})();
