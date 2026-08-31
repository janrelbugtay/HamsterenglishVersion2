const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

code = code.replace(
    /        ctx\.restore\(\);\n    \}/,
    `        ctx.restore();
    }
    
    // Debug info
    ctx.fillStyle = "red";
    ctx.font = "20px Arial";
    if (videoRef.current) {
        ctx.fillText("Video readyState: " + videoRef.current.readyState + " | width: " + videoRef.current.videoWidth, 20, 50);
    } else {
        ctx.fillText("No videoRef", 20, 50);
    }`
);

fs.writeFileSync('src/views/BubblePop.tsx', code);
