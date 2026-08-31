const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

code = code.replace(
  '<div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold shadow-[0_0_15px_rgba(59,130,246,0.6)]">P1</div>',
  '<div className="min-w-[3rem] px-3 h-12 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold shadow-[0_0_15px_rgba(59,130,246,0.6)]">{numPlayers === 2 ? p1Name : "P1"}</div>'
);

fs.writeFileSync('src/views/BubblePop.tsx', code);
console.log('P1 Patched');
