const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

code = code.replace(
    /        console\.error\("Camera setup failed:", e\);\n        setCameraError\(e\.message || "Could not start video source\. Please check permissions or if another app is using the camera\."\);\n    \}/,
    `        console.error("Camera setup failed:", e);
        setCameraError(e.message || "Could not start video source. Please check permissions or if another app is using the camera.");
        throw e;
    }`
);

fs.writeFileSync('src/views/BubblePop.tsx', code);
