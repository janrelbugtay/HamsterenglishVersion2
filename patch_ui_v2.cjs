const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

// 1. Add Settings icon import if not present
if (!code.includes('Settings } from "lucide-react"')) {
    code = code.replace(
        /import { ArrowLeft, Edit3, Trash2, Heart, Plus, Sparkles, BookOpen, Search, Save, X, Play, Folder, Image as ImageIcon, ClipboardList, Info } from "lucide-react";/g,
        'import { ArrowLeft, Edit3, Trash2, Heart, Plus, Sparkles, BookOpen, Search, Save, X, Play, Folder, Image as ImageIcon, ClipboardList, Info, Settings } from "lucide-react";'
    );
}

// 2. Add showInGameSettings state
if (!code.includes('showInGameSettings')) {
    code = code.replace(
        'const [speed, setSpeed] = useState(1);',
        'const [speed, setSpeed] = useState(1);\n  const [showInGameSettings, setShowInGameSettings] = useState(false);\n  const handleSetSpeed = (val: number) => { setSpeed(val); gameState.current.speed = val; };\n  const handleSetBubbleSize = (val: number) => { setBubbleSize(val); gameState.current.size = val; };\n  const handleSetTwistEnabled = (val: boolean) => { setTwistEnabled(val); gameState.current.twist = val; };'
    );
}

// 3. Replace the setup screen UI precisely
const setupUIStartStr = '<div className="w-full max-w-4xl bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-[2rem] border border-white/20 p-8 shadow-2xl mb-8">';
const setupUIEndStr = '</button>\n                </div>\n                \n                </div>';
const setupUIIndexStart = code.indexOf(setupUIStartStr);
let setupUIIndexEnd = -1;

if (setupUIIndexStart !== -1) {
    setupUIIndexEnd = code.indexOf(setupUIEndStr, setupUIIndexStart);
    if (setupUIIndexEnd !== -1) {
        setupUIIndexEnd += setupUIEndStr.length;
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
    console.log("Setup UI replaced");
} else {
    console.log("Could not find setupUI string! Start:", setupUIIndexStart, "End:", setupUIIndexEnd);
}

// 4. Add the settings button in the game screen and the modal
const gameUIExitBtnStr = 'className="glass-panel px-6 py-2 rounded-full hover:bg-white/20 font-bold pointer-events-auto border border-white/20 cursor-pointer">Exit</button>';

const inGameSettingsModal = `
                    <button onClick={() => setShowInGameSettings(!showInGameSettings)} className="glass-panel w-12 h-12 flex justify-center items-center rounded-full hover:bg-white/20 font-bold pointer-events-auto border border-white/20 cursor-pointer ml-4">
                        <Settings size={20} className="text-slate-800 dark:text-white" />
                    </button>
                    
                    {showInGameSettings && (
                        <div className="absolute left-6 bottom-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-2 border-blue-500 rounded-3xl p-6 shadow-2xl w-80 pointer-events-auto z-[60]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Game Settings</h3>
                                <button onClick={() => setShowInGameSettings(false)} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white transition-colors cursor-pointer">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="flex flex-col gap-6">
                                <label className="flex flex-col gap-2 text-slate-800 dark:text-white font-bold">
                                    <div className="flex justify-between">
                                        <span>Bubble Speed</span>
                                        <span className="text-blue-500">{speed}x</span>
                                    </div>
                                    <input type="range" min="1" max="5" step="1" value={speed} onChange={e => handleSetSpeed(parseFloat(e.target.value))} className="w-full accent-blue-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                                </label>
                                <label className="flex flex-col gap-2 text-slate-800 dark:text-white font-bold">
                                    <div className="flex justify-between">
                                        <span>Bubble Size</span>
                                        <span className="text-blue-500">{bubbleSize}x</span>
                                    </div>
                                    <input type="range" min="0.5" max="3" step="0.5" value={bubbleSize} onChange={e => handleSetBubbleSize(parseFloat(e.target.value))} className="w-full accent-blue-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                                </label>
                                <label className="flex items-center justify-between text-slate-800 dark:text-white font-bold cursor-pointer">
                                    <span>Twist Effect</span>
                                    <input type="checkbox" checked={twistEnabled} onChange={e => handleSetTwistEnabled(e.target.checked)} className="w-6 h-6 rounded-lg accent-blue-500 cursor-pointer" />
                                </label>
                            </div>
                        </div>
                    )}`;

if (code.includes(gameUIExitBtnStr)) {
    code = code.replace(gameUIExitBtnStr, gameUIExitBtnStr + inGameSettingsModal);
    console.log("Game settings modal added");
} else {
    console.log("Could not find gameUIExitBtnStr");
}

fs.writeFileSync('src/views/BubblePop.tsx', code);
console.log("UI patches applied v2");
