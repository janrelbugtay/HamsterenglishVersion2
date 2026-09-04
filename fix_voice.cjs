const fs = require('fs');
let content = fs.readFileSync('src/views/BubblePop.tsx', 'utf-8');

// 1. Add voiceEnabled state
const stateInsert = `const [twistEnabled, setTwistEnabled] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const handleSetVoiceEnabled = (val: boolean) => { setVoiceEnabled(val); gameState.current.voice = val; };`;
content = content.replace('const [twistEnabled, setTwistEnabled] = useState(false);', stateInsert);

const gameStateInsert = `size: 1,
    twist: false,
    voice: true
  });`;
content = content.replace(/size: 1,\s*twist: false\s*\}\);/, gameStateInsert);

// 2. Add volume-2/volume-x icons for the UI
if (!content.includes('Volume2,')) {
    content = content.replace('Settings, Copy, Flag } from "lucide-react";', 'Settings, Copy, Flag, Volume2, VolumeX } from "lucide-react";');
}

// 3. Update speakText function
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
    if (!gameState.current.voice) return;
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const cleanedText = text.replace(/_+/g, "blank");
        const utterance = new SpeechSynthesisUtterance(cleanedText);
        
        // Try to find a natural female voice
        const voices = window.speechSynthesis.getVoices();
        const femaleVoices = voices.filter(v => 
            v.name.includes('Google US English') || 
            v.name.includes('Samantha') || 
            v.name.includes('Victoria') ||
            v.name.includes('Karen') ||
            v.name.includes('Tessa') ||
            (v.name.includes('Female') && v.lang.startsWith('en')) ||
            (v.name.includes('Zira') && v.lang.startsWith('en'))
        );
        
        if (femaleVoices.length > 0) {
            utterance.voice = femaleVoices[0];
        }
        
        utterance.rate = 0.95; 
        utterance.pitch = 1.15; 
        window.speechSynthesis.speak(utterance);
    }
  };`;
content = content.replace(oldSpeakText, newSpeakText);

// 4. Update continueStartGame to include voice state
const oldContinueState = `speed: speed,
        size: bubbleSize,
        twist: twistEnabled
    };`;
const newContinueState = `speed: speed,
        size: bubbleSize,
        twist: twistEnabled,
        voice: voiceEnabled
    };`;
content = content.replace(oldContinueState, newContinueState);

// 5. Add Voice toggle to Setup Lobby UI
const setupLobbyInsertTarget = `<div className="flex justify-between items-center text-white">
                            <span className="font-bold">Twist Mode</span>
                            <button onClick={() => handleSetTwistEnabled(!twistEnabled)} className={\`w-12 h-6 rounded-full transition-colors relative \${twistEnabled ? 'bg-blue-500' : 'bg-white/30'}\`}>
                                <div className={\`w-4 h-4 rounded-full bg-white absolute top-1 transition-all \${twistEnabled ? 'left-7' : 'left-1'}\`}></div>
                            </button>
                        </div>`;

const setupLobbyInsertReplacement = `${setupLobbyInsertTarget}
                        <div className="flex justify-between items-center text-white">
                            <span className="font-bold">Voice Narration</span>
                            <button onClick={() => handleSetVoiceEnabled(!voiceEnabled)} className={\`w-12 h-6 rounded-full transition-colors relative \${voiceEnabled ? 'bg-blue-500' : 'bg-white/30'}\`}>
                                <div className={\`w-4 h-4 rounded-full bg-white absolute top-1 transition-all \${voiceEnabled ? 'left-7' : 'left-1'}\`}></div>
                            </button>
                        </div>`;
content = content.replace(setupLobbyInsertTarget, setupLobbyInsertReplacement);

// 6. Add Voice toggle to In-Game Settings UI
const inGameInsertTarget = `<div className="flex flex-col gap-2 text-slate-800 dark:text-white font-bold">
                        <div className="flex justify-between items-center">
                            <span>Twist Mode</span>
                            <button onClick={() => handleSetTwistEnabled(!twistEnabled)} className={\`w-12 h-6 rounded-full transition-colors relative \${twistEnabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}\`}>
                                <div className={\`w-4 h-4 rounded-full bg-white absolute top-1 transition-all \${twistEnabled ? 'left-7' : 'left-1'}\`}></div>
                            </button>
                        </div>
                  </div>`;

const inGameInsertReplacement = `${inGameInsertTarget}
                  <div className="flex flex-col gap-2 text-slate-800 dark:text-white font-bold">
                        <div className="flex justify-between items-center">
                            <span>Voice Narration</span>
                            <button onClick={() => handleSetVoiceEnabled(!voiceEnabled)} className={\`w-12 h-6 rounded-full transition-colors relative \${voiceEnabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}\`}>
                                <div className={\`w-4 h-4 rounded-full bg-white absolute top-1 transition-all \${voiceEnabled ? 'left-7' : 'left-1'}\`}></div>
                            </button>
                        </div>
                  </div>`;
content = content.replace(inGameInsertTarget, inGameInsertReplacement);

fs.writeFileSync('src/views/BubblePop.tsx', content);
console.log("Updated voice functionality.");
