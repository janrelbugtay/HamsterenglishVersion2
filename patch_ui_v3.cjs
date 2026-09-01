const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

// 1. Move Settings to Top Right
const oldTopRight = `<FullscreenButton targetId="game-container" className="absolute top-4 right-4 z-[60]" />`;
const newTopRight = `<div className="absolute top-4 right-4 z-[70] flex gap-3 pointer-events-auto">
        {screen === 'game' && (
          <button onClick={() => setShowInGameSettings(!showInGameSettings)} className="w-12 h-12 flex justify-center items-center rounded-full bg-white/20 dark:bg-black/40 hover:bg-white/30 backdrop-blur-md border border-white/30 text-slate-800 dark:text-white transition-all shadow-lg cursor-pointer">
              <Settings size={20} />
          </button>
        )}
        <FullscreenButton targetId="game-container" className="" />
      </div>
      
      {screen === 'game' && showInGameSettings && (
          <div className="absolute right-4 top-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-2 border-blue-500 rounded-3xl p-6 shadow-2xl w-80 pointer-events-auto z-[80]">
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
code = code.replace(oldTopRight, newTopRight);

// 2. Remove duplicate bottom left settings buttons
const bottomArea = `                <div className="flex justify-between items-end w-full">
                    <button onClick={() => {
                        gameState.current.isActive = false;
                        if (questionTimerRef.current) clearInterval(questionTimerRef.current);
                        setScreen('setup');
                    }} className="glass-panel px-6 py-2 rounded-full hover:bg-white/20 font-bold pointer-events-auto border border-white/20 cursor-pointer">Exit</button>
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
                    )}
                    <button onClick={() => setShowInGameSettings(!showInGameSettings)} className="glass-panel w-12 h-12 flex justify-center items-center rounded-full hover:bg-white/20 font-bold pointer-events-auto border border-white/20 cursor-pointer ml-4">
                        <Settings size={20} className="text-slate-800 dark:text-white" />
                    </button>
                    
                    {showInGameSettings && (
                        <div className="absolute left-6 bottom-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-2 border-blue-500 rounded-3xl p-6 shadow-2xl w-80 pointer-events-auto z-50">
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
const newBottomArea = `                <div className="flex justify-between items-end w-full pointer-events-auto">
                    <button onClick={() => {
                        gameState.current.isActive = false;
                        if (questionTimerRef.current) clearInterval(questionTimerRef.current);
                        setScreen('setup');
                    }} className="glass-panel px-6 py-2 rounded-full hover:bg-white/20 font-bold border border-white/20 cursor-pointer">Exit</button>`;
code = code.replace(bottomArea, newBottomArea);

fs.writeFileSync('src/views/BubblePop.tsx', code);
