const fs = require('fs');
let code = fs.readFileSync('src/views/GamesLibrary.tsx', 'utf8');

code = code.replace(/onPointerDown=\{\(e\) => \{ e\.preventDefault\(\); e\.stopPropagation\(\);/g, 'onClick={(e) => { e.stopPropagation();');
code = code.replace(/onPointerDown=\{\(\) => \{ setOpenMenuId\(null\); setGameToMove\(null\); \}\}/g, 'onClick={() => { setOpenMenuId(null); setGameToMove(null); }}');

fs.writeFileSync('src/views/GamesLibrary.tsx', code);
