const fs = require('fs');
let code = fs.readFileSync('src/views/BubblePop.tsx', 'utf8');

const saveStr = `        gameType: "bubble-pop",
        customQuestions: quiz.questions,
        userId: user.uid,
        updatedAt: new Date().toISOString(),`;
        
const newSaveStr = `        gameType: "bubble-pop",
        customQuestions: quiz.questions,
        userId: user.uid,
        updatedAt: new Date().toISOString(),
        isPublic: quiz.isPublic ?? false,`;

code = code.replace(saveStr, newSaveStr);
fs.writeFileSync('src/views/BubblePop.tsx', code);
