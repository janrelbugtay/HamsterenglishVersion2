const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

code = code.replace(
    'const animationRef = useRef<number | null>(null);',
    'const animationRef = useRef<number | null>(null);\n  const cameraRef = useRef<any>(null);\n  const handsRef = useRef<any>(null);\n  const [cameraError, setCameraError] = useState("");'
);

code = code.replace(
    /const setupCamera = async \(\) => \{\n    try \{\n        const win = window as any;\n        if \(win\.Hands && win\.Camera\) \{\n            const hands = new win\.Hands/g,
    `const setupCamera = async () => {
    try {
        setCameraError("");
        const win = window as any;
        if (win.Hands && win.Camera) {
            const hands = new win.Hands`
);

code = code.replace(
    /            hands\.onResults\(onResults\);\n            \n            if \(videoRef\.current\) \{\n                const camera = new win\.Camera\(videoRef\.current, \{\n                    onFrame: async \(\) => \{ if \(videoRef\.current\) await hands\.send\(\{image: videoRef\.current\}\); \},\n                    width: 1280, height: 720\n                \}\);\n                await camera\.start\(\);\n            \}\n        \}\n    \} catch \(e\) \{\n        console\.error\(e\);\n    \}/,
    `            hands.onResults(onResults);
            handsRef.current = hands;
            
            if (videoRef.current) {
                const camera = new win.Camera(videoRef.current, {
                    onFrame: async () => { if (videoRef.current) await hands.send({image: videoRef.current}); },
                    width: 1280, height: 720
                });
                cameraRef.current = camera;
                await camera.start();
            }
        }
    } catch (e: any) {
        console.error("Camera setup failed:", e);
        setCameraError(e.message || "Could not start video source. Please check permissions or if another app is using the camera.");
    }`
);

fs.writeFileSync('src/views/BubblePop.tsx', code);
