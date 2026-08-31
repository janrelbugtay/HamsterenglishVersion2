const fs = require('fs');
const content = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');
const match = content.match(/if \(videoRef.current &&.*\{([\s\S]*?)ctx\.restore\(\);\n    \}/);
if (match) console.log(match[0]);
