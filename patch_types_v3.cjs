const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

code = code.replace(/gameState\.current = \{\s*isActive: true,\s*numPlayers: players,\s*scores: \[0, 0\],\s*currentQuestionIndex: 0,\s*combo: 0,\s*maxCombo: 0,\s*correctPops: 0,\s*wrongPops: 0,\s*questionStartTime: 0,\s*questions: q,?\s*\};/g, 
"gameState.current = { isActive: true, numPlayers: players, scores: [0, 0], currentQuestionIndex: 0, combo: 0, maxCombo: 0, correctPops: 0, wrongPops: 0, questionStartTime: 0, questions: q, speed: speed, size: bubbleSize, twist: twistEnabled };");

code = code.replace(/if \(pointers\.current\[0\]\.active\)/g, 'if (pointers.current[0].detected)');
code = code.replace(/pointers\.current\[0\]\.active = false;/g, 'pointers.current[0].detected = false;');

fs.writeFileSync('src/views/BubblePop.tsx', code);
console.log('TypeScript errors patched robustly.');
