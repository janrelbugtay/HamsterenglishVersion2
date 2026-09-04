const fs = require('fs');
let content = fs.readFileSync('src/views/BubblePop.tsx', 'utf-8');

const oldLobbyButtons = `<button onClick={() => handleSetBubbleSize(2)} className={\`px-3 py-1 rounded-full text-sm font-bold transition-colors \${bubbleSize === 2 ? 'bg-blue-500' : 'bg-white/20 hover:bg-white/30'}\`}>Big</button>
                                <button onClick={() => handleSetBubbleSize(1)} className={\`px-3 py-1 rounded-full text-sm font-bold transition-colors \${bubbleSize === 1 ? 'bg-blue-500' : 'bg-white/20 hover:bg-white/30'}\`}>Normal</button>
                                <button onClick={() => handleSetBubbleSize(0.5)} className={\`px-3 py-1 rounded-full text-sm font-bold transition-colors \${bubbleSize === 0.5 ? 'bg-blue-500' : 'bg-white/20 hover:bg-white/30'}\`}>Small</button>`;

const newLobbyButtons = `<button onClick={() => handleSetBubbleSize(0.5)} className={\`px-3 py-1 rounded-full text-sm font-bold transition-colors \${bubbleSize === 0.5 ? 'bg-blue-500' : 'bg-white/20 hover:bg-white/30'}\`}>Small</button>
                                <button onClick={() => handleSetBubbleSize(1)} className={\`px-3 py-1 rounded-full text-sm font-bold transition-colors \${bubbleSize === 1 ? 'bg-blue-500' : 'bg-white/20 hover:bg-white/30'}\`}>Normal</button>
                                <button onClick={() => handleSetBubbleSize(2)} className={\`px-3 py-1 rounded-full text-sm font-bold transition-colors \${bubbleSize === 2 ? 'bg-blue-500' : 'bg-white/20 hover:bg-white/30'}\`}>Big</button>`;

content = content.replace(oldLobbyButtons, newLobbyButtons);
fs.writeFileSync('src/views/BubblePop.tsx', content);
