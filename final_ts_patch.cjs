const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

// 1. Fix gameState initial properties
const gameOrig = `gameState.current = {
        isActive: true,
        numPlayers: players,
        scores: [0, 0],
        currentQuestionIndex: 0,
        combo: 0,
        maxCombo: 0,
        correctPops: 0,
        wrongPops: 0,
        questionStartTime: 0,
        questions: q,
    };`;
const gameNew = `gameState.current = {
        isActive: true,
        numPlayers: players,
        scores: [0, 0],
        currentQuestionIndex: 0,
        combo: 0,
        maxCombo: 0,
        correctPops: 0,
        wrongPops: 0,
        questionStartTime: 0,
        questions: q,
        speed: speed,
        size: bubbleSize,
        twist: twistEnabled
    };`;
code = code.replace(gameOrig, gameNew);

// 2. Fix the mouse event handlers
code = code.replace(/pointers\.current\[0\]\.active = true;/g, 'pointers.current[0].detected = true; pointers.current[0].targetX = mx; pointers.current[0].targetY = my;');
code = code.replace(/pointers\.current\[isLeft \? 0 : 1\]\.active = true;/g, 'pointers.current[isLeft ? 0 : 1].detected = true; pointers.current[isLeft ? 0 : 1].targetX = mx; pointers.current[isLeft ? 0 : 1].targetY = my;');
code = code.replace(/pointers\.current\[isLeft \? 0 : 1\]\.active/g, 'pointers.current[isLeft ? 0 : 1].detected'); // just in case

fs.writeFileSync('src/views/BubblePop.tsx', code);
