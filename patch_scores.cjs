const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

const oldScoresTop = `                    <div className="glass-panel bg-white/90 dark:bg-slate-900/80 rounded-2xl p-4 min-w-[200px] border-l-4 border-blue-500 flex items-center gap-4 backdrop-blur-md">
                        <div className="min-w-[3rem] px-3 h-12 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold shadow-[0_0_15px_rgba(59,130,246,0.6)]">{numPlayers === 2 ? p1Name : "P1"}</div>
                        <div>
                            <div className="text-sm font-bold text-blue-400 uppercase tracking-wider">Score</div>
                            <div className="text-3xl font-black">{scores[0]}</div>
                        </div>
                    </div>
                    <div className="glass-panel bg-white/90 dark:bg-slate-900/90 rounded-2xl flex-grow max-w-4xl p-6 text-center border-t-4 border-indigo-500 shadow-2xl relative overflow-hidden backdrop-blur-xl">`;

const newScoresTop = `                    <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-4 min-w-[180px] md:min-w-[220px] border border-white/40 dark:border-white/10 flex flex-col items-center shadow-xl backdrop-blur-md pointer-events-auto shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                        <div className="flex flex-col items-center gap-1 mb-2">
                            <div className="min-w-[4rem] px-4 h-10 rounded-full bg-blue-500 flex items-center justify-center text-lg font-black text-white shadow-inner uppercase tracking-wider">{numPlayers === 2 ? p1Name : "Player 1"}</div>
                            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Score</div>
                        </div>
                        <div className="text-5xl md:text-7xl font-black text-blue-500 dark:text-blue-400 drop-shadow-sm tabular-nums tracking-tighter">{scores[0]}</div>
                    </div>
                    <div className="glass-panel bg-white/90 dark:bg-slate-900/90 rounded-3xl flex-grow max-w-4xl p-6 text-center border-t-4 border-indigo-500 shadow-2xl relative overflow-hidden backdrop-blur-xl pointer-events-auto">`;
code = code.replace(oldScoresTop, newScoresTop);

const oldScoresRight = `                    {numPlayers === 2 ? (
                        <div className="glass-panel bg-white/90 dark:bg-slate-900/80 rounded-2xl p-4 min-w-[200px] border-r-4 border-red-500 flex items-center justify-end gap-4 backdrop-blur-md">
                            <div className="text-right">
                                <div className="text-sm font-bold text-red-400 uppercase tracking-wider">Score</div>
                                <div className="text-3xl font-black">{scores[1]}</div>
                            </div>
                            <div className="min-w-[3rem] px-3 h-12 rounded-full bg-red-500 flex items-center justify-center text-xl font-bold shadow-[0_0_15px_rgba(239,68,68,0.6)]">{p2Name}</div>
                        </div>
                    ) : (
                        <div className="min-w-[200px]"></div>
                    )}`;

const newScoresRight = `                    {numPlayers === 2 ? (
                        <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-4 min-w-[180px] md:min-w-[220px] border border-white/40 dark:border-white/10 flex flex-col items-center shadow-xl backdrop-blur-md pointer-events-auto shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                            <div className="flex flex-col items-center gap-1 mb-2">
                                <div className="min-w-[4rem] px-4 h-10 rounded-full bg-red-500 flex items-center justify-center text-lg font-black text-white shadow-inner uppercase tracking-wider">{p2Name}</div>
                                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Score</div>
                            </div>
                            <div className="text-5xl md:text-7xl font-black text-red-500 dark:text-red-400 drop-shadow-sm tabular-nums tracking-tighter">{scores[1]}</div>
                        </div>
                    ) : (
                        <div className="min-w-[180px] md:min-w-[220px]"></div>
                    )}`;
code = code.replace(oldScoresRight, newScoresRight);

fs.writeFileSync('src/views/BubblePop.tsx', code);
