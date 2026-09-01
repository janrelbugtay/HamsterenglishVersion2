const fs = require('fs');
let code = fs.readFileSync('src/views/GamesLibrary.tsx', 'utf8');

code = code.replace(/onClick=\{\(e\) => \{ e\.preventDefault\(\); e\.stopPropagation\(\); onViewChange/g, 'onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onViewChange');
code = code.replace(/onClick=\{\(e\) => \{ e\.preventDefault\(\); e\.stopPropagation\(\); handleTogglePublic/g, 'onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); handleTogglePublic');
code = code.replace(/onClick=\{\(e\) => \{ e\.preventDefault\(\); e\.stopPropagation\(\); handleDuplicateGame/g, 'onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); handleDuplicateGame');
code = code.replace(/onClick=\{\(e\) => \{ e\.preventDefault\(\); e\.stopPropagation\(\); handleDelete/g, 'onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete');

code = code.replace(/onClick=\{\(e\) => \{ e\.preventDefault\(\); e\.stopPropagation\(\); setGameToMove\(game\.id\); \}\}/g, 'onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); setGameToMove(game.id); }}');
code = code.replace(/onClick=\{\(e\) => \{ e\.preventDefault\(\); e\.stopPropagation\(\); handleMoveGame\(null\);/g, 'onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); handleMoveGame(null);');
code = code.replace(/onClick=\{\(e\) => \{ e\.preventDefault\(\); e\.stopPropagation\(\); handleMoveGame\(f\.id\);/g, 'onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); handleMoveGame(f.id);');

// And change the background fixed div to onPointerDown too
code = code.replace(/<div className="fixed inset-0 z-30" onClick/g, '<div className="fixed inset-0 z-30" onPointerDown');


fs.writeFileSync('src/views/GamesLibrary.tsx', code);
