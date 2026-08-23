const fs = require('fs');
let code = fs.readFileSync('src/views/GamesLibrary.tsx', 'utf8');

if (!code.includes('GameThumbnail')) {
    code = code.replace('import { ViewState } from "../types";', 'import { ViewState } from "../types";\nimport { GameThumbnail } from "../components/GameThumbnail";');
}

// 1. Line 371
code = code.replace(
    /\{[\s\S]*?const icon = gameTemplates\.find[\s\S]*?\([\s\S]*?icon\.startsWith\("http"\)[\s\S]*?\}\)/,
    '<GameThumbnail gameType={game.gameType} info={gameTemplates.find(t => t.id === game.gameType) || {}} />'
);

// 2. Line 532
code = code.replace(
    /\{template\.icon\.startsWith\("http"\) \|\| template\.icon\.startsWith\("\/"\)\) \? \([\s\S]*?\) : \([\s\S]*?\)\}/,
    '<GameThumbnail gameType={template.id} info={template} />\n                  <div className="absolute inset-0 bg-brand-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">\n                    <div className="w-16 h-16 bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center text-brand-purple shadow-lg transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 delay-75">\n                      <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>\n                    </div>\n                  </div>'
);

// Ah wait, the original was: 
// {template.icon.startsWith("http") || template.icon.startsWith("/") ? (
//  ...
// ) : (
//  ...
// )}
// It has nested JSX. Let's just do string replacement for the template part more carefully.

fs.writeFileSync('src/views/GamesLibrary.tsx', code);
console.log("Patched GamesLibrary");
