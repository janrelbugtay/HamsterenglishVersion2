const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  await page.goto('http://localhost:3000/bubble-sentence.html');
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // click an island
  await page.evaluate(() => {
    const map = document.getElementById('world-map-container');
    if (map && map.children.length > 1) {
       map.children[1].click(); // click first island
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // click Start Game
  await page.evaluate(() => {
    const btn = document.querySelector('button[onclick="Game.startGameFromLobby()"]');
    if (btn) btn.click();
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000));

  // try clicking settings
  await page.evaluate(() => {
    const btn = document.querySelector('button[onclick="Game.pauseGame()"]');
    if(btn) btn.click();
  });

  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await browser.close();
})();
