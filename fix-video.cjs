const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

code = code.replace(
    /if \(videoRef\.current && videoRef\.current\.readyState >= 2\) \{/,
    'if (videoRef.current && videoRef.current.readyState >= 2 && videoRef.current.videoWidth > 0) {'
);

fs.writeFileSync('src/views/BubblePop.tsx', code);
