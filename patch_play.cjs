const fs = require('fs');
let code = fs.readFileSync('src/views/GamesLibrary.tsx', 'utf8');

code = code.replace(/onClick=\{\(\) => onViewChange\(\(game\.gameType/g, 'onClick={(e) => { e.preventDefault(); e.stopPropagation(); onViewChange((game.gameType');

fs.writeFileSync('src/views/GamesLibrary.tsx', code);
