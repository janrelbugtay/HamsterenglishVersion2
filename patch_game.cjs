const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

// Add states for settings
const stateStr = `  const [cameraError, setCameraError] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);`;
const newStateStr = `  const [cameraError, setCameraError] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [p1Name, setP1Name] = useState("P1");
  const [p2Name, setP2Name] = useState("P2");
  const [speed, setSpeed] = useState(1);
  const [bubbleSize, setBubbleSize] = useState(1);
  const [twistEnabled, setTwistEnabled] = useState(false);`;
code = code.replace(stateStr, newStateStr);

// Add to gameState
const gameStateStr = `  const gameState = useRef({
    isActive: false,
    numPlayers: 1,
    scores: [0, 0],
    currentQuestionIndex: 0,
    combo: 0,
    maxCombo: 0,
    correctPops: 0,
    wrongPops: 0,
    questionStartTime: 0,
    questions: [] as Question[]
  });`;
const newGameStateStr = `  const gameState = useRef({
    isActive: false,
    numPlayers: 1,
    scores: [0, 0],
    currentQuestionIndex: 0,
    combo: 0,
    maxCombo: 0,
    correctPops: 0,
    wrongPops: 0,
    questionStartTime: 0,
    questions: [] as Question[],
    speed: 1,
    size: 1,
    twist: false
  });`;
code = code.replace(gameStateStr, newGameStateStr);

// Modify Bubble constructor
const bubbleRadiusStr = `this.radius = Math.min(w, h) * 0.09;`;
const newBubbleRadiusStr = `this.radius = Math.min(w, h) * 0.09 * (gameState.current.size || 1);`;
code = code.replace(bubbleRadiusStr, newBubbleRadiusStr);

const bubbleVyStr = `this.baseVy = 1.5 + Math.random();
          this.vy = this.baseVy;
          this.vx = (Math.random() - 0.5) * 1.5;`;
const newBubbleVyStr = `this.baseVy = (1.5 + Math.random()) * (gameState.current.speed || 1);
          this.vy = this.baseVy;
          this.vx = (Math.random() - 0.5) * 1.5 * (gameState.current.speed || 1);`;
code = code.replace(bubbleVyStr, newBubbleVyStr);

// Modify Bubble update
const bubbleUpdateStr = `          this.time += 0.05;
          this.scale += (this.targetScale - this.scale) * 0.15;
          this.x += this.vx + Math.sin(this.time) * 1.5;
          this.y += this.vy + Math.cos(this.time * 0.5) * 0.5;`;
const newBubbleUpdateStr = `          this.time += 0.05 * (gameState.current.speed || 1);
          this.scale += (this.targetScale - this.scale) * 0.15;
          
          if (gameState.current.twist) {
              this.vx += Math.sin(this.time) * 0.2 * (gameState.current.speed || 1);
              this.x += this.vx;
          } else {
              this.x += this.vx + Math.sin(this.time) * 1.5 * (gameState.current.speed || 1);
          }
          
          this.y += this.vy + Math.cos(this.time * 0.5) * 0.5 * (gameState.current.speed || 1);`;
code = code.replace(bubbleUpdateStr, newBubbleUpdateStr);

// Pass settings to gameState on startGameMode
const startGameModeStr = `  const startGameMode = (players: number) => {
    setNumPlayers(players);
    gameState.current.numPlayers = players;
    setScreen('loading');`;
const newStartGameModeStr = `  const startGameMode = (players: number) => {
    setNumPlayers(players);
    gameState.current.numPlayers = players;
    gameState.current.speed = speed;
    gameState.current.size = bubbleSize;
    gameState.current.twist = twistEnabled;
    setScreen('loading');`;
code = code.replace(startGameModeStr, newStartGameModeStr);

// Draw dividing line
const drawLineStr = `    ctx.clearRect(0, 0, width, height);

    // Video rendering handled by DOM element underneath the canvas now.`;
const newDrawLineStr = `    ctx.clearRect(0, 0, width, height);

    if (gameState.current.numPlayers === 2) {
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([15, 15]);
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.stroke();
        ctx.restore();
    }

    // Video rendering handled by DOM element underneath the canvas now.`;
code = code.replace(drawLineStr, newDrawLineStr);

// Fix player labels
const p1ScoreStr = `{numPlayers === 2 ? 'P1' : ''}`;
code = code.replace(p1ScoreStr, `{numPlayers === 2 ? p1Name : ''}`);

const p2ScoreStr = `P2`; // Be careful replacing this, let's look at the UI where P2 is shown.

fs.writeFileSync('src/views/BubblePop.tsx', code);
console.log('Patch complete');
