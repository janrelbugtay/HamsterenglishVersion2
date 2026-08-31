const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

code = code.replace(
    /        console\.error\("Camera setup failed:", e\);\n        setCameraError\(e\.message \|\| "Could not start video source\. Please check permissions or if another app is using the camera\."\);\n        throw e;\n    \}/,
    ''
);

fs.writeFileSync('src/views/BubblePop.tsx', code);
