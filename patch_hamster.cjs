const fs = require('fs');
let code = fs.readFileSync('src/views/HamsterPopQuiz.tsx', 'utf8');

// Add FullscreenButton import
if (!code.includes('FullscreenButton')) {
    code = code.replace('import { ViewState } from "../types";', 'import { ViewState } from "../types";\nimport { FullscreenButton } from "../components/FullscreenButton";');
}

// Update the main container and remove Navbar
code = code.replace(
    /<div className="h-\[calc\(100vh-2rem\)\] w-full text-slate-800 font-nunito overflow-y-auto overflow-x-hidden bg-gradient-to-br from-cyan-100 via-sky-50 to-yellow-50 relative selection:bg-yellow-400 selection:text-slate-900" style=\{\{ margin: "-1rem", height: "calc\(100% \+ 2rem\)" \}\}>/g,
    '<div id="game-container" className="h-[calc(100vh-2rem)] w-full -m-4 md:-m-8 text-slate-800 font-nunito overflow-y-auto overflow-x-hidden bg-gradient-to-br from-sky-300 via-cyan-200 to-yellow-100 relative selection:bg-yellow-400 selection:text-slate-900 rounded-[2rem] border-8 border-white/40 shadow-2xl" style={{ margin: "-1rem", height: "calc(100% + 2rem)" }}>\n\n      <div className="absolute top-4 left-4 z-[60] flex items-center gap-2">\n        <button \n          onClick={() => onViewChange("games")}\n          className="flex items-center gap-2 p-2 rounded-full transition-colors backdrop-blur-md border text-slate-600 hover:text-slate-900 bg-white/50 hover:bg-white border-white/50 shadow-sm"\n        >\n          <ArrowLeft size={24} />\n        </button>\n        <FullscreenButton targetId="game-container" />\n      </div>\n\n      <div className="absolute top-4 right-4 z-[60] flex items-center gap-4">\n        <div className="flex items-center gap-2 bg-yellow-400/90 backdrop-blur-md px-4 py-2 rounded-full border-2 border-yellow-300 shadow-md">\n          <Star className="text-white" fill="currentColor" size={18} />\n          <span className="font-bold text-yellow-900">{xp} XP</span>\n        </div>\n        <div className="flex items-center gap-2 bg-orange-400/90 backdrop-blur-md px-4 py-2 rounded-full border-2 border-orange-300 shadow-md">\n          <Flame className="text-white" fill="currentColor" size={18} />\n          <span className="font-bold text-orange-900">{streak}</span>\n        </div>\n      </div>\n'
);

code = code.replace(/<Navbar navigateTo=\{navigateTo\} xp=\{xp\} streak=\{streak\} onViewChange=\{onViewChange\} \/>/g, '');

fs.writeFileSync('src/views/HamsterPopQuiz.tsx', code);
console.log("Patched HamsterPopQuiz");
