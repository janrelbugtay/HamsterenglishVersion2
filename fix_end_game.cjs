const fs = require('fs');

let content = fs.readFileSync('src/views/BubblePop.tsx', 'utf-8');

// 1. Add Flag to imports
if (!content.includes('Flag,')) {
    content = content.replace('Settings, Copy } from "lucide-react";', 'Settings, Copy, Flag } from "lucide-react";');
}

// 2. Add Flag button next to Settings button
const targetButtonBlock = `{screen === 'game' && (
          <button onClick={() => setShowInGameSettings(!showInGameSettings)} className="w-12 h-12 flex justify-center items-center rounded-full bg-white/20 dark:bg-black/40 hover:bg-white/30 backdrop-blur-md border border-white/30 text-slate-800 dark:text-white transition-all shadow-lg cursor-pointer">
              <Settings size={20} />
          </button>
        )}`;

const replacementButtonBlock = `{screen === 'game' && (
          <>
            <button onClick={() => showResults()} className="w-12 h-12 flex justify-center items-center rounded-full bg-red-500/20 dark:bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md border border-red-500/50 text-red-600 dark:text-red-400 transition-all shadow-lg cursor-pointer" title="End Game Now">
                <Flag size={20} />
            </button>
            <button onClick={() => setShowInGameSettings(!showInGameSettings)} className="w-12 h-12 flex justify-center items-center rounded-full bg-white/20 dark:bg-black/40 hover:bg-white/30 backdrop-blur-md border border-white/30 text-slate-800 dark:text-white transition-all shadow-lg cursor-pointer">
                <Settings size={20} />
            </button>
          </>
        )}`;

content = content.replace(targetButtonBlock, replacementButtonBlock);

// Also let's check results text
// The user asks to "announce the winner example team 1 and show points in each team"
// Currently it is "P1 Wins!" or whatever the player names are.
// p1Name defaults to "P1" but we can replace it with "Team 1" if it's default.
content = content.replace('const [p1Name, setP1Name] = useState("P1");', 'const [p1Name, setP1Name] = useState("Team 1");');
content = content.replace('const [p2Name, setP2Name] = useState("P2");', 'const [p2Name, setP2Name] = useState("Team 2");');
content = content.replace('placeholder="Player 1 Name"', 'placeholder="Team 1 Name"');
content = content.replace('placeholder="Player 2 Name"', 'placeholder="Team 2 Name"');

fs.writeFileSync('src/views/BubblePop.tsx', content);
console.log("Updated BubblePop.tsx with End Game button and Team names");
