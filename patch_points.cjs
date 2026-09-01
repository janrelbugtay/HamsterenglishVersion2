const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

const oldPoints = `            let points = 10 * Math.min(gameState.current.combo, 4);
            const timeTaken = Date.now() - gameState.current.questionStartTime;
            if (timeTaken < 2000) { 
                points += 15;
                const w = containerRef.current?.clientWidth || 800;
                const h = containerRef.current?.clientHeight || 600;
                graphicsState.current.floatingTexts.push(new FloatingText(w/2, h/2 - 100, "SPEED BONUS!", '#facc15', true));
            }
            
            gameState.current.scores[playerIndex] += points;`;

const newPoints = `            const points = 1;
            gameState.current.scores[playerIndex] += points;`;

code = code.replace(oldPoints, newPoints);

const oldPenalty = `            const penalty = 5;
            gameState.current.scores[playerIndex] = Math.max(0, gameState.current.scores[playerIndex] - penalty);
            setScores([...gameState.current.scores]);
            
            graphicsState.current.floatingTexts.push(new FloatingText(bubble.x, bubble.y, \`-\${penalty}\`, '#ef4444'));`;

const newPenalty = `            const penalty = 0;
            // No penalty, just pop it and lose combo.
            setScores([...gameState.current.scores]);
            
            graphicsState.current.floatingTexts.push(new FloatingText(bubble.x, bubble.y, \`X\`, '#ef4444'));`;

code = code.replace(oldPenalty, newPenalty);

fs.writeFileSync('src/views/BubblePop.tsx', code);
