const fs = require('fs');
let content = fs.readFileSync('src/views/YogaQuiz.tsx', 'utf-8');

const modalRegex = /\{activePoseSettingsIndex !== null && \(.*?(?=<\/div>\s*<\/div>\s*<\/div>\s*\)\s*\}\s*<AnimatePresence>)/s;

content = content.replace(modalRegex, '');

fs.writeFileSync('src/views/YogaQuiz.tsx', content);
console.log("Modal removed");
