const fs = require('fs');

const bubble = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');
const editorMatch = bubble.match(/function QuizEditor\([\s\S]*?^}$/m);
// actually just find the function
