const fs = require('fs');
let content = fs.readFileSync('src/views/YogaQuiz.tsx', 'utf8');

// 1. Add states to YogaGame
const stateHook = `const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');`;
const newStates = `const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
    const [showSettings, setShowSettings] = useState(false);
    const [uiScale, setUiScale] = useState<'small' | 'medium' | 'big'>('medium');
    const [autoAdvanceDelay, setAutoAdvanceDelay] = useState<'manual' | 3 | 5 | 10>(3);`;
content = content.replace(stateHook, newStates);

// 2. Adjust styling classes
const logicTop = `    const toggleFullscreen = () => {`;
const classLogic = `    let questionTextClass = "text-4xl md:text-6xl xl:text-7xl";
    let optionTextClass = "text-lg md:text-2xl xl:text-4xl";
    let playerTextClass = "text-xl md:text-2xl";
    let optionEmojiClass = "text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[7rem]";

    if (uiScale === 'small') {
        questionTextClass = "text-2xl md:text-4xl xl:text-5xl";
        optionTextClass = "text-base md:text-xl xl:text-2xl";
        playerTextClass = "text-base md:text-lg";
        optionEmojiClass = "text-[2rem] sm:text-[3rem] md:text-[4rem] lg:text-[5rem]";
    } else if (uiScale === 'big') {
        questionTextClass = "text-6xl md:text-8xl xl:text-9xl";
        optionTextClass = "text-2xl md:text-4xl xl:text-6xl";
        playerTextClass = "text-3xl md:text-4xl";
        optionEmojiClass = "text-[4rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem]";
    }

    const toggleFullscreen = () => {`;
content = content.replace(logicTop, classLogic);

// 3. Update handleAnswer
const handleAnswerOld = `    const handleAnswer = (index: number, isCorrect: boolean) => {
        if (isAnswering) return;
        setIsAnswering(true);
        setSelectedOption(index);
        
        if (isCorrect) {
            playSound('correct');
            setShowConfetti(true);
        } else {
            playSound('incorrect');
        }

        let timeLeft = 3;
        setTimer(timeLeft);
        
        const countdownInterval = setInterval(() => {
            timeLeft -= 1;
            if (timeLeft > 0) {
                setTimer(timeLeft);
            } else {
                clearInterval(countdownInterval);
                setTimer(null);
                setShowConfetti(false);
                const nextIdx = currentIdx + 1;
                if (nextIdx < quiz.questions.length) {
                    setCurrentIdx(nextIdx);
                    loadQuestion(nextIdx);
                } else {
                    setGameState('end');
                }
            }
        }, 1000);
    };`;
    
const handleAnswerNew = `    const handleAnswer = (index: number, isCorrect: boolean) => {
        if (isAnswering) return;
        setIsAnswering(true);
        setSelectedOption(index);
        
        if (isCorrect) {
            playSound('correct');
            setShowConfetti(true);
        } else {
            playSound('incorrect');
        }

        if (autoAdvanceDelay === 'manual') {
            return;
        }

        let timeLeft = autoAdvanceDelay;
        setTimer(timeLeft);
        
        const countdownInterval = setInterval(() => {
            timeLeft -= 1;
            if (timeLeft > 0) {
                setTimer(timeLeft);
            } else {
                clearInterval(countdownInterval);
                setTimer(null);
                setShowConfetti(false);
                const nextIdx = currentIdx + 1;
                if (nextIdx < quiz.questions.length) {
                    setCurrentIdx(nextIdx);
                    loadQuestion(nextIdx);
                } else {
                    setGameState('end');
                }
            }
        }, 1000);
    };

    const handleNextClick = () => {
        if (!isAnswering) return;
        setTimer(null);
        setShowConfetti(false);
        const nextIdx = currentIdx + 1;
        if (nextIdx < quiz.questions.length) {
            setCurrentIdx(nextIdx);
            loadQuestion(nextIdx);
        } else {
            setGameState('end');
        }
    };`;
content = content.replace(handleAnswerOld, handleAnswerNew);

// 4. Update Settings onClick
content = content.replace(
    `<button onClick={() => {}} className="w-[52px] h-[52px] md:w-[60px] md:h-[60px] text-teal-600 hover:bg-teal-200 rounded-2xl transition-colors font-bold cursor-pointer bg-teal-100 shadow-sm flex items-center justify-center" title="Settings">`,
    `<button onClick={() => setShowSettings(true)} className="w-[52px] h-[52px] md:w-[60px] md:h-[60px] text-teal-600 hover:bg-teal-200 rounded-2xl transition-colors font-bold cursor-pointer bg-teal-100 shadow-sm flex items-center justify-center" title="Settings">`
);

// 5. Apply the classes to UI
// Player name class replacement:
content = content.replace(
    `<span className="text-xl md:text-2xl">{team.name}</span>`,
    `<span className={playerTextClass}>{team.name}</span>`
);

// Question class replacement:
// Currently: <h2 className="text-4xl md:text-6xl xl:text-7xl font-black text-indigo-900 bg-indigo-50 py-12 md:py-20 px-10 md:px-20 rounded-[3rem] border-8 border-indigo-100 shadow-inner inline-block min-w-[60%] max-w-[95%] leading-tight">
content = content.replace(
    `text-4xl md:text-6xl xl:text-7xl font-black`,
    `\${questionTextClass} font-black`
);
content = content.replace(
    `<h2 className="$\{questionTextClass\} font-black text-indigo-900 bg-indigo-50 py-12 md:py-20 px-10 md:px-20 rounded-[3rem] border-8 border-indigo-100 shadow-inner inline-block min-w-[60%] max-w-[95%] leading-tight">`,
    `<h2 className={\`\${questionTextClass} font-black text-indigo-900 bg-indigo-50 py-12 md:py-20 px-10 md:px-20 rounded-[3rem] border-8 border-indigo-100 shadow-inner inline-block min-w-[60%] max-w-[95%] leading-tight\`}>`
);

// Options Emoji replacement:
// Currently: <span className="text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[7rem] leading-none mb-2 md:mb-6 select-none group-hover:scale-110 transition-transform duration-300">
content = content.replace(
    `text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[7rem] leading-none mb-2 md:mb-6 select-none group-hover:scale-110 transition-transform duration-300`,
    `\${optionEmojiClass} leading-none mb-2 md:mb-6 select-none group-hover:scale-110 transition-transform duration-300`
);
content = content.replace(
    `<span className="$\{optionEmojiClass\} leading-none mb-2 md:mb-6 select-none group-hover:scale-110 transition-transform duration-300">`,
    `<span className={\`\${optionEmojiClass} leading-none mb-2 md:mb-6 select-none group-hover:scale-110 transition-transform duration-300\`}>`
);

// Options Text replacement:
// Currently: <span className="text-lg md:text-2xl xl:text-4xl text-inherit drop-shadow-sm font-black whitespace-pre-wrap px-2 text-center select-none uppercase tracking-wide">
content = content.replace(
    `text-lg md:text-2xl xl:text-4xl text-inherit drop-shadow-sm font-black`,
    `\${optionTextClass} text-inherit drop-shadow-sm font-black`
);
content = content.replace(
    `<span className="$\{optionTextClass\} text-inherit drop-shadow-sm font-black whitespace-pre-wrap px-2 text-center select-none uppercase tracking-wide">`,
    `<span className={\`\${optionTextClass} text-inherit drop-shadow-sm font-black whitespace-pre-wrap px-2 text-center select-none uppercase tracking-wide\`}>`
);

// 6. Add manual next button and settings overlay
const overlayBlock = `          <div className={\`bg-white shadow-2xl w-full overflow-hidden border-8 border-teal-500 relative flex flex-col \${isFullscreen ? 'h-full rounded-none border-0' : 'min-h-[75vh] rounded-[3rem]'}\`}>`;
const settingsOverlay = `          {showSettings && (
              <div className="fixed inset-0 z-[150] flex items-center justify-center bg-teal-900/40 backdrop-blur-md p-4 animate-fade-in">
                  <div className="bg-white rounded-[3rem] p-8 md:p-12 max-w-2xl w-full shadow-2xl relative border-8 border-teal-100">
                      <button onClick={() => setShowSettings(false)} className="absolute top-6 right-8 text-pink-400 hover:text-pink-500 transition-colors cursor-pointer">
                          <X size={48} strokeWidth={4} />
                      </button>
                      <h2 className="text-4xl md:text-5xl font-black text-teal-800 mb-8 tracking-tight">⚙️ Settings</h2>
                      
                      <div className="space-y-8">
                          <div>
                              <label className="block text-teal-700 font-bold mb-4 text-2xl">Interface Scale</label>
                              <div className="flex gap-4">
                                  {(['small', 'medium', 'big'] as const).map((size) => (
                                      <button 
                                          key={size}
                                          onClick={() => setUiScale(size)}
                                          className={\`flex-1 py-4 rounded-2xl font-black text-xl md:text-2xl capitalize transition-all border-4 shadow-sm cursor-pointer \${uiScale === size ? 'bg-teal-500 text-white border-teal-600 scale-105' : 'bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100 hover:scale-105'}\`}
                                      >
                                          {size}
                                      </button>
                                  ))}
                              </div>
                          </div>

                          <div>
                              <label className="block text-teal-700 font-bold mb-4 text-2xl">Auto-advance Delay</label>
                              <div className="grid grid-cols-2 gap-4">
                                  {([3, 5, 10, 'manual'] as const).map((delay) => (
                                      <button 
                                          key={delay}
                                          onClick={() => setAutoAdvanceDelay(delay)}
                                          className={\`py-4 rounded-2xl font-black text-xl md:text-2xl transition-all border-4 shadow-sm cursor-pointer \${autoAdvanceDelay === delay ? 'bg-indigo-500 text-white border-indigo-600 scale-105' : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100 hover:scale-105'}\`}
                                      >
                                          {delay === 'manual' ? 'When clicked' : \`\${delay} Seconds\`}
                                      </button>
                                  ))}
                              </div>
                          </div>
                      </div>
                      
                      <button onClick={() => setShowSettings(false)} className="mt-10 w-full bg-teal-500 hover:bg-teal-600 text-white font-black text-2xl py-5 rounded-full shadow-[0_6px_0_#0f766e] active:shadow-none active:translate-y-2 transition-all cursor-pointer">
                          Done
                      </button>
                  </div>
              </div>
          )}

          {isAnswering && autoAdvanceDelay === 'manual' && (
              <div className="absolute bottom-12 left-0 right-0 z-[60] flex justify-center pointer-events-none animate-fade-in">
                  <button 
                    onClick={handleNextClick}
                    className="pointer-events-auto bg-indigo-500 hover:bg-indigo-600 text-white text-4xl md:text-5xl font-black py-6 px-16 rounded-[3rem] shadow-[0_10px_0_#4338ca] active:shadow-none active:translate-y-3 transition-all animate-bounce cursor-pointer"
                  >
                      NEXT ➡️
                  </button>
              </div>
          )}
          
          <div className={\`bg-white shadow-2xl w-full overflow-hidden border-8 border-teal-500 relative flex flex-col \${isFullscreen ? 'h-full rounded-none border-0' : 'min-h-[75vh] rounded-[3rem]'}\`}>`;

content = content.replace(overlayBlock, settingsOverlay);

fs.writeFileSync('src/views/YogaQuiz.tsx', content);
console.log("Patched YogaQuiz.tsx successfully.");
