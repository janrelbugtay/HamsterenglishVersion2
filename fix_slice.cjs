const fs = require('fs');

let content = fs.readFileSync('src/views/BubblePop.tsx', 'utf-8');

// Change `.slice(0, Math.min(5, activeQuiz.questions.length))` to just load all questions.
const targetSlice = 'questions: activeQuiz ? [...activeQuiz.questions].sort(() => 0.5 - Math.random()).slice(0, Math.min(5, activeQuiz.questions.length)) : [],';
const replaceSlice = 'questions: activeQuiz ? [...activeQuiz.questions].sort(() => 0.5 - Math.random()) : [],';

content = content.replace(targetSlice, replaceSlice);
fs.writeFileSync('src/views/BubblePop.tsx', content);
console.log("Fixed slice limit on questions array.");
