const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

code = code.replace(
    /        onClick=\{\(\) => \{\n            gameState\.current\.isActive = false;\n            onViewChange\("home"\);\n        \}\}/,
    `        onClick={() => {
            gameState.current.isActive = false;
            if (cameraRef.current && cameraRef.current.stop) cameraRef.current.stop();
            if (handsRef.current && handsRef.current.close) handsRef.current.close();
            onViewChange("home");
        }}`
);

fs.writeFileSync('src/views/BubblePop.tsx', code);
