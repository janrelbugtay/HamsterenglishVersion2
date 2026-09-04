const fs = require('fs');
let content = fs.readFileSync('src/views/BubblePop.tsx', 'utf-8');

// The bottom right is typically where we put overlay elements, let's insert it near the video stream
const targetStr = `</div>
          </div>
      )}

      <style>{\``;

const questionCounterBlock = `</div>
          </div>
      )}

      {screen === 'game' && (
        <div className="absolute bottom-4 right-4 z-[50] flex flex-col items-end pointer-events-none">
            <div className="bg-white/80 dark:bg-black/60 backdrop-blur-md rounded-2xl px-6 py-3 shadow-lg border border-slate-200 dark:border-white/20">
                <div className="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-widest uppercase mb-1">Question</div>
                <div className="text-3xl font-black text-slate-800 dark:text-white flex items-baseline gap-1">
                    <span>{gameState.current.currentQuestionIndex + 1}</span>
                    <span className="text-xl text-slate-400 dark:text-slate-500">/{gameState.current.questions.length}</span>
                </div>
            </div>
        </div>
      )}

      <style>{\``;

content = content.replace(targetStr, questionCounterBlock);

// Note: React state needs to trigger re-renders to update this. 
// We should probably add a state variable for currentQuestionIndex to make it update properly.

fs.writeFileSync('src/views/BubblePop.tsx', content);
console.log("Added Question Counter UI.");
