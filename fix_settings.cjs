const fs = require('fs');

let content = fs.readFileSync('src/views/BubblePop.tsx', 'utf-8');

const targetStr = `<div className="flex flex-col gap-6">
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
              </div>`;

const newStr = `<div className="flex flex-col gap-6">
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
              </div>`;

if (content.includes("<span>Bubble Speed</span>")) {
    const p1 = content.indexOf('<div className="flex flex-col gap-6">\n                  <label className="flex flex-col gap-2 text-slate-800 dark:text-white font-bold">\n                      <div className="flex justify-between">');
    const p2 = content.indexOf('</label>\n              </div>\n          </div>\n      )}');
    if(p1 !== -1 && p2 !== -1) {
        content = content.substring(0, p1) + newStr + content.substring(p2 + 8);
        fs.writeFileSync('src/views/BubblePop.tsx', content);
        console.log("Updated in-game settings modal.");
    } else {
        console.log("Could not find the exact bounds. Trying regex replace...");
        content = content.replace(targetStr, newStr);
        fs.writeFileSync('src/views/BubblePop.tsx', content);
    }
}
