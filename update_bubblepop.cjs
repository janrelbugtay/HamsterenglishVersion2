const fs = require('fs');

let content = fs.readFileSync('src/views/BubblePop.tsx', 'utf-8');

content = content.replace(
    /<h2 className="text-6xl sm:text-7xl font-black mb-12 text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-100 drop-shadow-\[0_4px_4px_rgba\(0,0,0,0\.1\)\] text-center tracking-tight" style=\{\{ WebkitTextStroke: '1px rgba\\(255,255,255,0\\.5\\)' \}\}>\s*Bubble Pop\s*<\/h2>/g,
    `<h2 className="text-6xl sm:text-7xl font-black mb-12 text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-100 drop-shadow-[0_4px_4px_rgba(0,0,0,0.1)] text-center tracking-tight" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>
                    Game Lobby
                </h2>`
);

const settingsBlock = `
                    <div className="bg-black/20 p-4 rounded-2xl border border-white/20 flex flex-col gap-4 mt-2">
                        <div className="flex justify-between items-center text-white">
                            <span className="font-bold">Speed</span>
                            <div className="flex gap-2">
                                <button onClick={() => handleSetSpeed(0.5)} className={\`px-3 py-1 rounded-full text-sm font-bold transition-colors \${speed === 0.5 ? 'bg-blue-500' : 'bg-white/20 hover:bg-white/30'}\`}>Slow</button>
                                <button onClick={() => handleSetSpeed(1)} className={\`px-3 py-1 rounded-full text-sm font-bold transition-colors \${speed === 1 ? 'bg-blue-500' : 'bg-white/20 hover:bg-white/30'}\`}>Normal</button>
                                <button onClick={() => handleSetSpeed(1.5)} className={\`px-3 py-1 rounded-full text-sm font-bold transition-colors \${speed === 1.5 ? 'bg-blue-500' : 'bg-white/20 hover:bg-white/30'}\`}>Fast</button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-white">
                            <span className="font-bold">Bubble Size</span>
                            <div className="flex gap-2">
                                <button onClick={() => handleSetBubbleSize(1.5)} className={\`px-3 py-1 rounded-full text-sm font-bold transition-colors \${bubbleSize === 1.5 ? 'bg-blue-500' : 'bg-white/20 hover:bg-white/30'}\`}>Big</button>
                                <button onClick={() => handleSetBubbleSize(1)} className={\`px-3 py-1 rounded-full text-sm font-bold transition-colors \${bubbleSize === 1 ? 'bg-blue-500' : 'bg-white/20 hover:bg-white/30'}\`}>Normal</button>
                                <button onClick={() => handleSetBubbleSize(0.7)} className={\`px-3 py-1 rounded-full text-sm font-bold transition-colors \${bubbleSize === 0.7 ? 'bg-blue-500' : 'bg-white/20 hover:bg-white/30'}\`}>Small</button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-white">
                            <span className="font-bold">Twist Mode</span>
                            <button onClick={() => handleSetTwistEnabled(!twistEnabled)} className={\`w-12 h-6 rounded-full transition-colors relative \${twistEnabled ? 'bg-blue-500' : 'bg-white/30'}\`}>
                                <div className={\`w-4 h-4 rounded-full bg-white absolute top-1 transition-all \${twistEnabled ? 'left-7' : 'left-1'}\`}></div>
                            </button>
                        </div>
                    </div>
`;

content = content.replace(
    /(<input type="text" value=\{p2Name\}[^>]*>\s*<\/div>\s*)\}(\s*<\/div>)/g,
    `$1}$2${settingsBlock}`
);

// If it only has 1 player right now or we missed it:
// Let's replace the end of the flex-col gap-4 mb-10 div
if (content.includes("Player 2 Name")) {
  const parts = content.split('placeholder="Player 2 Name" />\n                            </div>\n                        )}\n                    </div>');
  if (parts.length > 1) {
    content = parts[0] + 'placeholder="Player 2 Name" />\n                            </div>\n                        )}\n' + settingsBlock + '                    </div>' + parts[1];
  }
}

fs.writeFileSync('src/views/BubblePop.tsx', content);
console.log("Updated BubblePop.tsx");
