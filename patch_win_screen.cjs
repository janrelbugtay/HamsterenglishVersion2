const fs = require('fs');

let html = fs.readFileSync('public/bubble-sentence.html', 'utf8');

// The Play Again button seems to go to "Next Level" which opens category select.
// Let's change it to Play Again and make it reload the current level instead.
html = html.replace(
    /<button onclick="Game\.showCategorySelect\(\)" class="btn-premium blue px-8 py-4 text-xl">Next Level<\/button>/,
    '<button onclick="Game.start(Game.selectedCatId)" class="btn-premium blue px-8 py-4 text-xl">Play Again</button>'
);

// We should also hide the map button if we are in iframe mode, or let it go to map.
// If the user wants "end play again", we can give it to them.
html = html.replace(
    /<button onclick="Game\.showScreen\('screen-menu'\)" class="btn-premium px-8 py-4 text-xl text-gray-700">Map<\/button>/,
    '<button onclick="if(window.self !== window.top) { window.parent.postMessage({type: \'QUIT_GAME\'}, \'*\'); } else { Game.showScreen(\'screen-menu\') }" class="btn-premium px-8 py-4 text-xl text-gray-700">Exit Game</button>'
);

fs.writeFileSync('public/bubble-sentence.html', html);
console.log("Patched Bubble Island win screen buttons");
