const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

code = code.replace(
    /    gameState\.current = \{\n        isActive: true,[\s\S]*?startQuestion\(\);\n    \}, 100\);/m,
    `    continueStartGame(players);
  };

  const continueStartGame = (players: number = numPlayers) => {
    gameState.current = {
        isActive: true,
        numPlayers: players,
        scores: [0, 0],
        currentQuestionIndex: 0,
        combo: 0,
        maxCombo: 0,
        correctPops: 0,
        wrongPops: 0,
        questionStartTime: 0,
        questions: activeQuiz ? [...activeQuiz.questions].sort(() => 0.5 - Math.random()).slice(0, Math.min(5, activeQuiz.questions.length)) : []
    };
    
    setScores([0, 0]);
    setCombo(0);
    setShowCombo(false);
    setScreen('game');
    
    setTimeout(() => {
        runGameEngine();
        startQuestion();
    }, 100);`
);

fs.writeFileSync('src/views/BubblePop.tsx', code);
