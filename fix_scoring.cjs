const fs = require('fs');
let content = fs.readFileSync('src/views/BubblePop.tsx', 'utf-8');

// Update correct scoring logic
const oldCorrectScoring = `let points = 10 * Math.min(gameState.current.combo, 4);
            const timeTaken = Date.now() - gameState.current.questionStartTime;
            if (timeTaken < 2000) { 
                points += 15;
                const w = containerRef.current?.clientWidth || 800;
                const h = containerRef.current?.clientHeight || 600;
                graphicsState.current.floatingTexts.push(new FloatingText(w/2, h/2 - 100, "FAST HANDS!", '#fbbf24', true));
            }
            
            gameState.current.scores[playerIndex] += points;
            
            graphicsState.current.floatingTexts.push(new FloatingText(bubble.x, bubble.y, \`+\${points}\`, '#4ade80'));`;

const newCorrectScoring = `let points = 5;
            gameState.current.scores[playerIndex] += points;
            
            graphicsState.current.floatingTexts.push(new FloatingText(bubble.x, bubble.y, \`+5\`, '#4ade80', true));`;

content = content.replace(oldCorrectScoring, newCorrectScoring);

// Update incorrect scoring logic
const oldIncorrectScoring = `const penalty = 0;
            // No penalty, just pop it and lose combo.
            setScores([...gameState.current.scores]);
            
            graphicsState.current.floatingTexts.push(new FloatingText(bubble.x, bubble.y, \`X\`, '#ef4444'));`;

const newIncorrectScoring = `const penalty = 5;
            gameState.current.scores[playerIndex] = Math.max(0, gameState.current.scores[playerIndex] - penalty);
            setScores([...gameState.current.scores]);
            
            graphicsState.current.floatingTexts.push(new FloatingText(bubble.x, bubble.y, \`-5\`, '#ef4444', true));`;

content = content.replace(oldIncorrectScoring, newIncorrectScoring);

// Increase size of floating texts when isCombo is true (we repurposed it for big score texts)
const oldFloatingText = `this.size = isCombo ? 60 : 40;`;
const newFloatingText = `this.size = isCombo ? 100 : 40;`;
content = content.replace(oldFloatingText, newFloatingText);


fs.writeFileSync('src/views/BubblePop.tsx', content);
console.log("Scoring updated.");
