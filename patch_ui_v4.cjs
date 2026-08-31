const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

const setupUIStartStr = '<div className="w-full max-w-4xl bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-[2rem] border border-white/20 p-8 shadow-2xl mb-8">';
const setupUIIndexStart = code.indexOf(setupUIStartStr);

let setupUIIndexEnd = -1;
if (setupUIIndexStart !== -1) {
    const tempEnd = code.indexOf('Compete side-by-side!</p>', setupUIIndexStart);
    if (tempEnd !== -1) {
        // Find the second </div> after this
        let firstDiv = code.indexOf('</div>', tempEnd);
        let secondDiv = code.indexOf('</div>', firstDiv + 6);
        if (secondDiv !== -1) {
            setupUIIndexEnd = secondDiv + 6;
        }
    }
}

if (setupUIIndexStart !== -1 && setupUIIndexEnd !== -1) {
    const setupUINew = `<div className="w-full max-w-2xl bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-[2rem] border border-white/20 p-8 shadow-2xl mb-8 flex flex-col items-center relative z-10">
                    <div className="flex gap-6 mb-8 w-full justify-center">
                        <button
                            onClick={() => setNumPlayers(1)}
                            className={\`flex-1 flex flex-col items-center gap-3 p-6 rounded-3xl border border-white/20 transition-all duration-300 \${numPlayers === 1 ? 'bg-blue-500/30 scale-105 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'bg-black/20 hover:bg-white/10'}\`}
                        >
                            <div className="text-5xl bg-blue-500 w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.6)]">👤</div>
                            <span className="text-white font-bold text-2xl">1 Player</span>
                        </button>
                        <button
                            onClick={() => setNumPlayers(2)}
                            className={\`flex-1 flex flex-col items-center gap-3 p-6 rounded-3xl border border-white/20 transition-all duration-300 \${numPlayers === 2 ? 'bg-red-500/30 scale-105 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'bg-black/20 hover:bg-white/10'}\`}
                        >
                            <div className="text-5xl bg-red-500 w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.6)]">👥</div>
                            <span className="text-white font-bold text-2xl">2 Players</span>
                        </button>
                    </div>

                    <div className="w-full max-w-md flex flex-col gap-4 mb-10">
                        <div className="flex gap-3 items-center">
                            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(59,130,246,0.6)]">1</div>
                            <input type="text" value={p1Name} onChange={e => setP1Name(e.target.value)} className="flex-1 bg-black/20 text-white font-bold placeholder-white/50 border border-white/20 rounded-2xl px-5 py-4 outline-none focus:border-white/50 transition-colors text-lg" placeholder="Player 1 Name" />
                        </div>
                        {numPlayers === 2 && (
                            <div className="flex gap-3 items-center">
                                <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(239,68,68,0.6)]">2</div>
                                <input type="text" value={p2Name} onChange={e => setP2Name(e.target.value)} className="flex-1 bg-black/20 text-white font-bold placeholder-white/50 border border-white/20 rounded-2xl px-5 py-4 outline-none focus:border-white/50 transition-colors text-lg" placeholder="Player 2 Name" />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => startGameMode(numPlayers)}
                        className="px-12 py-5 bg-gradient-to-r from-blue-500 to-sky-400 text-white font-black text-2xl rounded-full shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95 transition-all w-full max-w-md"
                    >
                        START GAME
                    </button>
                </div>`;
    code = code.substring(0, setupUIIndexStart) + setupUINew + code.substring(setupUIIndexEnd);
    fs.writeFileSync('src/views/BubblePop.tsx', code);
    console.log("Setup UI replaced correctly using v4!");
} else {
    console.log("Failed to match boundaries again in v4.");
}
