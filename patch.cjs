const fs = require('fs');
let code = fs.readFileSync('src/views/GamesLibrary.tsx', 'utf8');

code = code.replace(/onClick=\{\(\) => \{\n                        if \(openMenuId === game\.id\) \{/g, 'onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (openMenuId === game.id) {');

fs.writeFileSync('src/views/GamesLibrary.tsx', code);
