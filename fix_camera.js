const fs = require('fs');

let content = fs.readFileSync('src/views/BubblePop.tsx', 'utf-8');

// 1. Add a useEffect to trigger setupCamera on mount
const initCameraHook = `
  useEffect(() => {
    if (screen === 'setup' && !isCameraActive && !cameraRef.current && !cameraError) {
        setupCamera().catch(e => console.error("Initial camera setup failed:", e));
    }
  }, [screen, isCameraActive, cameraError]);
`;

// Insert right before useEffect for handleMouseMove (which is around line 944)
content = content.replace(
  "useEffect(() => {\n    if (canvasRef.current && screen === 'game') {",
  initCameraHook + "\n  useEffect(() => {\n    if (canvasRef.current && screen === 'game') {"
);

// 2. Change the background of the setup screen to be slightly transparent
content = content.replace(
  "className=\"absolute inset-0 z-40 bg-gradient-to-b from-sky-400 to-blue-200 dark:from-sky-900 dark:to-blue-950 flex flex-col items-center justify-center p-8 overflow-hidden\"",
  "className=\"absolute inset-0 z-40 bg-gradient-to-b from-sky-400/80 to-blue-200/80 dark:from-sky-900/80 dark:to-blue-950/80 flex flex-col items-center justify-center p-8 overflow-hidden backdrop-blur-sm\""
);

fs.writeFileSync('src/views/BubblePop.tsx', content);
console.log("Fixed camera.");
