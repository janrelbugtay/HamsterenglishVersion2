const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  await page.goto('http://localhost:3000/bubble-sentence.html');
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // start game from lobby
  await page.evaluate(() => {
    Game.openLobby('animals');
    setTimeout(() => {
        Game.startGameFromLobby();
    }, 500);
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000));

  // try to click settings
  await page.evaluate(() => {
    Game.pauseGame();
  });

  await new Promise(resolve => setTimeout(resolve, 500));

  // toggle twisted mode inside game
  await page.evaluate(() => {
    const el = document.getElementById('setting-twisted-pause');
    el.checked = !el.checked;
    el.dispatchEvent(new Event('change'));
  });

  await new Promise(resolve => setTimeout(resolve, 500));
  
  await browser.close();
})();
