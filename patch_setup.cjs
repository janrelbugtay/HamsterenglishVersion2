const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

const setupScreenStart = "{screen === 'setup' && (";
const setupScreenEnd = "        </div>\n      )}";
const startIndex = code.indexOf(setupScreenStart);
// find the next closing </div>\n      )}
const endIndex = code.indexOf(setupScreenEnd, startIndex) + setupScreenEnd.length;

const replacement = `{screen === 'setup' && (
        <div className="absolute inset-0 z-40 bg-gradient-to-b from-sky-400 to-blue-200 dark:from-sky-900 dark:to-blue-950 flex flex-col items-center justify-center p-8 overflow-hidden">
            {/* Immersive Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-300/30 rounded-full blur-3xl"></div>
                {/* Clouds */}
                <div className="absolute top-20 left-[10%] opacity-80 animate-float" style={{ animationDelay: '0s' }}>
                    <div className="w-24 h-8 bg-white rounded-full absolute top-4 left-4"></div>
                    <div className="w-16 h-16 bg-white rounded-full absolute top-0 left-8"></div>
                    <div className="w-12 h-12 bg-white rounded-full absolute top-2 left-2"></div>
                </div>
                <div className="absolute top-40 right-[15%] opacity-60 animate-float" style={{ animationDelay: '2s' }}>
                    <div className="w-32 h-10 bg-white rounded-full absolute top-6 left-6"></div>
                    <div className="w-20 h-20 bg-white rounded-full absolute top-0 left-10"></div>
                </div>
                {/* Floating Bubbles */}
                {Array.from({ length: 15 }).map((_, i) => (
                    <div 
                        key={i} 
                        className="absolute rounded-full border border-white/40 bg-gradient-to-tr from-white/10 to-white/30 backdrop-blur-[2px] shadow-[inset_0_0_10px_rgba(255,255,255,0.5)] animate-float-up"
                        style={{
                            width: \`\${Math.random() * 40 + 20}px\`,
                            height: \`\${Math.random() * 40 + 20}px\`,
                            left: \`\${Math.random() * 100}%\`,
                            bottom: \`-\${Math.random() * 20 + 10}%\`,
                            animationDuration: \`\${Math.random() * 10 + 10}s\`,
                            animationDelay: \`\${Math.random() * 5}s\`
                        }}
                    >
                        <div className="absolute top-[15%] left-[20%] w-1/4 h-1/4 bg-white/60 rounded-full blur-[1px]"></div>
                    </div>
                ))}
            </div>

            <div className="relative z-10 flex flex-col items-center">
                <h2 className="text-6xl sm:text-7xl font-black mb-12 text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-100 drop-shadow-[0_4px_4px_rgba(0,0,0,0.1)] text-center tracking-tight" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>
                    Bubble Pop
                </h2>
                
                <div className="flex gap-8 max-w-4xl w-full justify-center perspective-[1000px]">
                    <button onClick={() => startGameMode(1)} className="group relative flex-1 max-w-[300px] h-80 rounded-[3rem] bg-white/20 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 shadow-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:bg-white/30 hover:-translate-y-2 cursor-pointer flex flex-col items-center justify-center p-8">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 dark:to-black/20 pointer-events-none"></div>
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/30 rounded-full blur-2xl group-hover:bg-blue-400/50 transition-colors"></div>
                        
                        <div className="relative z-10 text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-xl bg-blue-500 w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.6)]">
                            👤
                        </div>
                        <h3 className="relative z-10 text-3xl font-black text-white mb-2 drop-shadow-md">1 Player</h3>
                        <p className="relative z-10 text-blue-50 font-medium text-center">Practice and earn maximum XP.</p>
                    </button>
                    
                    <button onClick={() => startGameMode(2)} className="group relative flex-1 max-w-[300px] h-80 rounded-[3rem] bg-white/20 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 shadow-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:bg-white/30 hover:-translate-y-2 cursor-pointer flex flex-col items-center justify-center p-8">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 dark:to-black/20 pointer-events-none"></div>
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-400/30 rounded-full blur-2xl group-hover:bg-red-400/50 transition-colors"></div>
                        
                        <div className="relative z-10 text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-xl bg-red-500 w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.6)]">
                            👥
                        </div>
                        <h3 className="relative z-10 text-3xl font-black text-white mb-2 drop-shadow-md">2 Players</h3>
                        <p className="relative z-10 text-blue-50 font-medium text-center">Compete side-by-side!</p>
                    </button>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4 mt-12 relative z-10">
                  <button onClick={() => onViewChange('games')} className="px-8 py-4 rounded-full bg-white/20 backdrop-blur-md shadow-lg hover:bg-white/30 text-xl font-bold text-white border border-white/40 cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                    <ArrowLeft size={24} /> Back to Games
                  </button>
                </div>
            </div>
        </div>
      )}`;

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + replacement + code.substring(endIndex);
  fs.writeFileSync('src/views/BubblePop.tsx', code);
  console.log('Successfully patched BubblePop.tsx');
} else {
  console.error('Could not find boundaries');
}
