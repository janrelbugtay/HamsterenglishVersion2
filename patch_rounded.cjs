const fs = require('fs');
let code = fs.readFileSync('src/views/GamesLibrary.tsx', 'utf8');

const targetStr = `<div className="p-5 flex flex-col h-full relative z-10 bg-white dark:bg-slate-800">`;
const replacementStr = `<div className="p-5 flex flex-col h-full relative z-10 bg-white dark:bg-slate-800 rounded-[24px]">`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/views/GamesLibrary.tsx', code);
