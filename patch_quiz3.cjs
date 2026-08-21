const fs = require('fs');
let file = fs.readFileSync('src/views/HamsterPopQuiz.tsx', 'utf8');

file = file.replace('function ConfigView({ onStartLesson }: any) {', 'function ConfigView({ onStartLesson, isGenerating }: any) {');

const oldButton = `        <button 
          onClick={() => onStartLesson({ level, selectedTypes, frequency, topic, className, folder })}
          className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 text-2xl font-black px-12 py-5 rounded-3xl shadow-[0_8px_0_#ca8a04] hover:shadow-[0_4px_0_#ca8a04] hover:translate-y-1 transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
        >
          <Play fill="currentColor" size={28} /> Start Hamster Pop Quiz!
        </button>`;

const newButton = `        <button 
          onClick={() => onStartLesson({ level, selectedTypes, frequency, topic, className, folder })}
          disabled={isGenerating}
          className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-yellow-900 text-2xl font-black px-12 py-5 rounded-3xl shadow-[0_8px_0_#ca8a04] hover:shadow-[0_4px_0_#ca8a04] hover:translate-y-1 transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
        >
          {isGenerating ? (
            <><Loader2 className="animate-spin" size={28} /> Generating Quiz...</>
          ) : (
            <><Play fill="currentColor" size={28} /> Start Hamster Pop Quiz!</>
          )}
        </button>`;

file = file.replace(oldButton, newButton);
fs.writeFileSync('src/views/HamsterPopQuiz.tsx', file);
