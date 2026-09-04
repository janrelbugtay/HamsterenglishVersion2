const fs = require('fs');

let content = fs.readFileSync('src/views/BubblePop.tsx', 'utf-8');

// Remove single-player xp and coins
const spRegex = /<div className="bg-slate-50 dark:bg-\[#303343\] p-5 rounded-xl border border-slate-200 dark:border-white\/5 shadow-inner flex flex-col items-center justify-center">\s*<div className="text-slate-400 text-xs md:text-sm font-black uppercase tracking-wider mb-2">XP Earned<\/div>\s*<div className="text-2xl md:text-4xl font-black text-fuchsia-400 drop-shadow-sm">\+\{xpEarned\}<\/div>\s*<\/div>\s*<div className="bg-slate-50 dark:bg-\[#303343\] p-5 rounded-xl border border-slate-200 dark:border-white\/5 shadow-inner flex flex-col items-center justify-center">\s*<div className="text-slate-400 text-xs md:text-sm font-black uppercase tracking-wider mb-2">Coins Earned<\/div>\s*<div className="text-2xl md:text-4xl font-black text-yellow-400 drop-shadow-sm">\+\{coinsEarned\}<\/div>\s*<\/div>/g;
content = content.replace(spRegex, '');

// Remove multi-player xp and coins
const mpRegex = /<div className="grid grid-cols-2 gap-4">\s*<div className="bg-slate-50 dark:bg-\[#303343\] p-4 rounded-xl border border-slate-200 dark:border-white\/5 shadow-inner flex flex-col items-center justify-center">\s*<div className="text-slate-400 text-xs font-black uppercase tracking-wider mb-1">XP Earned<\/div>\s*<div className="text-2xl font-black text-fuchsia-400 drop-shadow-sm">\+\{xpEarned\}<\/div>\s*<\/div>\s*<div className="bg-slate-50 dark:bg-\[#303343\] p-4 rounded-xl border border-slate-200 dark:border-white\/5 shadow-inner flex flex-col items-center justify-center">\s*<div className="text-slate-400 text-xs font-black uppercase tracking-wider mb-1">Coins Earned<\/div>\s*<div className="text-2xl font-black text-yellow-400 drop-shadow-sm">\+\{coinsEarned\}<\/div>\s*<\/div>\s*<\/div>/g;
content = content.replace(mpRegex, '');

fs.writeFileSync('src/views/BubblePop.tsx', content);
console.log("Removed XP and Coins.");
