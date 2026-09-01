const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

const endGameLogicOld = `    let title = "Good Try!";
    if (acc > 90) title = "Perfect Round!";
    else if (acc > 70) title = "Excellent!";
    setResultsTitle(title);`;

const endGameLogicNew = `    let title = "Good Try!";
    if (gameState.current.numPlayers === 1) {
        if (acc > 90) title = "Perfect Round!";
        else if (acc > 70) title = "Excellent!";
    } else {
        if (gameState.current.scores[0] > gameState.current.scores[1]) {
            title = \`\${p1Name} Wins!\`;
        } else if (gameState.current.scores[1] > gameState.current.scores[0]) {
            title = \`\${p2Name} Wins!\`;
        } else {
            title = "It's a Tie!";
        }
    }
    setResultsTitle(title);`;
code = code.replace(endGameLogicOld, endGameLogicNew);

const oldResultsUI = `                <h2 className="text-3xl md:text-4xl font-black text-yellow-400 uppercase tracking-widest mb-6 drop-shadow-sm">{resultsTitle}</h2>
                <div className="flex justify-center gap-3 mb-10">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="relative">
                            <svg 
                                viewBox="0 0 24 24" 
                                className={\`w-12 h-12 md:w-16 md:h-16 transition-all duration-500 transform \${accuracy >= (star * 20 - 10) ? 'scale-100 opacity-100' : 'scale-75 opacity-30 grayscale'}\`}
                                style={{
                                    filter: accuracy >= (star * 20 - 10) ? 'drop-shadow(0 8px 6px rgba(0,0,0,0.4))' : 'none',
                                    animation: accuracy >= (star * 20 - 10) ? \`popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) \${star * 0.1}s both\` : 'none'
                                }}
                            >
                                <path 
                                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                                    fill={accuracy >= (star * 20 - 10) ? "#facc15" : "#475569"} 
                                    stroke={accuracy >= (star * 20 - 10) ? "#ca8a04" : "#334155"} 
                                    strokeWidth="1.5"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 md:gap-6 mb-10">
                    <div className="bg-slate-50 dark:bg-[#303343] p-5 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner flex flex-col items-center justify-center">
                        <div className="text-slate-400 text-xs md:text-sm font-black uppercase tracking-wider mb-2">Accuracy</div>
                        <div className="text-3xl md:text-5xl font-black text-emerald-400 drop-shadow-sm">{accuracy}%</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#303343] p-5 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner flex flex-col items-center justify-center">
                        <div className="text-slate-400 text-xs md:text-sm font-black uppercase tracking-wider mb-2">Score</div>
                        <div className="text-3xl md:text-5xl font-black text-sky-400 drop-shadow-sm">{numPlayers === 1 ? scores[0] : \`\${p1Name}:\${scores[0]} \${p2Name}:\${scores[1]}\`}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#303343] p-5 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner flex flex-col items-center justify-center">
                        <div className="text-slate-400 text-xs md:text-sm font-black uppercase tracking-wider mb-2">XP Earned</div>
                        <div className="text-2xl md:text-4xl font-black text-fuchsia-400 drop-shadow-sm">+{xpEarned}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#303343] p-5 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner flex flex-col items-center justify-center">
                        <div className="text-slate-400 text-xs md:text-sm font-black uppercase tracking-wider mb-2">Coins Earned</div>
                        <div className="text-2xl md:text-4xl font-black text-yellow-400 drop-shadow-sm">+{coinsEarned}</div>
                    </div>
                </div>`;

const newResultsUI = `                <h2 className={\`text-4xl md:text-5xl font-black uppercase tracking-widest mb-6 drop-shadow-sm \${numPlayers === 2 && scores[0] !== scores[1] ? (scores[0] > scores[1] ? 'text-blue-500' : 'text-red-500') : 'text-yellow-400'}\`}>{resultsTitle}</h2>
                
                {numPlayers === 1 ? (
                    <>
                        <div className="flex justify-center gap-3 mb-10">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <div key={star} className="relative">
                                    <svg 
                                        viewBox="0 0 24 24" 
                                        className={\`w-12 h-12 md:w-16 md:h-16 transition-all duration-500 transform \${accuracy >= (star * 20 - 10) ? 'scale-100 opacity-100' : 'scale-75 opacity-30 grayscale'}\`}
                                        style={{
                                            filter: accuracy >= (star * 20 - 10) ? 'drop-shadow(0 8px 6px rgba(0,0,0,0.4))' : 'none',
                                            animation: accuracy >= (star * 20 - 10) ? \`popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) \${star * 0.1}s both\` : 'none'
                                        }}
                                    >
                                        <path 
                                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                                            fill={accuracy >= (star * 20 - 10) ? "#facc15" : "#475569"} 
                                            stroke={accuracy >= (star * 20 - 10) ? "#ca8a04" : "#334155"} 
                                            strokeWidth="1.5"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 md:gap-6 mb-10">
                            <div className="bg-slate-50 dark:bg-[#303343] p-5 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner flex flex-col items-center justify-center">
                                <div className="text-slate-400 text-xs md:text-sm font-black uppercase tracking-wider mb-2">Accuracy</div>
                                <div className="text-3xl md:text-5xl font-black text-emerald-400 drop-shadow-sm">{accuracy}%</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-[#303343] p-5 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner flex flex-col items-center justify-center">
                                <div className="text-slate-400 text-xs md:text-sm font-black uppercase tracking-wider mb-2">Score</div>
                                <div className="text-3xl md:text-5xl font-black text-sky-400 drop-shadow-sm">{scores[0]}</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-[#303343] p-5 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner flex flex-col items-center justify-center">
                                <div className="text-slate-400 text-xs md:text-sm font-black uppercase tracking-wider mb-2">XP Earned</div>
                                <div className="text-2xl md:text-4xl font-black text-fuchsia-400 drop-shadow-sm">+{xpEarned}</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-[#303343] p-5 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner flex flex-col items-center justify-center">
                                <div className="text-slate-400 text-xs md:text-sm font-black uppercase tracking-wider mb-2">Coins Earned</div>
                                <div className="text-2xl md:text-4xl font-black text-yellow-400 drop-shadow-sm">+{coinsEarned}</div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col gap-8 mb-10 w-full">
                        <div className="flex items-center justify-center gap-4 w-full">
                            <div className={\`flex flex-col items-center flex-1 p-6 rounded-2xl border-4 transition-all \${scores[0] > scores[1] ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105 shadow-xl' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 grayscale-[20%]'}\`}>
                                <div className="min-w-[4rem] px-4 py-1 rounded-full bg-blue-500 text-white font-bold uppercase tracking-wider mb-4 shadow-md">{p1Name}</div>
                                <div className={\`text-5xl md:text-7xl font-black tabular-nums tracking-tighter \${scores[0] > scores[1] ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}\`}>{scores[0]}</div>
                            </div>
                            
                            <div className="text-3xl font-black text-slate-300 dark:text-slate-600 px-2 italic">VS</div>
                            
                            <div className={\`flex flex-col items-center flex-1 p-6 rounded-2xl border-4 transition-all \${scores[1] > scores[0] ? 'border-red-500 bg-red-50 dark:bg-red-900/20 scale-105 shadow-xl' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 grayscale-[20%]'}\`}>
                                <div className="min-w-[4rem] px-4 py-1 rounded-full bg-red-500 text-white font-bold uppercase tracking-wider mb-4 shadow-md">{p2Name}</div>
                                <div className={\`text-5xl md:text-7xl font-black tabular-nums tracking-tighter \${scores[1] > scores[0] ? 'text-red-500 dark:text-red-400' : 'text-slate-400 dark:text-slate-500'}\`}>{scores[1]}</div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-[#303343] p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner flex flex-col items-center justify-center">
                                <div className="text-slate-400 text-xs font-black uppercase tracking-wider mb-1">XP Earned</div>
                                <div className="text-2xl font-black text-fuchsia-400 drop-shadow-sm">+{xpEarned}</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-[#303343] p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner flex flex-col items-center justify-center">
                                <div className="text-slate-400 text-xs font-black uppercase tracking-wider mb-1">Coins Earned</div>
                                <div className="text-2xl font-black text-yellow-400 drop-shadow-sm">+{coinsEarned}</div>
                            </div>
                        </div>
                    </div>
                )}`;
code = code.replace(oldResultsUI, newResultsUI);
fs.writeFileSync('src/views/BubblePop.tsx', code);
