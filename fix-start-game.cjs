const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

code = code.replace(
    /    if \(!videoRef\.current\?\.srcObject\) \{\n       await setupCamera\(\);\n    \}/,
    `    if (!videoRef.current?.srcObject) {
       try {
           await setupCamera();
       } catch (err) {
           // Error is already handled by setupCamera setting cameraError
           return;
       }
    }`
);

fs.writeFileSync('src/views/BubblePop.tsx', code);
