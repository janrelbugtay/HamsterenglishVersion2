const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

const setupButtonsStart = `<div className="flex gap-8 max-w-4xl w-full justify-center perspective-[1000px]">`;
const setupButtonsEnd = `                <div className="flex flex-wrap justify-center gap-4 mt-12 relative z-10">`;

let setupButtonsChunk = code.substring(code.indexOf(setupButtonsStart), code.indexOf(setupButtonsEnd));

const newSetupChunk = `<div className="w-full max-w-4xl bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-[2rem] border border-white/20 p-8 shadow-2xl mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
                        <div>
                            <h3 className="text-white text-2xl font-bold mb-6 drop-shadow-md">Players</h3>
                            <div className="flex flex-col gap-5">
                                <div className="flex gap-3 items-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(59,130,246,0.6)]">1</div>
                                    <input type="text" value={p1Name} onChange={e => setP1Name(e.target.value)} className="flex-1 bg-black/20 text-white font-bold placeholder-white/50 border border-white/20 rounded-2xl px-5 py-3 outline-none focus:border-white/50 transition-colors" placeholder="Player 1 Name" />
                                </div>
                                <div className="flex gap-3 items-center">
                                    <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(239,68,68,0.6)]">2</div>
                                    <input type="text" value={p2Name} onChange={e => setP2Name(e.target.value)} className="flex-1 bg-black/20 text-white font-bold placeholder-white/50 border border-white/20 rounded-2xl px-5 py-3 outline-none focus:border-white/50 transition-colors" placeholder="Player 2 Name" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white text-2xl font-bold mb-6 drop-shadow-md">Settings</h3>
                            <div className="flex flex-col gap-6">
                                <label className="flex items-center justify-between text-white font-bold text-lg">
                                    <span>Bubble Speed ({speed}x)</span>
                                    <input type="range" min="1" max="5" step="1" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} className="w-1/2 accent-blue-400 h-2 bg-black/30 rounded-lg appearance-none cursor-pointer" />
                                </label>
                                <label className="flex items-center justify-between text-white font-bold text-lg">
                                    <span>Bubble Size ({bubbleSize}x)</span>
                                    <input type="range" min="0.5" max="3" step="0.5" value={bubbleSize} onChange={e => setBubbleSize(parseFloat(e.target.value))} className="w-1/2 accent-blue-400 h-2 bg-black/30 rounded-lg appearance-none cursor-pointer" />
                                </label>
                                <label className="flex items-center justify-between text-white font-bold text-lg cursor-pointer">
                                    <span>Twist Effect</span>
                                    <input type="checkbox" checked={twistEnabled} onChange={e => setTwistEnabled(e.target.checked)} className="w-7 h-7 rounded-xl accent-blue-500 bg-black/30 cursor-pointer" />
                                </label>
                            </div>
                        </div>
                    </div>

                    ${setupButtonsChunk}
                </div>

                <div className="flex flex-wrap justify-center gap-4 relative z-10">`;

code = code.replace(setupButtonsChunk + setupButtonsEnd, newSetupChunk);


// Fix P1 and P2 rendering in UI
code = code.replace(`<div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-xl font-bold shadow-[0_0_15px_rgba(239,68,68,0.6)]">P2</div>`, `<div className="min-w-[3rem] px-3 h-12 rounded-full bg-red-500 flex items-center justify-center text-xl font-bold shadow-[0_0_15px_rgba(239,68,68,0.6)]">{p2Name}</div>`);
code = code.replace(`P1:\${scores[0]} P2:\${scores[1]}`, `\${p1Name}:\${scores[0]} \${p2Name}:\${scores[1]}`);


// In results screen:
code = code.replace(`{numPlayers === 1 ? scores[0] : \`P1:\${scores[0]} P2:\${scores[1]}\`}`, `{numPlayers === 1 ? scores[0] : \`\${p1Name}: \${scores[0]} | \${p2Name}: \${scores[1]}\`}`);

fs.writeFileSync('src/views/BubblePop.tsx', code);
console.log('Setup UI Patched!');
