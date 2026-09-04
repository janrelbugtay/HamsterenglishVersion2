const fs = require('fs');
let content = fs.readFileSync('src/views/BubblePop.tsx', 'utf-8');
content = content.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\}/, "</div>\n          </div>\n      )}");
fs.writeFileSync('src/views/BubblePop.tsx', content);
console.log("Fixed extra div");
