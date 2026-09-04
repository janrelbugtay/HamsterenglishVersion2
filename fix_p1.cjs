const fs = require('fs');
let content = fs.readFileSync('src/views/BubblePop.tsx', 'utf-8');
content = content.replace('{numPlayers === 2 ? p1Name : "P1"}', '{numPlayers === 2 ? p1Name : "P1"}'); // wait I'll change it to Team 1
content = content.replace('{numPlayers === 2 ? p1Name : "P1"}', '{numPlayers === 2 ? p1Name : p1Name}');
fs.writeFileSync('src/views/BubblePop.tsx', content);
