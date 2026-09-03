const fs = require('fs');

let content = fs.readFileSync('src/views/BubblePop.tsx', 'utf-8');

// 1. Add voiceEnabled state
if (!content.includes('const [voiceEnabled')) {
    content = content.replace('const [numPlayers, setNumPlayers] = useState(1);', `const [numPlayers, setNumPlayers] = useState(1);\n  const [voiceEnabled, setVoiceEnabled] = useState(true);`);
}

// 2. Modify speakText
const oldSpeakText = `const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const cleanedText = text.replace(/_+/g, "blank");
        const utterance = new SpeechSynthesisUtterance(cleanedText);
        utterance.rate = 0.85; 
        utterance.pitch = 1.1; 
        window.speechSynthesis.speak(utterance);
    }
  };`;

const newSpeakText = `const speakText = (text: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const cleanedText = text.replace(/_+/g, "blank");
        const utterance = new SpeechSynthesisUtterance(cleanedText);
        utterance.rate = 1.0; 
        utterance.pitch = 1.0; 
        
        const voices = window.speechSynthesis.getVoices();
        const preferredVoices = voices.filter(v => 
            v.name.includes('Google') || 
            v.name.includes('Premium') || 
            v.name.includes('Natural') || 
            v.name.includes('Samantha') || 
            v.name.includes('Siri')
        );
        if (preferredVoices.length > 0) {
            const engVoices = preferredVoices.filter(v => v.lang.startsWith('en'));
            if (engVoices.length > 0) utterance.voice = engVoices[0];
            else utterance.voice = preferredVoices[0];
        }

        window.speechSynthesis.speak(utterance);
    }
  };`;
content = content.replace(oldSpeakText, newSpeakText);

// 3. Add Voice toggle UI in setup screen
const oldStartButton = `                    <button
                        onClick={() => startGameMode(numPlayers)}
                        className="px-12 py-5 bg-gradient-to-r from-blue-500 to-sky-400 text-white font-black text-2xl rounded-full shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95 transition-all w-full max-w-md"
                    >
                        START GAME
                    </button>`;
const newStartButton = `                    <div className="flex items-center justify-between w-full max-w-md mb-6 bg-black/20 p-4 rounded-2xl border border-white/20 cursor-pointer hover:bg-black/30 transition-colors" onClick={() => setVoiceEnabled(!voiceEnabled)}>
                        <span className="text-white font-bold text-lg">AI Voice Narration</span>
                        <div className={\`w-14 h-8 flex items-center rounded-full p-1 transition-colors \${voiceEnabled ? 'bg-blue-500' : 'bg-slate-600'}\`}>
                            <div className={\`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform \${voiceEnabled ? 'translate-x-6' : 'translate-x-0'}\`}></div>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => startGameMode(numPlayers)}
                        className="px-12 py-5 bg-gradient-to-r from-blue-500 to-sky-400 text-white font-black text-2xl rounded-full shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95 transition-all w-full max-w-md"
                    >
                        START GAME
                    </button>`;
content = content.replace(oldStartButton, newStartButton);

// 4. Update scoring (+5 for correct, -5 for wrong)
const oldPointsLogic = `let points = 10 * Math.min(gameState.current.combo, 4);
            const timeTaken = Date.now() - gameState.current.questionStartTime;
            if (timeTaken < 2000) { 
                points += 15;
                const w = containerRef.current?.clientWidth || 800;
                const h = containerRef.current?.clientHeight || 600;
                graphicsState.current.floatingTexts.push(new FloatingText(w/2, h/2 - 100, "FAST HANDS!", '#fbbf24', true));
            }`;
const newPointsLogic = `let points = 5; // Fixed 5 points per correct answer`;
content = content.replace(oldPointsLogic, newPointsLogic);

const oldPenaltyLogic = `const penalty = 0;
            // No penalty, just pop it and lose combo.
            setScores([...gameState.current.scores]);`;
const newPenaltyLogic = `const penalty = -5; // -5 points for incorrect answer
            gameState.current.scores[playerIndex] += penalty;
            setScores([...gameState.current.scores]);`;
content = content.replace(oldPenaltyLogic, newPenaltyLogic);

fs.writeFileSync('src/views/BubblePop.tsx', content);
console.log("Patched successfully!");
