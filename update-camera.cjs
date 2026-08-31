const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

code = code.replace(/ctx\.globalAlpha = 0\.3;/, 'ctx.globalAlpha = 1.0;');
code = code.replace(/className="hidden" autoPlay playsInline><\/video>/, 'className="absolute w-0 h-0 opacity-0 pointer-events-none" autoPlay playsInline></video>');
code = code.replace(/className="absolute inset-0 z-0 bg-slate-50 dark:bg-\[#0f172a\]"/, 'className="absolute inset-0 z-0 bg-black"'); // Force black background so video is clear

fs.writeFileSync('src/views/BubblePop.tsx', code);
