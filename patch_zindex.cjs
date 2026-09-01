const fs = require('fs');
let code = fs.readFileSync('src/views/GamesLibrary.tsx', 'utf8');

const targetStr = `            <div
              key={game.id}
              className="group bg-white dark:bg-slate-800 rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-slate-100 dark:border-slate-700 flex flex-col"
            >`;

const replacementStr = `            <div
              key={game.id}
              className={\`group bg-white dark:bg-slate-800 rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-slate-100 dark:border-slate-700 flex flex-col relative \${openMenuId === game.id ? 'z-50' : 'z-10'}\`}
            >`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/views/GamesLibrary.tsx', code);
