const fs = require('fs');

let content = fs.readFileSync('src/views/BubblePop.tsx', 'utf-8');

// We need a state for currentQuestionIndex so it renders
if (!content.includes('const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);')) {
    content = content.replace('const [questionText, setQuestionText] = useState("Loading...");', 'const [questionText, setQuestionText] = useState("Loading...");\n  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);');
}

// Update startGameMode
const startGameModeBlock = `const startGameMode = (players: number) => {
    setNumPlayers(players);
    gameState.current.numPlayers = players;
    setScores([0, 0]);
    gameState.current.scores = [0, 0];
    gameState.current.currentQuestionIndex = 0;
    setCurrentQuestionIndex(0);
    gameState.current.correctPops = 0;
    gameState.current.wrongPops = 0;
    gameState.current.combo = 0;
    gameState.current.maxCombo = 0;
    setCombo(0);
    setShowCombo(false);`;

content = content.replace(/const startGameMode = \(players: number\) => \{[^]*?setShowCombo\(false\);/m, startGameModeBlock);

// Update startQuestion
content = content.replace(/gameState\.current\.currentQuestionIndex\+\+;/g, "gameState.current.currentQuestionIndex++;\n                setCurrentQuestionIndex(gameState.current.currentQuestionIndex);");

// Update Question counter in HTML
content = content.replace(/\{gameState\.current\.currentQuestionIndex \+ 1\}/g, "{currentQuestionIndex + 1}");

fs.writeFileSync('src/views/BubblePop.tsx', content);
console.log("Updated Question Index logic.");
