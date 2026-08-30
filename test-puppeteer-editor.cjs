const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  await page.goto('http://localhost:3000/bubble-sentence.html');
  await new Promise(resolve => setTimeout(resolve, 500));
  await page.evaluate(() => {
    Game.showScreen('screen-editor');
  });
  await new Promise(resolve => setTimeout(resolve, 500));
  
  await browser.close();
})();
