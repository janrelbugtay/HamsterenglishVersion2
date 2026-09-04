const fs = require('fs');
let content = fs.readFileSync('src/views/BubblePop.tsx', 'utf-8');

const target = content.substring(
    content.indexOf("{screen === 'game' && showInGameSettings && ("),
    content.indexOf("      <style>{`")
);

const newModal = `{screen === 'game' && showInGameSettings && (
          <div className="absolute right-4 top-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-2 border-blue-500 rounded-3xl p-6 shadow-2xl w-80 pointer-events-auto z-[80]">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Game Settings</h3>
                  <button onClick={() => setShowInGameSettings(false)} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white transition-colors cursor-pointer">
                      <X size={16} />
                  </button>
              </div>
              <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2 text-slate-800 dark:text-white font-bold">
                      <div className="flex justify-between items-center">
                          <span>Bubble Speed</span>
                          <div className="flex gap-2">
                                <button onClick={() => handleSetSpeed(0.5)} className={\`px-3 py-1 rounded-full text-sm font-bold transition-colors \${speed === 0.5 ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}\`}>Slow</button>
                                <button onClick={() => handleSetSpeed(1)} className={\`px-3 py-1 rounded-full text-sm font-bold transition-colors \${speed === 1 ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}\`}>Normal</button>
                                <button onClick={() => handleSetSpeed(1.5)} className={\`px-3 py-1 rounded-full text-sm font-bold transition-colors \${speed === 1.5 ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}\`}>Fast</button>
                          </div>
                      </div>
                  </div>
                  <div className="flex flex-col gap-2 text-slate-800 dark:text-white font-bold">
                      <div className="flex justify-between items-center">
                          <span>Bubble Size</span>
                          <div className="flex gap-2">
                                <button onClick={() => handleSetBubbleSize(0.7)} className={\`px-3 py-1 rounded-full text-sm font-bold transition-colors \${bubbleSize === 0.7 ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}\`}>Small</button>
                                <button onClick={() => handleSetBubbleSize(1)} className={\`px-3 py-1 rounded-full text-sm font-bold transition-colors \${bubbleSize === 1 ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}\`}>Normal</button>
                                <button onClick={() => handleSetBubbleSize(1.5)} className={\`px-3 py-1 rounded-full text-sm font-bold transition-colors \${bubbleSize === 1.5 ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}\`}>Big</button>
                          </div>
                      </div>
                  </div>
                  <div className="flex flex-col gap-2 text-slate-800 dark:text-white font-bold">
                        <div className="flex justify-between items-center">
                            <span>Twist Mode</span>
                            <button onClick={() => handleSetTwistEnabled(!twistEnabled)} className={\`w-12 h-6 rounded-full transition-colors relative \${twistEnabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}\`}>
                                <div className={\`w-4 h-4 rounded-full bg-white absolute top-1 transition-all \${twistEnabled ? 'left-7' : 'left-1'}\`}></div>
                            </button>
                        </div>
                  </div>
              </div>
          </div>
      )}

`;

content = content.replace(target, newModal);
fs.writeFileSync('src/views/BubblePop.tsx', content);
console.log("Fixed modal block.");
