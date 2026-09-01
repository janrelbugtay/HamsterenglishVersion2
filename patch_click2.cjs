const fs = require('fs');
let code = fs.readFileSync('src/views/GamesLibrary.tsx', 'utf8');

code = code.replace(/onClick=\{\(e\) => \{ e\.stopPropagation\(\); setGameToMove\(game\.id\); \}\}/g, 'onClick={(e) => { e.preventDefault(); e.stopPropagation(); setGameToMove(game.id); }}');
code = code.replace(/onClick=\{\(\) => \{ handleMoveGame\(null\);/g, 'onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMoveGame(null);');
code = code.replace(/onClick=\{\(\) => \{ handleMoveGame\(f\.id\);/g, 'onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMoveGame(f.id);');

fs.writeFileSync('src/views/GamesLibrary.tsx', code);
