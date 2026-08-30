const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  await page.goto('http://localhost:3000/bubble-sentence.html');
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // start game
  await page.evaluate(() => {
    const map = document.getElementById('world-map-container');
    if (map && map.children.length > 1) {
       map.children[1].click(); 
    }
  });
  await new Promise(resolve => setTimeout(resolve, 500));
  await page.evaluate(() => {
    const btn = document.querySelector('button[onclick="Game.startGameFromLobby()"]');
    if (btn) btn.click();
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // click the first bubble
  await page.evaluate(() => {
    const bubbles = document.querySelectorAll('.bubble-word');
    if (bubbles.length > 0) {
        bubbles[0].dispatchEvent(new MouseEvent('pointerdown', {clientX: 100, clientY: 100}));
    }
  });

  await new Promise(resolve => setTimeout(resolve, 100));

  await page.evaluate(() => {
    window.dispatchEvent(new MouseEvent('pointermove', {clientX: 200, clientY: 200}));
  });

  await new Promise(resolve => setTimeout(resolve, 100));

  await page.evaluate(() => {
    window.dispatchEvent(new MouseEvent('pointerup', {clientX: 200, clientY: 200}));
  });

  await new Promise(resolve => setTimeout(resolve, 500));
  
  await browser.close();
})();
