const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

code = code.replace(
    /    gameState\.current = \{\n        isActive: true,\n        numPlayers: players,\n        scores: \[0, 0\],\n        currentQuestionIndex: 0,\n        combo: 0,\n        maxCombo: 0,\n        correctPops: 0,\n        wrongPops: 0,\n        questionStartTime: 0,\n        questions: activeQuiz \? \[\.\.\.activeQuiz\.questions\]\.sort\(\(\) => 0\.5 - Math\.random\(\)\)\.slice\(0, Math\.min\(5, activeQuiz\.questions\.length\)\) : \[\]\n    \};\n    \n    setScores\(\[0, 0\]\);\n    setCombo\(0\);\n    setShowCombo\(false\);\n    setScreen\('game'\);\n    \n    setTimeout\(\(\) => \{\n        runGameEngine\(\);\n        startQuestion\(\);\n    \}, 100\);/,
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

code = code.replace(
    /                    <button onClick=\{\(\) => \{\n                        if \(cameraRef\.current && cameraRef\.current\.stop\) cameraRef\.current\.stop\(\);\n                        setScreen\('setup'\);\n                    \}\} className="px-6 py-3 bg-slate-800 text-white rounded-full font-bold hover:bg-slate-700 transition-colors">\n                        Back to Setup\n                    <\/button>/,
    `                    <div className="flex gap-4">
                        <button onClick={() => {
                            if (cameraRef.current && cameraRef.current.stop) cameraRef.current.stop();
                            setScreen('setup');
                        }} className="px-6 py-3 bg-slate-800 text-white rounded-full font-bold hover:bg-slate-700 transition-colors">
                            Back to Setup
                        </button>
                        <button onClick={() => continueStartGame(numPlayers)} className="px-6 py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">
                            Play with Mouse Instead
                        </button>
                    </div>`
);

fs.writeFileSync('src/views/BubblePop.tsx', code);
